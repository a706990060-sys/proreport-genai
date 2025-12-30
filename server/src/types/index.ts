// 共享类型定义（从前端复制）
export interface SubSection {
    id: string;
    title: string;
    req: string;
    children?: SubSection[];
}

export interface Chapter {
    title: string;
    subsections: SubSection[];
}

export interface ReportData {
    [key: string]: string;
}

export interface ReferenceGroup {
    id: string;
    name: string;
    type: 'builtin' | 'custom';
    parentId?: string;
}

export interface ReferenceFile {
    id: string;
    name: string;
    data: string; // Base64 encoded
    mimeType: string;
    groupId: string;
    lastModified: number;
}

export interface SectionRefs {
    content?: ReferenceFile[];
    format?: ReferenceFile[];
    specification?: ReferenceFile[];
    knowledge?: ReferenceFile[];
}

export interface ReferenceData {
    [key: string]: SectionRefs;
}

export interface ProjectVersion {
    id: string;
    timestamp: number;
    reason: string;
    reportData: ReportData;
    description: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    outline: Chapter[];
    reportData: ReportData;
    referenceData: ReferenceData;
    isLocked: boolean;
    lastModified: number;
    history: ProjectVersion[];
    userId: string; // 添加用户ID
}

export interface User {
    id: string;
    username: string;
    email?: string;
    createdAt: number;
    lastLoginAt: number;
    passwordHash: string; // 后端存储密码哈希
}

export interface UserCredentials {
    username: string;
    password: string;
    email?: string;
}

// API 请求/响应类型
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

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






