import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';

export interface AuthRequest extends Request {
    userId?: string;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        console.log('认证失败: 未提供token');
        return res.status(401).json({ success: false, error: '未提供认证令牌' });
    }
    
    console.log('验证token:', {
        tokenLength: token.length,
        tokenPrefix: token.substring(0, 20) + '...',
        jwtSecretLength: JWT_SECRET.length,
        jwtSecretPrefix: JWT_SECRET.substring(0, 10) + '...'
    });
    
    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
        if (err) {
            console.error('Token验证失败:', {
                error: err.message,
                name: err.name,
                tokenLength: token.length,
                jwtSecretLength: JWT_SECRET.length
            });
            return res.status(403).json({ success: false, error: '无效的认证令牌' });
        }
        console.log('Token验证成功, userId:', decoded.userId);
        req.userId = decoded.userId;
        next();
    });
};






