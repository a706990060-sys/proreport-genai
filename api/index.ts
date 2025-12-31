// Vercel Serverless Function - 直接在函数中实现所有路由
import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 加载环境变量
dotenv.config();

// 存储服务和中间件的延迟加载
let app: express.Application | null = null;
let isInitialized = false;

// 初始化应用（延迟加载）
async function initializeApp() {
    if (isInitialized && app) {
        return app;
    }

    try {
        // 动态导入存储服务和类型
        const storageModule = await import('../server/src/services/storageService.js');
        const userStorage = storageModule.userStorage;
        const projectStorage = storageModule.projectStorage;
        const libraryStorage = storageModule.libraryStorage;
        
        const jwtModule = await import('../server/src/config/jwt.js');
        const JWT_SECRET = jwtModule.JWT_SECRET;
        
        const authModule = await import('../server/src/middleware/auth.js');
        const authenticateToken = authModule.authenticateToken;
        const AuthRequest = authModule.AuthRequest;
        
        const typesModule = await import('../server/src/types/index.js');
        const User = typesModule.User;
        const Project = typesModule.Project;
        const ReferenceFile = typesModule.ReferenceFile;
        const ReferenceGroup = typesModule.ReferenceGroup;
        
        const geminiModule = await import('../server/src/services/geminiService.js');
        const generateSectionContent = geminiModule.generateSectionContent;
        const refineSectionContent = geminiModule.refineSectionContent;

        console.log('✅ 所有模块导入成功');

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
                const newUser: any = {
                    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                    username: username.trim(),
                    email: email?.trim(),
                    createdAt: Date.now(),
                    lastLoginAt: Date.now(),
                    passwordHash
                };

                if (userStorage.create) {
                    await userStorage.create(newUser);
                } else {
                    const users = await userStorage.getAll();
                    users.push(newUser);
                    await userStorage.save(users);
                }

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
                if (userStorage.update) {
                    await userStorage.update(user);
                } else {
                    const users = await userStorage.getAll();
                    const updatedUsers = users.map((u: any) => u.id === user.id ? user : u);
                    await userStorage.save(updatedUsers);
                }

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

        expressApp.get('/api/auth/me', authenticateToken, async (req: any, res) => {
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
        expressApp.get('/api/projects', authenticateToken, async (req: any, res) => {
            try {
                const projects = await projectStorage.getAll(req.userId!);
                res.json({ success: true, data: projects });
            } catch (error: any) {
                console.error('获取项目列表失败:', error);
                res.status(500).json({ success: false, error: error.message || '获取项目列表失败' });
            }
        });

        expressApp.get('/api/projects/:id', authenticateToken, async (req: any, res) => {
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

        expressApp.post('/api/projects', authenticateToken, async (req: any, res) => {
            try {
                const project: any = {
                    ...req.body,
                    id: 'proj-' + Date.now(),
                    userId: req.userId!,
                    lastModified: Date.now(),
                    history: []
                };

                if (projectStorage.create) {
                    await projectStorage.create(project);
                } else {
                    const projects = await projectStorage.getAll(req.userId!);
                    projects.push(project);
                    await projectStorage.save(req.userId!, projects);
                }

                res.json({ success: true, data: project });
            } catch (error: any) {
                console.error('创建项目失败:', error);
                res.status(500).json({ success: false, error: error.message || '创建项目失败' });
            }
        });

        expressApp.put('/api/projects/:id', authenticateToken, async (req: any, res) => {
            try {
                const updatedProject: any = {
                    ...req.body,
                    id: req.params.id,
                    userId: req.userId!,
                    lastModified: Date.now()
                };

                if (projectStorage.update) {
                    await projectStorage.update(updatedProject);
                } else {
                    const projects = await projectStorage.getAll(req.userId!);
                    const index = projects.findIndex((p: any) => p.id === req.params.id);
                    if (index === -1) {
                        return res.status(404).json({ success: false, error: '项目不存在' });
                    }
                    projects[index] = updatedProject;
                    await projectStorage.save(req.userId!, projects);
                }

                res.json({ success: true, data: updatedProject });
            } catch (error: any) {
                console.error('更新项目失败:', error);
                res.status(500).json({ success: false, error: error.message || '更新项目失败' });
            }
        });

        expressApp.delete('/api/projects/:id', authenticateToken, async (req: any, res) => {
            try {
                if (projectStorage.delete) {
                    await projectStorage.delete(req.userId!, req.params.id);
                } else {
                    const projects = await projectStorage.getAll(req.userId!);
                    const filtered = projects.filter((p: any) => p.id !== req.params.id);
                    await projectStorage.save(req.userId!, filtered);
                }

                res.json({ success: true, message: '项目已删除' });
            } catch (error: any) {
                console.error('删除项目失败:', error);
                res.status(500).json({ success: false, error: error.message || '删除项目失败' });
            }
        });

        // ========== 资料库路由 ==========
        expressApp.get('/api/library/files', authenticateToken, async (req: any, res) => {
            try {
                const files = await libraryStorage.getFiles(req.userId!);
                res.json({ success: true, data: files });
            } catch (error: any) {
                console.error('获取资料库文件失败:', error);
                res.status(500).json({ success: false, error: error.message || '获取资料库文件失败' });
            }
        });

        expressApp.post('/api/library/files', authenticateToken, async (req: any, res) => {
            try {
                const files: ReferenceFile[] = req.body;
                await libraryStorage.saveFiles(req.userId!, files);
                res.json({ success: true, message: '资料库文件已保存' });
            } catch (error: any) {
                console.error('保存资料库文件失败:', error);
                res.status(500).json({ success: false, error: error.message || '保存资料库文件失败' });
            }
        });

        expressApp.get('/api/library/groups', authenticateToken, async (req: any, res) => {
            try {
                const groups = await libraryStorage.getGroups(req.userId!);
                res.json({ success: true, data: groups });
            } catch (error: any) {
                console.error('获取资料库分组失败:', error);
                res.status(500).json({ success: false, error: error.message || '获取资料库分组失败' });
            }
        });

        expressApp.post('/api/library/groups', authenticateToken, async (req: any, res) => {
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
        expressApp.post('/api/generate/section', authenticateToken, async (req: any, res) => {
            try {
                const result = await generateSectionContent(req.body);
                res.json({ success: true, data: result });
            } catch (error: any) {
                console.error('生成章节内容失败:', error);
                res.status(500).json({ success: false, error: error.message || '生成章节内容失败' });
            }
        });

        expressApp.post('/api/generate/refine', authenticateToken, async (req: any, res) => {
            try {
                const result = await refineSectionContent(req.body);
                res.json({ success: true, data: result });
            } catch (error: any) {
                console.error('修改/扩写章节内容失败:', error);
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
