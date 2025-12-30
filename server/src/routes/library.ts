import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { libraryStorage } from '../services/storageService.js';
import { ReferenceFile, ReferenceGroup } from '../types/index.js';

const router = express.Router();

router.use(authenticateToken);

// 获取所有文件
router.get('/files', async (req: AuthRequest, res) => {
    try {
        const files = await libraryStorage.getFiles(req.userId!);
        res.json({ success: true, data: files });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 保存文件列表
router.post('/files', async (req: AuthRequest, res) => {
    try {
        const files: ReferenceFile[] = req.body;
        await libraryStorage.saveFiles(req.userId!, files);
        res.json({ success: true, message: '文件已保存' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 获取所有分组
router.get('/groups', async (req: AuthRequest, res) => {
    try {
        const groups = await libraryStorage.getGroups(req.userId!);
        res.json({ success: true, data: groups });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 保存分组列表
router.post('/groups', async (req: AuthRequest, res) => {
    try {
        const groups: ReferenceGroup[] = req.body;
        await libraryStorage.saveGroups(req.userId!, groups);
        res.json({ success: true, message: '分组已保存' });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;






