import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { projectStorage } from '../services/storageService.js';
import { Project, ApiResponse } from '../types/index.js';

const router = express.Router();

// 所有路由都需要认证
router.use(authenticateToken);

// 获取所有项目
router.get('/', async (req: AuthRequest, res) => {
    try {
        const projects = await projectStorage.getAll(req.userId!);
        res.json({ success: true, data: projects });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 获取单个项目
router.get('/:id', async (req: AuthRequest, res) => {
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

// 创建项目
router.post('/', async (req: AuthRequest, res) => {
    try {
        const project: Project = {
            ...req.body,
            id: 'proj-' + Date.now(),
            userId: req.userId!,
            lastModified: Date.now(),
            history: []
        };

        // 使用create方法（如果支持）或save方法
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

// 更新项目
router.put('/:id', async (req: AuthRequest, res) => {
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

        // 使用update方法（如果支持）或save方法
        if (projectStorage.update) {
            await projectStorage.update(updatedProject);
            res.json({ success: true, data: updatedProject });
        } else {
            projects[index] = updatedProject;
            await projectStorage.save(req.userId!, projects);
            res.json({ success: true, data: updatedProject });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 删除项目
router.delete('/:id', async (req: AuthRequest, res) => {
    try {
        // 使用delete方法（如果支持）或save方法
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

export default router;






