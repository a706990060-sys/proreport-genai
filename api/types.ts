// 类型定义 - 从 server/src/types/index.ts 重新导出
export interface User {
    id: string;
    username: string;
    email?: string;
    createdAt: number;
    lastLoginAt: number;
    passwordHash: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    outline: any[];
    reportData: { [key: string]: string };
    referenceData: any;
    isLocked: boolean;
    lastModified: number;
    history: any[];
    userId: string;
}

export interface ReferenceFile {
    id: string;
    name: string;
    data: string;
    mimeType: string;
    groupId: string;
    lastModified: number;
}

export interface ReferenceGroup {
    id: string;
    name: string;
    type: 'builtin' | 'custom';
    parentId?: string;
}

// AuthRequest 类型
import { Request } from 'express';

export interface AuthRequest extends Request {
    userId?: string;
}

// 生成内容请求类型
export interface GenerateContentRequest {
    sectionTitle: string;
    requirement: string;
    userInputs: string;
    contentRefs?: ReferenceFile[];
    formatRefs?: ReferenceFile[];
    specRefs?: ReferenceFile[];
    knowledgeRefs?: ReferenceFile[];
    useSearch?: boolean;
}

// 修改内容请求类型
export interface RefineContentRequest {
    sectionTitle: string;
    selectedText: string;
    fullCurrentHtml: string;
    userInstruction: string;
    contentRefs?: ReferenceFile[];
    formatRefs?: ReferenceFile[];
    specRefs?: ReferenceFile[];
    knowledgeRefs?: ReferenceFile[];
    useSearch?: boolean;
}

