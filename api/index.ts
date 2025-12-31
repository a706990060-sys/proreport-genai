// Vercel Serverless Function - 完全自包含版本，不依赖 server 目录
import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoClient, Db, Collection } from 'mongodb';
import { GoogleGenAI } from '@google/genai';
import type { User, Project, ReferenceFile, ReferenceGroup, AuthRequest, GenerateContentRequest, RefineContentRequest } from './types.js';

// 加载环境变量
dotenv.config();

// ========== JWT 配置 ==========
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
if (!process.env.JWT_SECRET) {
    console.warn('⚠️  警告: JWT_SECRET未在环境变量中设置，使用默认值。生产环境请务必设置JWT_SECRET！');
}

// ========== MongoDB 服务（内联） ==========
const MONGODB_URI = process.env.MONGODB_URI || '';
const DB_NAME = 'proreport_genai';

let mongoClient: MongoClient | null = null;
let mongoDb: Db | null = null;

async function getMongoDb(): Promise<Db> {
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI 环境变量未设置。在 Vercel 部署中必须使用 MongoDB。请在 Vercel 项目设置中配置 MONGODB_URI 环境变量。');
    }

    if (mongoDb) {
        return mongoDb;
    }

    if (!mongoClient) {
        mongoClient = new MongoClient(MONGODB_URI);
        await mongoClient.connect();
        console.log('✅ 已连接到 MongoDB');
    }

    mongoDb = mongoClient.db(DB_NAME);
    return mongoDb;
}

async function getCollection<T>(name: string): Promise<Collection<T>> {
    const database = await getMongoDb();
    return database.collection<T>(name);
}

// 存储服务（直接使用 MongoDB）
const userStorage = {
    async getAll(): Promise<User[]> {
        const collection = await getCollection<User>('users');
        return await collection.find({}).toArray();
    },
    async findById(id: string): Promise<User | null> {
        const collection = await getCollection<User>('users');
        return await collection.findOne({ id });
    },
    async findByUsername(username: string): Promise<User | null> {
        const collection = await getCollection<User>('users');
        return await collection.findOne({ 
            username: { $regex: new RegExp(`^${username}$`, 'i') } 
        });
    },
    async create(user: User): Promise<void> {
        const collection = await getCollection<User>('users');
        await collection.insertOne(user);
    },
    async update(user: User): Promise<void> {
        const collection = await getCollection<User>('users');
        await collection.updateOne({ id: user.id }, { $set: user });
    }
};

const projectStorage = {
    async getAll(userId: string): Promise<Project[]> {
        const collection = await getCollection<Project>('projects');
        return await collection.find({ userId }).toArray();
    },
    async findById(userId: string, projectId: string): Promise<Project | null> {
        const collection = await getCollection<Project>('projects');
        return await collection.findOne({ id: projectId, userId });
    },
    async create(project: Project): Promise<void> {
        const collection = await getCollection<Project>('projects');
        await collection.insertOne(project);
    },
    async update(project: Project): Promise<void> {
        const collection = await getCollection<Project>('projects');
        await collection.updateOne({ id: project.id, userId: project.userId }, { $set: project });
    },
    async delete(userId: string, projectId: string): Promise<void> {
        const collection = await getCollection<Project>('projects');
        await collection.deleteOne({ id: projectId, userId });
    }
};

const libraryStorage = {
    async getFiles(userId: string): Promise<ReferenceFile[]> {
        const collection = await getCollection<ReferenceFile>('library_files');
        return await collection.find({ userId }).toArray();
    },
    async saveFiles(userId: string, files: ReferenceFile[]): Promise<void> {
        const collection = await getCollection<ReferenceFile>('library_files');
        await collection.deleteMany({ userId });
        if (files.length > 0) {
            const filesWithUserId = files.map(file => ({ ...file, userId }));
            await collection.insertMany(filesWithUserId);
        }
    },
    async getGroups(userId: string): Promise<ReferenceGroup[]> {
        const collection = await getCollection<ReferenceGroup>('library_groups');
        return await collection.find({ userId }).toArray();
    },
    async saveGroups(userId: string, groups: ReferenceGroup[]): Promise<void> {
        const collection = await getCollection<ReferenceGroup>('library_groups');
        await collection.deleteMany({ userId });
        if (groups.length > 0) {
            const groupsWithUserId = groups.map(group => ({ ...group, userId }));
            await collection.insertMany(groupsWithUserId);
        }
    }
};

// ========== 认证中间件（内联） ==========
const authenticateToken = (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, error: '未提供认证令牌' });
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
        if (err) {
            return res.status(403).json({ success: false, error: '无效的认证令牌' });
        }
        req.userId = decoded.userId;
        next();
    });
};

// ========== Gemini 服务（内联） ==========
const SYSTEM_INSTRUCTION = `
**Role**: You are a world-class Engineering Consulting Expert and Lead Technical Writer. You are tasked with generating or refining sections of a professional Feasibility Study Report (FSR).

**Strategic Writing Rules**:
1. **Structural Analysis (Format Reference)**: When a "Format Reference" is provided, you must perform a structural audit. Identify:
   - Heading hierarchy (e.g., how H2, H3, H4 are nested).
   - Paragraph styles and indentation logic.
   - List formats (bulleted, numbered, sub-lists).
   - Usage of tables (frequency and layout).
   - The specific linguistic "template" of opening and closing statements.
   **CRITICAL**: Replicate this structure and style EXACTLY, but DO NOT use any factual content or text from these files.
2. **Rule Adherence (Specification Reference)**: Treat "Specification References" as mandatory legal and technical constraints. You MUST:
   - Use the exact terminology defined within.
   - Comply with all listed limits, parameters, and standards.
   - Ensure the generated content violates no rules set by these documents.
3. **Factual Grounding (Content Reference)**: Use "Content References" as the primary source of truth for project facts, descriptions, and data.
4. **Tone**: Professional, objective, third-person engineering consultant tone.
5. **Content Depth & Length**: **CRITICAL**: The content MUST be detailed, comprehensive, and exhaustive. 
   - **AVOID summaries**. Do not write high-level overviews. 
   - **EXPAND** on every point with technical details, reasoning, justifications, calculation processes, and analysis.
   - Each section must be substantial in length and depth, suitable for a formal government or bank submission. 
   - If data is missing, make reasonable professional assumptions based on industry standards to ensure the text flow is complete (while marking distinct assumptions).
6. **Output Format**: Strictly valid HTML body content (do not include <html>, <head> or <body> tags). Do not use Markdown code blocks.
   - **Heading Hierarchy (Strict Official Document Standard)**:
     The content you generate sits within a "Section" (节). You must structure the internal content using the following specific numbering and tag mapping:
     - **Tier 1 (use <h3>)**: Chinese Number + Pause Mark (e.g., <h3>一、项目建设背景</h3>)
     - **Tier 2 (use <h4>)**: Parenthesized Chinese Number (e.g., <h4>（一）政策环境分析</h4>)
     - **Tier 3 (use <h5>)**: Arabic Number + Pause Mark (e.g., <h5>1、国家政策支持</h5>)
     - **Tier 4 (use <h6>)**: Parenthesized Arabic Number (e.g., <h6>（1）十四五规划</h6>)
     - **Paragraphs (<p>)**: Standard text.
   - Do not skip levels in the hierarchy.
   - Ensure all lists are properly formatted using semantic HTML.
7. **Language**: Simplified Chinese (zh-CN).
`;

const formatSources = (response: any): string => {
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (!chunks || chunks.length === 0) return "";
    let html = `<div class="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500 source-section"><p class="font-bold mb-2">参考来源 (Sources):</p><ul class="list-disc pl-4 space-y-1">`;
    let hasValidSource = false;
    chunks.forEach((c: any) => {
        if (c.web?.uri) {
            hasValidSource = true;
            html += `<li><a href="${c.web.uri}" target="_blank" class="text-blue-600 hover:underline">${c.web.title || c.web.uri}</a></li>`;
        }
    });
    html += `</ul></div>`;
    return hasValidSource ? html : "";
};

const cleanResponse = (text: string | undefined): string => {
    if (!text) return "";
    let cleaned = text.replace(/^```html\s*/i, '').replace(/^```\s*/i, '');
    cleaned = cleaned.replace(/```\s*$/, '');
    return cleaned.trim();
};

const prepareReferenceContext = (
    contentRefs: ReferenceFile[],
    formatRefs: ReferenceFile[],
    specRefs: ReferenceFile[],
    knowledgeRefs: ReferenceFile[],
    parts: any[]
): string => {
    let instructions = "";

    if (formatRefs.length > 0) {
        instructions += "\n\n### 【格式参考：结构化解析指令】";
        formatRefs.forEach(ref => {
            parts.push({ inlineData: { mimeType: ref.mimeType, data: ref.data } });
            instructions += `\n- 目标文件: "${ref.name}"\n- 解析重点：提取 Markdown/HTML 标题层级(H1/H2/H3)、段落缩进、列表样式、表格样式、以及引言和结论的叙述风格。\n- **严禁事项：严禁参考该文件内的具体数据、事实或业务内容。仅将其作为排版和结构模板。**`;
        });
    }

    if (specRefs.length > 0) {
        instructions += "\n\n### 【规范参考：强制执行指令】";
        specRefs.forEach(ref => {
            parts.push({ inlineData: { mimeType: ref.mimeType, data: ref.data } });
            instructions += `\n- 目标规范: "${ref.name}"\n- 任务：深度分析此文件中的规定、术语和限制条件。编写内容必须严格符合其中的所有技术标准、强制性要求和专用术语定义。这是编写的红线约束。`;
        });
    }

    if (contentRefs.length > 0) {
        instructions += "\n\n### 【内容参考：事实挖掘指令】";
        contentRefs.forEach(ref => {
            if (ref.mimeType === 'text/url') {
                instructions += `\n- 网页链接: ${ref.data}。从中提取核心项目描述、现状数据及事实背景。`;
            } else {
                parts.push({ inlineData: { mimeType: ref.mimeType, data: ref.data } });
                instructions += `\n- 数据文件: "${ref.name}"。将其中的文字、图表信息作为报告的血肉，提供具体的项目支撑。`;
            }
        });
    }

    if (knowledgeRefs.length > 0) {
        instructions += "\n\n### 【额外知识库】";
        knowledgeRefs.forEach(ref => {
            if (ref.mimeType !== 'text/url') parts.push({ inlineData: { mimeType: ref.mimeType, data: ref.data } });
            instructions += `\n- 知识点: "${ref.name}"。作为通用行业背景支持。`;
        });
    }

    return instructions;
};

async function generateSectionContent(request: GenerateContentRequest): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('❌ GEMINI_API_KEY 未配置');
        console.error('请在 Vercel 项目设置中配置 GEMINI_API_KEY 环境变量');
        throw new Error('GEMINI_API_KEY 未配置。请在 Vercel 项目设置 → Environment Variables 中添加 GEMINI_API_KEY。获取密钥：https://aistudio.google.com/');
    }

    const ai = new GoogleGenAI({ apiKey });
    const parts: any[] = [];
    
    const refPrompt = prepareReferenceContext(
        request.contentRefs || [],
        request.formatRefs || [],
        request.specRefs || [],
        request.knowledgeRefs || [],
        parts
    );

    const finalPrompt = `
[报告编写任务]
章节： "${request.sectionTitle}"

[大纲要求]
${request.requirement}

[项目概况与核心指示]
${request.userInputs}

${refPrompt}

[最终产出准则]
- **深度要求：内容必须极为详尽，严禁生成空洞的摘要。每一个论点都需要有充分的论据、数据或逻辑支撑。请尽可能多地生成相关细节。**
- **篇幅要求：请充分展开论述，不要吝啬字数。对于每一个子话题，都要深入挖掘。**
- **标题格式强制要求**：
  - 内容层级必须遵循公文标准：
  - 第一级标题使用 "一、" (用 <h3> 标签)
  - 第二级标题使用 "（一）" (用 <h4> 标签)
  - 第三级标题使用 "1、" (用 <h5> 标签)
  - 第四级标题使用 "（1）" (用 <h6> 标签)
- 输出必须为纯 HTML 格式。
- 不要使用 Markdown 代码块符号。
- 逻辑需符合专业工程咨询标准。
- 如果存在"格式参考"，其标题分级和排版逻辑必须被复刻。
- 如果存在"规范参考"，其术语和限制条件必须被无条件遵守。
- 数据内容必须源自"内容参考"和"项目概况"。
`;

    parts.push({ text: finalPrompt });

    try {
        const config: any = { 
            systemInstruction: SYSTEM_INSTRUCTION, 
            temperature: 0.3,
            topK: 30,
            topP: 0.95
        };
        if (request.useSearch) config.tools = [{ googleSearch: {} }];

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: { parts: parts },
            config: config
        });

        const rawText = response.text || "";
        return cleanResponse(rawText) + (request.useSearch ? formatSources(response) : "");
    } catch (error: any) {
        console.error("Gemini Generation Failed:", error);
        throw new Error(`生成中断: ${error.message || "未知API错误"}`);
    }
}

async function refineSectionContent(request: RefineContentRequest): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('❌ GEMINI_API_KEY 未配置');
        console.error('请在 Vercel 项目设置中配置 GEMINI_API_KEY 环境变量');
        throw new Error('GEMINI_API_KEY 未配置。请在 Vercel 项目设置 → Environment Variables 中添加 GEMINI_API_KEY。获取密钥：https://aistudio.google.com/');
    }

    const ai = new GoogleGenAI({ apiKey });
    const parts: any[] = [];
    
    const refPrompt = prepareReferenceContext(
        request.contentRefs || [],
        request.formatRefs || [],
        request.specRefs || [],
        request.knowledgeRefs || [],
        parts
    );

    const finalPrompt = `
[内容修补/扩写任务]
目标章节： "${request.sectionTitle}"

[当前全篇内容]
"""
${request.fullCurrentHtml}
"""

[待修改/优化片段]
"${request.selectedText}"

[修改指示]
"${request.userInstruction}"

${refPrompt}

[任务说明]
请基于以上指示和最新的参考资料，重写或扩写选中的片段。输出必须包含该章节完整的、更新后的 HTML 代码。
**特别强调：如果指示中包含"扩写"、"详细"等词汇，请大幅增加内容的深度和广度，补充专业细节。**
**格式要求**：严格遵守公文标题层级（<h3>一、...</h3>, <h4>（一）...</h4>, <h5>1、...</h5>, <h6>（1）...</h6>）。
只输出 HTML，不要输出 Markdown 标记。
`;

    parts.push({ text: finalPrompt });

    try {
        const config: any = { 
            systemInstruction: SYSTEM_INSTRUCTION, 
            temperature: 0.3 
        };
        if (request.useSearch) config.tools = [{ googleSearch: {} }];

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: { parts: parts },
            config: config
        });

        return cleanResponse(response.text) || request.fullCurrentHtml;
    } catch (error: any) {
        console.error("Gemini Refinement Failed:", error);
        throw new Error(`生成中断: ${error.message || "未知API错误"}`);
    }
}

// ========== Express 应用初始化 ==========
let app: express.Application | null = null;
let isInitialized = false;

async function initializeApp() {
    if (isInitialized && app) {
        return app;
    }

    try {
        console.log('开始初始化应用...');
        console.log('MONGODB_URI:', process.env.MONGODB_URI ? '已设置' : '未设置');
        
        // 测试 MongoDB 连接
        if (MONGODB_URI) {
            await getMongoDb();
            console.log('✅ MongoDB 连接成功');
        } else {
            throw new Error('MONGODB_URI 环境变量未设置。请在 Vercel 项目设置中配置 MONGODB_URI 环境变量。');
        }

        // 创建Express应用
        const expressApp = express();

        // CORS配置
        expressApp.use(cors({
            origin: '*',
            credentials: true
        }));

        expressApp.use(express.json({ limit: '50mb' }));
        expressApp.use(express.urlencoded({ extended: true, limit: '50mb' }));

        // Health check
        expressApp.get('/api/health', (req, res) => {
            res.json({ success: true, message: 'Server is running on Vercel' });
        });

        // ========== 认证路由 ==========
        expressApp.post('/api/auth/register', async (req, res) => {
            try {
                const { username, password, email } = req.body;

                if (!username || username.trim().length < 3) {
                    return res.status(400).json({ success: false, error: '用户名至少需要3个字符' });
                }

                if (!password || password.length < 6) {
                    return res.status(400).json({ success: false, error: '密码至少需要6个字符' });
                }

                const existingUser = await userStorage.findByUsername(username);
                if (existingUser) {
                    return res.status(400).json({ success: false, error: '用户名已存在' });
                }

                const passwordHash = await bcrypt.hash(password, 10);
                const newUser: User = {
                    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                    username: username.trim(),
                    email: email?.trim(),
                    createdAt: Date.now(),
                    lastLoginAt: Date.now(),
                    passwordHash
                };

                await userStorage.create(newUser);

                const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

                res.json({
                    success: true,
                    data: {
                        user: { id: newUser.id, username: newUser.username, email: newUser.email },
                        token
                    }
                });
            } catch (error: any) {
                console.error('注册错误:', error);
                res.status(500).json({ success: false, error: error.message || '注册失败' });
            }
        });

        expressApp.post('/api/auth/login', async (req, res) => {
            try {
                const { username, password } = req.body;

                if (!username || !password) {
                    return res.status(400).json({ success: false, error: '请输入用户名和密码' });
                }

                const user = await userStorage.findByUsername(username);
                if (!user) {
                    return res.status(401).json({ success: false, error: '用户名或密码错误' });
                }

                const isValid = await bcrypt.compare(password, user.passwordHash);
                if (!isValid) {
                    return res.status(401).json({ success: false, error: '用户名或密码错误' });
                }

                user.lastLoginAt = Date.now();
                await userStorage.update(user);

                const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

                res.json({
                    success: true,
                    data: {
                        user: { id: user.id, username: user.username, email: user.email },
                        token
                    }
                });
            } catch (error: any) {
                console.error('登录错误:', error);
                res.status(500).json({ success: false, error: error.message || '登录失败' });
            }
        });

        expressApp.get('/api/auth/me', authenticateToken, async (req: AuthRequest, res) => {
            try {
                const user = await userStorage.findById(req.userId!);
                if (!user) {
                    return res.status(404).json({ success: false, error: '用户不存在' });
                }

                res.json({
                    success: true,
                    data: { id: user.id, username: user.username, email: user.email }
                });
            } catch (error: any) {
                console.error('获取用户信息失败:', error);
                res.status(500).json({ success: false, error: error.message || '获取用户信息失败' });
            }
        });

        // ========== 项目路由 ==========
        expressApp.get('/api/projects', authenticateToken, async (req: AuthRequest, res) => {
            try {
                const projects = await projectStorage.getAll(req.userId!);
                res.json({ success: true, data: projects });
            } catch (error: any) {
                console.error('获取项目列表失败:', error);
                res.status(500).json({ success: false, error: error.message || '获取项目列表失败' });
            }
        });

        expressApp.get('/api/projects/:id', authenticateToken, async (req: AuthRequest, res) => {
            try {
                const project = await projectStorage.findById(req.userId!, req.params.id);
                if (!project) {
                    return res.status(404).json({ success: false, error: '项目不存在' });
                }
                res.json({ success: true, data: project });
            } catch (error: any) {
                console.error('获取项目失败:', error);
                res.status(500).json({ success: false, error: error.message || '获取项目失败' });
            }
        });

        expressApp.post('/api/projects', authenticateToken, async (req: AuthRequest, res) => {
            try {
                const project: Project = {
                    ...req.body,
                    id: 'proj-' + Date.now(),
                    userId: req.userId!,
                    lastModified: Date.now(),
                    history: []
                };

                await projectStorage.create(project);

                res.json({ success: true, data: project });
            } catch (error: any) {
                console.error('创建项目失败:', error);
                res.status(500).json({ success: false, error: error.message || '创建项目失败' });
            }
        });

        expressApp.put('/api/projects/:id', authenticateToken, async (req: AuthRequest, res) => {
            try {
                const updatedProject: Project = {
                    ...req.body,
                    id: req.params.id,
                    userId: req.userId!,
                    lastModified: Date.now()
                };

                await projectStorage.update(updatedProject);

                res.json({ success: true, data: updatedProject });
            } catch (error: any) {
                console.error('更新项目失败:', error);
                res.status(500).json({ success: false, error: error.message || '更新项目失败' });
            }
        });

        expressApp.delete('/api/projects/:id', authenticateToken, async (req: AuthRequest, res) => {
            try {
                await projectStorage.delete(req.userId!, req.params.id);
                res.json({ success: true, message: '项目已删除' });
            } catch (error: any) {
                console.error('删除项目失败:', error);
                res.status(500).json({ success: false, error: error.message || '删除项目失败' });
            }
        });

        // ========== 资料库路由 ==========
        expressApp.get('/api/library/files', authenticateToken, async (req: AuthRequest, res) => {
            try {
                const files = await libraryStorage.getFiles(req.userId!);
                res.json({ success: true, data: files });
            } catch (error: any) {
                console.error('获取资料库文件失败:', error);
                res.status(500).json({ success: false, error: error.message || '获取资料库文件失败' });
            }
        });

        expressApp.post('/api/library/files', authenticateToken, async (req: AuthRequest, res) => {
            try {
                const files: ReferenceFile[] = req.body;
                await libraryStorage.saveFiles(req.userId!, files);
                res.json({ success: true, message: '资料库文件已保存' });
            } catch (error: any) {
                console.error('保存资料库文件失败:', error);
                res.status(500).json({ success: false, error: error.message || '保存资料库文件失败' });
            }
        });

        expressApp.get('/api/library/groups', authenticateToken, async (req: AuthRequest, res) => {
            try {
                const groups = await libraryStorage.getGroups(req.userId!);
                res.json({ success: true, data: groups });
            } catch (error: any) {
                console.error('获取资料库分组失败:', error);
                res.status(500).json({ success: false, error: error.message || '获取资料库分组失败' });
            }
        });

        expressApp.post('/api/library/groups', authenticateToken, async (req: AuthRequest, res) => {
            try {
                const groups: ReferenceGroup[] = req.body;
                await libraryStorage.saveGroups(req.userId!, groups);
                res.json({ success: true, message: '资料库分组已保存' });
            } catch (error: any) {
                console.error('保存资料库分组失败:', error);
                res.status(500).json({ success: false, error: error.message || '保存资料库分组失败' });
            }
        });

        // ========== 生成路由 ==========
        expressApp.post('/api/generate/section', authenticateToken, async (req: AuthRequest, res) => {
            try {
                console.log('收到生成请求:', {
                    userId: req.userId,
                    sectionTitle: req.body?.sectionTitle,
                    hasRequirement: !!req.body?.requirement,
                    hasUserInputs: !!req.body?.userInputs,
                    contentRefsCount: req.body?.contentRefs?.length || 0,
                    formatRefsCount: req.body?.formatRefs?.length || 0,
                    specRefsCount: req.body?.specRefs?.length || 0,
                    knowledgeRefsCount: req.body?.knowledgeRefs?.length || 0,
                    useSearch: req.body?.useSearch || false
                });
                
                if (!req.body?.sectionTitle) {
                    return res.status(400).json({ success: false, error: '缺少章节标题' });
                }
                
                const result = await generateSectionContent(req.body);
                console.log('生成成功，内容长度:', result?.length || 0);
                res.json({ success: true, data: result });
            } catch (error: any) {
                console.error('生成章节内容失败:', error);
                console.error('错误详情:', {
                    message: error.message,
                    stack: error.stack,
                    name: error.name
                });
                res.status(500).json({ success: false, error: error.message || '生成章节内容失败' });
            }
        });

        expressApp.post('/api/generate/refine', authenticateToken, async (req: AuthRequest, res) => {
            try {
                console.log('收到修改请求:', {
                    userId: req.userId,
                    sectionTitle: req.body?.sectionTitle,
                    selectedTextLength: req.body?.selectedText?.length || 0,
                    fullCurrentHtmlLength: req.body?.fullCurrentHtml?.length || 0,
                    userInstructionLength: req.body?.userInstruction?.length || 0
                });
                
                if (!req.body?.sectionTitle) {
                    return res.status(400).json({ success: false, error: '缺少章节标题' });
                }
                
                const result = await refineSectionContent(req.body);
                console.log('修改成功，内容长度:', result?.length || 0);
                res.json({ success: true, data: result });
            } catch (error: any) {
                console.error('修改/扩写章节内容失败:', error);
                console.error('错误详情:', {
                    message: error.message,
                    stack: error.stack,
                    name: error.name
                });
                res.status(500).json({ success: false, error: error.message || '修改/扩写章节内容失败' });
            }
        });

        // Error handling middleware
        expressApp.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.error('Error:', err);
            res.status(err.status || 500).json({
                success: false,
                error: err.message || 'Internal server error'
            });
        });

        app = expressApp;
        isInitialized = true;
        console.log('✅ 应用初始化成功');
        return app;
    } catch (error: any) {
        console.error('❌ 应用初始化失败:', error);
        throw error;
    }
}

// Vercel Serverless Function handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        console.log('API请求:', req.method, req.url);
        
        // 初始化应用（如果尚未初始化）
        const expressApp = await initializeApp();
        
        // 将Vercel请求转换为Express请求
        return new Promise((resolve, reject) => {
            res.on('finish', resolve);
            res.on('error', reject);
            expressApp(req as any, res as any);
        });
    } catch (error: any) {
        console.error('Handler错误:', error);
        return res.status(500).json({ 
            success: false, 
            error: error.message || '服务器错误',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}
