import dotenv from 'dotenv';

// 确保.env已加载
dotenv.config();

// 统一的JWT_SECRET配置
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// 启动时验证配置
if (!process.env.JWT_SECRET) {
    console.warn('⚠️  警告: JWT_SECRET未在环境变量中设置，使用默认值。生产环境请务必设置JWT_SECRET！');
}

console.log('🔐 JWT_SECRET配置:', process.env.JWT_SECRET ? `已设置(${process.env.JWT_SECRET.length}字符)` : `使用默认值(${JWT_SECRET.length}字符)`);
console.log('🔐 JWT_SECRET值（前10字符）:', JWT_SECRET.substring(0, 10) + '...');

