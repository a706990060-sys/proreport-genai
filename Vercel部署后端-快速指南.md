# 🚀 Vercel部署后端 - 快速指南

## ✅ 为什么选择Vercel？

- ✅ **完全免费**（Hobby计划）
- ✅ **不需要信用卡**
- ✅ **与前端同域名**（无需配置CORS）
- ✅ **自动HTTPS**
- ✅ **自动部署**（GitHub推送自动部署）

---

## 📝 步骤1：安装依赖

在项目根目录运行：

```powershell
cd F:\ProReport-GenAI
npm install
```

这会安装所有依赖，包括后端依赖和 `@vercel/node`。

---

## 🔧 步骤2：配置环境变量

在Vercel控制台添加环境变量：

1. 访问你的Vercel项目：https://vercel.com/dashboard
2. 进入 **Settings** → **Environment Variables**
3. 添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `GEMINI_API_KEY` | `你的Gemini API密钥` | 必需 |
| `JWT_SECRET` | `随机字符串（至少32字符）` | 必需 |
| `FRONTEND_URL` | `*` 或你的前端URL | 可选（*表示允许所有来源）|
| `NODE_ENV` | `production` | 可选 |

**重要**：`JWT_SECRET` 建议使用随机字符串生成器生成，至少32个字符。

---

## 📤 步骤3：提交代码到GitHub

```powershell
cd F:\ProReport-GenAI
git add .
git commit -m "添加Vercel Serverless Functions支持"
git push
```

---

## 🚀 步骤4：Vercel自动部署

Vercel会自动检测到代码更新并开始部署：

1. 在Vercel控制台查看部署状态
2. 等待部署完成（约2-5分钟）
3. 查看部署日志，确认没有错误

---

## 🔗 步骤5：更新前端API配置

由于后端现在和前端在同一个域名下，需要更新前端配置：

### 5.1 更新 `services/apiClient.ts`

确保 `API_BASE_URL` 使用相对路径：

```typescript
const API_BASE_URL = '/api';  // 使用相对路径
```

### 5.2 更新 `vite.config.ts`（开发环境）

确保开发环境使用代理：

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
});
```

---

## ⚠️ 重要：数据存储问题

**Vercel Serverless Functions是无状态的，不能使用本地文件系统！**

当前代码使用文件系统存储数据，在Vercel上**不会工作**。

### 解决方案A：使用MongoDB Atlas（推荐）

1. **注册MongoDB Atlas**（免费）：
   - 访问：https://www.mongodb.com/cloud/atlas/register
   - 创建免费集群（M0，512MB）

2. **获取连接字符串**：
   - 在MongoDB Atlas控制台
   - Connect → Connect your application
   - 复制连接字符串

3. **在Vercel添加环境变量**：
   - `MONGODB_URI`: 你的MongoDB连接字符串

4. **修改存储服务**：
   - 需要将 `server/src/services/storageService.ts` 改为使用MongoDB
   - 安装 `mongodb` 包：`npm install mongodb`

### 解决方案B：使用Supabase（推荐）

1. **注册Supabase**（免费）：
   - 访问：https://supabase.com/
   - 创建新项目

2. **获取数据库URL**：
   - 在Supabase项目设置中获取PostgreSQL连接字符串

3. **在Vercel添加环境变量**：
   - `DATABASE_URL`: 你的Supabase数据库URL

4. **修改存储服务**：
   - 需要将存储服务改为使用PostgreSQL

### 解决方案C：临时使用内存存储（仅测试）

我已经创建了内存存储版本，但**数据不会持久化**（重启后丢失）。

**仅用于测试，不适合生产环境！**

---

## ✅ 完成！

部署完成后：
- 前端URL：`https://your-app.vercel.app`
- 后端API：`https://your-app.vercel.app/api`

### 测试

1. 访问前端URL
2. 尝试注册/登录
3. 创建项目
4. 检查浏览器控制台（F12）确认API调用成功

---

## 🆘 遇到问题？

### 部署失败

- 检查 `api/index.ts` 是否正确
- 检查环境变量是否配置
- 查看Vercel部署日志

### API调用失败

- 检查API路径是否正确（应该是 `/api/xxx`）
- 检查环境变量
- 查看Vercel函数日志

### 数据不持久化

- **必须使用数据库**（MongoDB Atlas或Supabase）
- 不要使用文件系统存储
- 修改 `storageService.ts` 使用数据库

---

## 📚 下一步

1. **配置数据库**（MongoDB Atlas或Supabase）
2. **修改存储服务**使用数据库
3. **测试部署**
4. **分享给同事**

---

## 🎉 总结

使用Vercel部署后端：
- ✅ 最简单（与前端同项目）
- ✅ 完全免费
- ✅ 不需要信用卡
- ✅ 自动部署

**只需要配置数据库即可！**

