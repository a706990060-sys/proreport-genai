// 更新后的认证服务，使用后端API
import { User } from '../types';
import { authApi, setAuthToken, clearAuthToken } from './apiClient';

export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const result = await authApi.getCurrentUser();
        return result.success && result.data ? result.data : null;
    } catch {
        return null;
    }
};

export const registerUser = async (credentials: { username: string; password: string; email?: string }): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
        const result = await authApi.register(credentials.username, credentials.password, credentials.email);
        if (result.success && result.data) {
            return { success: true, user: result.data.user };
        }
        return { success: false, error: result.error || '注册失败' };
    } catch (error: any) {
        return { success: false, error: error.message || '注册失败' };
    }
};

export const loginUser = async (username: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
        const result = await authApi.login(username, password);
        if (result.success && result.data) {
            return { success: true, user: result.data.user };
        }
        return { success: false, error: result.error || '登录失败' };
    } catch (error: any) {
        return { success: false, error: error.message || '登录失败' };
    }
};

export const logoutUser = (): void => {
    authApi.logout();
};

// 以下函数保留用于向后兼容，但现在数据通过API管理
export const getUserStorageKey = (baseKey: string, userId?: string): string => {
    // 不再需要，数据由后端管理
    return baseKey;
};

export const getUserData = async <T>(baseKey: string, defaultValue: T): Promise<T> => {
    // 数据现在通过API获取
    return defaultValue;
};

export const saveUserData = async <T>(baseKey: string, data: T): Promise<void> => {
    // 数据现在通过API保存
};

export const deleteUserData = (userId: string): void => {
    // 数据现在由后端管理
};
