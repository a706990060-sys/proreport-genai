// Vercel Serverless Function - 直接在函数中实现所有路由
import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 加载环境变量
dotenv.config();

// 尝试导入存储服务和类型（使用try-catch处理导入错误）
let userStorage: any;
let projectStorage: any;
let libraryStorage: any;
let JWT_SECRET: string;
let authenticateToken: any;
let AuthRequest: any;
let User: any, Project: any, ReferenceFile: any, ReferenceGroup: any;
let generateSectionContent: any, refineSectionContent: any;

try {
    const storageModule = await import('../server/src/services/storageService.js');
    userStorage = storageModule.userStorage;
    projectStorage = storageModule.projectStorage;
    libraryStorage = storageModule.libraryStorage;
    
    const jwtModule = await import('../server/src/config/jwt.js');
    JWT_SECRET = jwtModule.JWT_SECRET;
    
    const authModule = await import('../server/src/middleware/auth.js');
    authenticateToken = authModule.authenticateToken;
    AuthRequest = authModule.AuthRequest;
    
    const typesModule = await import('../server/src/types/index.js');
    User = typesModule.User;
    Project = typesModule.Project;
    ReferenceFile = typesModule.ReferenceFile;
    ReferenceGroup = typesModule.ReferenceGroup;
    
    const geminiModule = await import('../server/src/services/geminiService.js');
    generateSectionContent = geminiModule.generateSectionContent;
    refineSectionContent = geminiModule.refineSectionContent;
    
    console.log('✅ 所有模块导入成功');
} catch (error: any) {
    console.error('❌ 模块导入失败:', error);
    // 如果导入失败，使用默认值
    JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-change-this';
}

// 创建Express应用
const app = express();

// CORS配置
app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running on Vercel' });
});

// ========== 认证路由 ==========
app.post('/api/auth/register', async (req, res) => {
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

app.post('/api/auth/login', async (req, res) => {
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
            const updatedUsers = users.map(u => u.id === user.id ? user : u);
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

app.get('/api/auth/me', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, error: '未提供认证令牌' });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);
        const user = await userStorage.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ success: false, error: '用户不存在' });
        }

        res.json({
            success: true,
            data: { id: user.id, username: user.username, email: user.email }
        });
    } catch (error: any) {
        res.status(401).json({ success: false, error: '无效的认证令牌' });
    }
});

// ========== 项目路由 ==========
app.get('/api/projects', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const projects = await projectStorage.getAll(req.userId!);
        res.json({ success: true, data: projects });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/projects/:id', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const project = await projectStorage.findById(req.userId!, req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, error: '项目不存在' });
        }
        res.json({ success: true, data: project });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/projects', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const project: Project = {
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
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/projects/:id', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const projects = await projectStorage.getAll(req.userId!);
        const index = projects.findIndex(p => p.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ success: false, error: '项目不存在' });
        }

        const updatedProject: Project = {
            ...projects[index],
            ...req.body,
            id: req.params.id,
            userId: req.userId!,
            lastModified: Date.now()
        };

        if (projectStorage.update) {
            await projectStorage.update(updatedProject);
        } else {
            projects[index] = updatedProject;
            await projectStorage.save(req.userId!, projects);
        }

        res.json({ success: true, data: updatedProject });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/projects/:id', authenticateToken, async (req: AuthRequest, res) => {
    try {
        if (projectStorage.delete) {
            await projectStorage.delete(req.userId!, req.params.id);
        } else {
            const projects = await projectStorage.getAll(req.userId!);
            const filtered = projects.filter(p => p.id !== req.params.id);
            await projectStorage.save(req.userId!, filtered);
        }

        res.json({ success: true, message: '项目已删除' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========== 资料库路由 ==========
app.get('/api/library/files', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const files = await libraryStorage.getFiles(req.userId!);
        res.json({ success: true, data: files });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/library/files', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const files: ReferenceFile[] = req.body;
        await libraryStorage.saveFiles(req.userId!, files);
        res.json({ success: true, message: '文件已保存' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/library/groups', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const groups = await libraryStorage.getGroups(req.userId!);
        res.json({ success: true, data: groups });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/library/groups', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const groups: ReferenceGroup[] = req.body;
        await libraryStorage.saveGroups(req.userId!, groups);
        res.json({ success: true, message: '分组已保存' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ========== 生成路由 ==========
app.post('/api/generate/section', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const result = await generateSectionContent(req.body);
        res.json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/generate/refine', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const result = await refineSectionContent(req.body);
        res.json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal server error'
    });
});

// Vercel Serverless Function handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        console.log('API请求:', req.method, req.url);
        
        // 确保模块已加载
        if (!userStorage) {
            console.error('存储服务未加载');
            return res.status(500).json({ 
                success: false, 
                error: '服务器初始化失败，请检查日志' 
            });
        }
        
        // 将Vercel请求转换为Express请求
        return new Promise((resolve, reject) => {
            res.on('finish', resolve);
            res.on('error', reject);
            app(req as any, res as any);
        });
    } catch (error: any) {
        console.error('Handler错误:', error);
        return res.status(500).json({ 
            success: false, 
            error: error.message || '服务器错误' 
        });
    }
}
