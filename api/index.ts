// Vercel Serverless Function - 将Express应用包装为Serverless Function
import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 动态导入路由模块
let authRoutes: any;
let projectRoutes: any;
let libraryRoutes: any;
let generateRoutes: any;

// 在函数外部初始化路由（避免重复加载）
async function initRoutes() {
    if (!authRoutes) {
        const authModule = await import('../server/src/routes/auth.js');
        authRoutes = authModule.default;
    }
    if (!projectRoutes) {
        const projectModule = await import('../server/src/routes/projects.js');
        projectRoutes = projectModule.default;
    }
    if (!libraryRoutes) {
        const libraryModule = await import('../server/src/routes/library.js');
        libraryRoutes = libraryModule.default;
    }
    if (!generateRoutes) {
        const generateModule = await import('../server/src/routes/generate.js');
        generateRoutes = generateModule.default;
    }
}

// 创建Express应用
const app = express();

// CORS配置
const allowedOrigins = process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
    : ['*']; // Vercel上允许所有来源

app.use(cors({
    origin: (origin, callback) => {
        // 允许无origin的请求
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes('*') || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check（不需要路由）
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running on Vercel' });
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
    // 初始化路由（如果还未初始化）
    await initRoutes();
    
    // 注册路由
    app.use('/api/auth', authRoutes);
    app.use('/api/projects', projectRoutes);
    app.use('/api/library', libraryRoutes);
    app.use('/api/generate', generateRoutes);
    
    // 将Vercel请求转换为Express请求
    return new Promise((resolve, reject) => {
        // 设置响应完成回调
        res.on('finish', resolve);
        res.on('error', reject);
        
        // 处理Express应用
        app(req as any, res as any);
    });
}
