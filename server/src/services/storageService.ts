import fs from 'fs/promises';
import path from 'path';
import { Project, ReferenceFile, ReferenceGroup, User } from '../types/index.js';

const DATA_DIR = process.env.DATA_PATH || './data';
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PROJECTS_DIR = path.join(DATA_DIR, 'projects');
const LIBRARY_DIR = path.join(DATA_DIR, 'library');

// 确保数据目录存在
async function ensureDataDir() {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(PROJECTS_DIR, { recursive: true });
    await fs.mkdir(LIBRARY_DIR, { recursive: true });
}

// 用户存储
export const userStorage = {
    async getAll(): Promise<User[]> {
        await ensureDataDir();
        try {
            const data = await fs.readFile(USERS_FILE, 'utf-8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    },

    async save(users: User[]): Promise<void> {
        await ensureDataDir();
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    },

    async findById(id: string): Promise<User | null> {
        const users = await this.getAll();
        return users.find(u => u.id === id) || null;
    },

    async findByUsername(username: string): Promise<User | null> {
        const users = await this.getAll();
        return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
    }
};

// 项目存储
export const projectStorage = {
    async getAll(userId: string): Promise<Project[]> {
        await ensureDataDir();
        const userProjectsFile = path.join(PROJECTS_DIR, `${userId}.json`);
        try {
            const data = await fs.readFile(userProjectsFile, 'utf-8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    },

    async save(userId: string, projects: Project[]): Promise<void> {
        await ensureDataDir();
        const userProjectsFile = path.join(PROJECTS_DIR, `${userId}.json`);
        await fs.writeFile(userProjectsFile, JSON.stringify(projects, null, 2));
    },

    async findById(userId: string, projectId: string): Promise<Project | null> {
        const projects = await this.getAll(userId);
        return projects.find(p => p.id === projectId) || null;
    }
};

// 资料库存储
export const libraryStorage = {
    async getFiles(userId: string): Promise<ReferenceFile[]> {
        await ensureDataDir();
        const userLibraryFile = path.join(LIBRARY_DIR, `${userId}_files.json`);
        try {
            const data = await fs.readFile(userLibraryFile, 'utf-8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    },

    async saveFiles(userId: string, files: ReferenceFile[]): Promise<void> {
        await ensureDataDir();
        const userLibraryFile = path.join(LIBRARY_DIR, `${userId}_files.json`);
        await fs.writeFile(userLibraryFile, JSON.stringify(files, null, 2));
    },

    async getGroups(userId: string): Promise<ReferenceGroup[]> {
        await ensureDataDir();
        const userGroupsFile = path.join(LIBRARY_DIR, `${userId}_groups.json`);
        try {
            const data = await fs.readFile(userGroupsFile, 'utf-8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    },

    async saveGroups(userId: string, groups: ReferenceGroup[]): Promise<void> {
        await ensureDataDir();
        const userGroupsFile = path.join(LIBRARY_DIR, `${userId}_groups.json`);
        await fs.writeFile(userGroupsFile, JSON.stringify(groups, null, 2));
    }
};






