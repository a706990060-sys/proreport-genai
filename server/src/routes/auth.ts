import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userStorage } from '../services/storageService.js';
import { User, UserCredentials, ApiResponse } from '../types/index.js';
import { JWT_SECRET } from '../config/jwt.js';

const router = express.Router();

// 注册
router.post('/register', async (req, res) => {
    try {
        const { username, password, email }: UserCredentials = req.body;

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

        // 使用create方法（如果支持）或save方法
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
        res.status(500).json({ success: false, error: error.message });
    }
});

// 登录
router.post('/login', async (req, res) => {
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

        // 更新最后登录时间
        user.lastLoginAt = Date.now();
        if (userStorage.update) {
            await userStorage.update(user);
        } else {
            const users = await userStorage.getAll();
            const updatedUsers = users.map(u => u.id === user.id ? user : u);
            await userStorage.save(updatedUsers);
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        console.log('登录成功，生成token:', {
            userId: user.id,
            tokenLength: token.length,
            tokenPrefix: token.substring(0, 20) + '...'
        });

        res.json({
            success: true,
            data: {
                user: { id: user.id, username: user.username, email: user.email },
                token
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 获取当前用户信息
router.get('/me', async (req, res) => {
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

export default router;






