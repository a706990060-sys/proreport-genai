// 存储服务选择器 - 根据环境变量选择文件系统或MongoDB
import dotenv from 'dotenv';
import { User, Project, ReferenceFile, ReferenceGroup } from '../types/index.js';

dotenv.config();

const USE_MONGODB = !!process.env.MONGODB_URI;

// 动态导入存储服务
let userStorage: any;
let projectStorage: any;
let libraryStorage: any;

async function initStorage() {
    if (USE_MONGODB) {
        // 使用MongoDB
        const mongoService = await import('./mongodbService.js');
        userStorage = mongoService.userStorage;
        projectStorage = mongoService.projectStorage;
        libraryStorage = mongoService.libraryStorage;
        console.log('📦 使用MongoDB存储');
    } else {
        // 使用文件系统
        const fsService = await import('./fileStorageService.js');
        userStorage = fsService.userStorage;
        projectStorage = fsService.projectStorage;
        libraryStorage = fsService.libraryStorage;
        console.log('📁 使用文件系统存储');
    }
}

// 确保存储已初始化
async function ensureStorage() {
    if (!userStorage) {
        await initStorage();
    }
}

// 导出存储服务（延迟初始化）
export const storage = {
    get userStorage() {
        return {
            async getAll(): Promise<User[]> {
                await ensureStorage();
                return userStorage.getAll();
            },
            async save(users: User[]): Promise<void> {
                await ensureStorage();
                return userStorage.save(users);
            },
            async findById(id: string): Promise<User | null> {
                await ensureStorage();
                return userStorage.findById(id);
            },
            async findByUsername(username: string): Promise<User | null> {
                await ensureStorage();
                return userStorage.findByUsername(username);
            },
            async create(user: User): Promise<void> {
                await ensureStorage();
                if (userStorage.create) {
                    return userStorage.create(user);
                } else {
                    // 文件系统存储的兼容方法
                    const users = await userStorage.getAll();
                    users.push(user);
                    return userStorage.save(users);
                }
            },
            async update(user: User): Promise<void> {
                await ensureStorage();
                if (userStorage.update) {
                    return userStorage.update(user);
                } else {
                    // 文件系统存储的兼容方法
                    const users = await userStorage.getAll();
                    const index = users.findIndex(u => u.id === user.id);
                    if (index !== -1) {
                        users[index] = user;
                        return userStorage.save(users);
                    }
                }
            }
        };
    },
    get projectStorage() {
        return {
            async getAll(userId: string): Promise<Project[]> {
                await ensureStorage();
                return projectStorage.getAll(userId);
            },
            async save(userId: string, projects: Project[]): Promise<void> {
                await ensureStorage();
                return projectStorage.save(userId, projects);
            },
            async findById(userId: string, projectId: string): Promise<Project | null> {
                await ensureStorage();
                return projectStorage.findById(userId, projectId);
            },
            async create(project: Project): Promise<void> {
                await ensureStorage();
                if (projectStorage.create) {
                    return projectStorage.create(project);
                } else {
                    // 文件系统存储的兼容方法
                    const projects = await projectStorage.getAll(project.userId);
                    projects.push(project);
                    return projectStorage.save(project.userId, projects);
                }
            },
            async update(project: Project): Promise<void> {
                await ensureStorage();
                if (projectStorage.update) {
                    return projectStorage.update(project);
                } else {
                    // 文件系统存储的兼容方法
                    const projects = await projectStorage.getAll(project.userId);
                    const index = projects.findIndex(p => p.id === project.id);
                    if (index !== -1) {
                        projects[index] = project;
                        return projectStorage.save(project.userId, projects);
                    }
                }
            },
            async delete(userId: string, projectId: string): Promise<void> {
                await ensureStorage();
                if (projectStorage.delete) {
                    return projectStorage.delete(userId, projectId);
                } else {
                    // 文件系统存储的兼容方法
                    const projects = await projectStorage.getAll(userId);
                    const filtered = projects.filter(p => p.id !== projectId);
                    return projectStorage.save(userId, filtered);
                }
            }
        };
    },
    get libraryStorage() {
        return {
            async getFiles(userId: string): Promise<ReferenceFile[]> {
                await ensureStorage();
                return libraryStorage.getFiles(userId);
            },
            async saveFiles(userId: string, files: ReferenceFile[]): Promise<void> {
                await ensureStorage();
                return libraryStorage.saveFiles(userId, files);
            },
            async getGroups(userId: string): Promise<ReferenceGroup[]> {
                await ensureStorage();
                return libraryStorage.getGroups(userId);
            },
            async saveGroups(userId: string, groups: ReferenceGroup[]): Promise<void> {
                await ensureStorage();
                return libraryStorage.saveGroups(userId, groups);
            }
        };
    }
};

// 为了向后兼容，导出旧的接口
export const userStorage = storage.userStorage;
export const projectStorage = storage.projectStorage;
export const libraryStorage = storage.libraryStorage;
