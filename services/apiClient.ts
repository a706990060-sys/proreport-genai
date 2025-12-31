import { User, Project, ReferenceFile, ReferenceGroup, GenerateContentRequest, RefineContentRequest } from '../types';

// 自动检测API地址
const getApiBaseUrl = (): string => {
    // 检查是否在浏览器环境
    if (typeof window === 'undefined') {
        return '/api';
    }
    
    // 优先使用环境变量（如果配置了）
    const envUrl = (import.meta as any).env?.VITE_API_URL;
    if (envUrl && envUrl !== 'http://localhost:3001/api') {
        console.log('使用环境变量API URL:', envUrl);
        return envUrl;
    }
    
    // 检查hostname，判断是否为本地开发环境
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '';
    
    // 本地开发环境：使用代理（Vite会代理到localhost:3001）
    if (isLocalhost && window.location.port === '3000') {
        console.log('检测到本地开发环境，使用代理: /api');
        return '/api';
    }
    
    // 生产环境（包括Vercel）：始终使用相对路径 /api
    console.log('使用生产环境API路径: /api (hostname:', hostname, ')');
    return '/api';
};

// 在运行时计算API地址（避免构建时内联）
const API_BASE_URL = getApiBaseUrl();

// 调试日志
if (typeof window !== 'undefined') {
    console.log('=== API配置信息 ===');
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('当前hostname:', window.location.hostname);
    console.log('当前URL:', window.location.href);
    console.log('环境变量VITE_API_URL:', (import.meta as any).env?.VITE_API_URL || '未设置');
    console.log('==================');
}

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
        console.log(`API请求 ${endpoint}: token存在，长度=${token.length}`);
    } else {
        console.warn(`API请求 ${endpoint}: token不存在`);
    }

    try {
        // 每次请求时重新计算API地址（确保使用最新值）
        const apiUrl = getApiBaseUrl();
        const fullUrl = `${apiUrl}${endpoint}`;
        
        console.log(`发起API请求: ${fullUrl}`);
        
        const response = await fetch(fullUrl, {
            ...options,
            headers,
        });

        // 检查响应内容类型
        const contentType = response.headers.get('content-type');
        let data: any;
        
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            try {
                data = JSON.parse(text);
            } catch {
                return { 
                    success: false, 
                    error: `服务器错误 (${response.status}): ${text.substring(0, 100)}` 
                };
            }
        }

        if (!response.ok) {
            // 处理认证错误
            if (response.status === 401 || response.status === 403) {
                const errorMsg = data.error || data.message || '登录已过期，请重新登录';
                
                // 检查是否是注册/登录相关的API，如果是，不触发auth-expired事件
                const isAuthEndpoint = endpoint.includes('/auth/register') || endpoint.includes('/auth/login');
                
                if (!isAuthEndpoint) {
                    clearAuthToken();
                    // 触发登录过期事件，让App组件知道需要重新登录
                    if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('auth-expired'));
                    }
                }
                
                return { success: false, error: errorMsg };
            }
            return { 
                success: false, 
                error: data.error || data.message || `请求失败 (${response.status})` 
            };
        }

        return { success: true, data: data.data || data };
    } catch (error: any) {
        console.error('API请求错误:', error);
        // 检查是否是网络错误
        if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
            return { success: false, error: '无法连接到服务器，请检查后端服务是否运行' };
        }
        return { success: false, error: error.message || '网络错误，请稍后重试' };
    }
}

// 认证API
export const authApi = {
    async register(username: string, password: string, email?: string) {
        const result = await apiRequest<{ user: User; token: string }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, password, email }),
        });
        console.log('注册API返回:', result);
        if (result.success && result.data) {
            console.log('保存token:', result.data.token ? `存在(${result.data.token.length}字符)` : '不存在');
            setAuthToken(result.data.token);
            // 验证token是否已保存
            const savedToken = localStorage.getItem('auth_token');
            console.log('验证token已保存:', savedToken ? `成功(${savedToken.length}字符)` : '失败');
        } else {
            console.error('注册失败:', result.error);
        }
        return result;
    },

    async login(username: string, password: string) {
        const result = await apiRequest<{ user: User; token: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
        console.log('登录API返回:', result);
        if (result.success && result.data) {
            console.log('保存token:', result.data.token ? `存在(${result.data.token.length}字符)` : '不存在');
            setAuthToken(result.data.token);
            // 验证token是否已保存
            const savedToken = localStorage.getItem('auth_token');
            console.log('验证token已保存:', savedToken ? `成功(${savedToken.length}字符)` : '失败');
        } else {
            console.error('登录失败:', result.error);
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
        console.log('projectApi.create 调用:', project);
        const result = await apiRequest<Project>('/projects', {
            method: 'POST',
            body: JSON.stringify(project),
        });
        console.log('projectApi.create 结果:', result);
        if (!result.success) {
            console.error('创建项目失败:', result.error);
            throw new Error(result.error || '创建项目失败');
        }
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






