import { User, Project, ReferenceFile, ReferenceGroup, GenerateContentRequest, RefineContentRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// 获取认证token
const getToken = (): string | null => {
    return localStorage.getItem('auth_token');
};

// 设置认证token
export const setAuthToken = (token: string): void => {
    localStorage.setItem('auth_token', token);
};

// 清除认证token
export const clearAuthToken = (): void => {
    localStorage.removeItem('auth_token');
};

// 通用API请求函数
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
    const token = getToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.error || '请求失败' };
        }

        return { success: true, data: data.data || data };
    } catch (error: any) {
        return { success: false, error: error.message || '网络错误' };
    }
}

// 认证API
export const authApi = {
    async register(username: string, password: string, email?: string) {
        const result = await apiRequest<{ user: User; token: string }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, password, email }),
        });
        if (result.success && result.data) {
            setAuthToken(result.data.token);
        }
        return result;
    },

    async login(username: string, password: string) {
        const result = await apiRequest<{ user: User; token: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
        if (result.success && result.data) {
            setAuthToken(result.data.token);
        }
        return result;
    },

    async getCurrentUser() {
        return apiRequest<User>('/auth/me');
    },

    logout() {
        clearAuthToken();
    },
};

// 项目API
export const projectApi = {
    async getAll(): Promise<Project[]> {
        const result = await apiRequest<Project[]>('/projects');
        return result.data || [];
    },

    async getById(id: string): Promise<Project | null> {
        const result = await apiRequest<Project>(`/projects/${id}`);
        return result.data || null;
    },

    async create(project: Partial<Project>): Promise<Project | null> {
        const result = await apiRequest<Project>('/projects', {
            method: 'POST',
            body: JSON.stringify(project),
        });
        return result.data || null;
    },

    async update(id: string, project: Partial<Project>): Promise<Project | null> {
        const result = await apiRequest<Project>(`/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(project),
        });
        return result.data || null;
    },

    async delete(id: string): Promise<boolean> {
        const result = await apiRequest(`/projects/${id}`, {
            method: 'DELETE',
        });
        return result.success;
    },
};

// 资料库API
export const libraryApi = {
    async getFiles(): Promise<ReferenceFile[]> {
        const result = await apiRequest<ReferenceFile[]>('/library/files');
        return result.data || [];
    },

    async saveFiles(files: ReferenceFile[]): Promise<boolean> {
        const result = await apiRequest('/library/files', {
            method: 'POST',
            body: JSON.stringify(files),
        });
        return result.success;
    },

    async getGroups(): Promise<ReferenceGroup[]> {
        const result = await apiRequest<ReferenceGroup[]>('/library/groups');
        return result.data || [];
    },

    async saveGroups(groups: ReferenceGroup[]): Promise<boolean> {
        const result = await apiRequest('/library/groups', {
            method: 'POST',
            body: JSON.stringify(groups),
        });
        return result.success;
    },
};

// 生成API
export const generateApi = {
    async generateSection(request: GenerateContentRequest): Promise<string> {
        const result = await apiRequest<string>('/generate/section', {
            method: 'POST',
            body: JSON.stringify(request),
        });
        return result.data || '';
    },

    async refineSection(request: RefineContentRequest): Promise<string> {
        const result = await apiRequest<string>('/generate/refine', {
            method: 'POST',
            body: JSON.stringify(request),
        });
        return result.data || '';
    },
};






