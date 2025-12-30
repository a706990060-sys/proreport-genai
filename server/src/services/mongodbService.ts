// MongoDB 连接服务
import { MongoClient, Db, Collection } from 'mongodb';
import dotenv from 'dotenv';
import { User, Project, ReferenceFile, ReferenceGroup } from '../types/index.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';
const DB_NAME = 'proreport_genai';

let client: MongoClient | null = null;
let db: Db | null = null;

// 获取数据库连接
async function getDb(): Promise<Db> {
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not set');
    }

    if (db) {
        return db;
    }

    if (!client) {
        client = new MongoClient(MONGODB_URI);
        await client.connect();
    }

    db = client.db(DB_NAME);
    return db;
}

// 获取集合
async function getCollection<T>(name: string): Promise<Collection<T>> {
    const database = await getDb();
    return database.collection<T>(name);
}

// 用户存储
export const userStorage = {
    async getAll(): Promise<User[]> {
        const collection = await getCollection<User>('users');
        return await collection.find({}).toArray();
    },

    async save(users: User[]): Promise<void> {
        const collection = await getCollection<User>('users');
        // 清空现有数据并插入新数据
        await collection.deleteMany({});
        if (users.length > 0) {
            await collection.insertMany(users);
        }
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

// 项目存储
export const projectStorage = {
    async getAll(userId: string): Promise<Project[]> {
        const collection = await getCollection<Project>('projects');
        return await collection.find({ userId }).toArray();
    },

    async save(userId: string, projects: Project[]): Promise<void> {
        const collection = await getCollection<Project>('projects');
        // 删除该用户的所有项目
        await collection.deleteMany({ userId });
        // 插入新项目
        if (projects.length > 0) {
            await collection.insertMany(projects);
        }
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

// 资料库存储
export const libraryStorage = {
    async getFiles(userId: string): Promise<ReferenceFile[]> {
        const collection = await getCollection<ReferenceFile>('library_files');
        return await collection.find({ userId }).toArray();
    },

    async saveFiles(userId: string, files: ReferenceFile[]): Promise<void> {
        const collection = await getCollection<ReferenceFile>('library_files');
        // 删除该用户的所有文件
        await collection.deleteMany({ userId });
        // 插入新文件
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
        // 删除该用户的所有分组
        await collection.deleteMany({ userId });
        // 插入新分组
        if (groups.length > 0) {
            const groupsWithUserId = groups.map(group => ({ ...group, userId }));
            await collection.insertMany(groupsWithUserId);
        }
    }
};

// 关闭连接（可选，Vercel Serverless Functions会自动管理连接）
export async function closeConnection(): Promise<void> {
    if (client) {
        await client.close();
        client = null;
        db = null;
    }
}

