# 🚀 使用Vercel部署后端（推荐，最简单）

## ✅ 优点
- ✅ **完全免费**（Hobby计划）
- ✅ **不需要信用卡**
- ✅ **与前端同域名**（无需配置CORS）
- ✅ **自动HTTPS**
- ✅ **全球CDN**
- ✅ **自动部署**（GitHub推送自动部署）

## ⚠️ 注意事项
- ⚠️ Serverless Functions是无状态的，不能使用本地文件系统
- ⚠️ 需要使用外部数据库或Vercel KV存储数据
- ⚠️ 免费版有执行时间限制（10秒）

---

## 📥 步骤1：安装Vercel CLI（可选）

如果你想本地测试，可以安装Vercel CLI：

```powershell
npm install -g vercel
```

---

## 🔧 步骤2：配置项目

### 2.1 安装依赖

确保项目根目录的 `package.json` 包含后端依赖：

```powershell
cd F:\ProReport-GenAI
npm install express cors dotenv @google/genai bcryptjs jsonwebtoken
npm install -D @types/express @types/cors @types/bcryptjs @types/jsonwebtoken @vercel/node
```

### 2.2 更新 vercel.json

我已经创建了 `api/index.ts`，现在需要更新 `vercel.json`：

```json
{
  "buildCommand": "npm run build:client",
  "outputDirectory": "dist",
  "devCommand": "npm run dev:client",
  "installCommand": "npm install",
  "framework": "vite",
  "functions": {
    "api/index.ts": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ]
}
```

---

## 💾 步骤3：选择数据存储方案

### 方案A：使用MongoDB Atlas（推荐，免费）

#### 3.1 注册MongoDB Atlas

1. 访问：https://www.mongodb.com/cloud/atlas/register
2. 注册账号（免费）
3. 创建免费集群（M0，512MB免费）

#### 3.2 获取连接字符串

1. 在MongoDB Atlas控制台
2. 点击 "Connect" → "Connect your application"
3. 复制连接字符串（类似：`mongodb+srv://username:password@cluster.mongodb.net/`）

#### 3.3 在Vercel添加环境变量

1. 访问Vercel项目
2. Settings → Environment Variables
3. 添加：
   - `MONGODB_URI`: 你的MongoDB连接字符串
   - `GEMINI_API_KEY`: 你的Gemini API密钥
   - `JWT_SECRET`: 你的JWT密钥（随机字符串）
   - `FRONTEND_URL`: 你的前端URL（或留空使用*）

### 方案B：使用Supabase（推荐，免费）

#### 3.1 注册Supabase

1. 访问：https://supabase.com/
2. 注册账号（免费）
3. 创建新项目

#### 3.2 获取连接信息

1. 在Supabase项目设置
2. 获取数据库URL（PostgreSQL）

#### 3.3 在Vercel添加环境变量

添加 `DATABASE_URL` 和其他环境变量。

### 方案C：使用Vercel KV（需要Pro计划）

Vercel KV是Vercel的Redis服务，但需要Pro计划（$20/月）。

---

## 🚀 步骤4：更新存储服务

由于Vercel Serverless Functions不能使用文件系统，需要修改 `storageService.ts` 使用数据库。

### 4.1 使用MongoDB

需要安装 `mongodb` 包并修改存储服务。

### 4.2 使用内存存储（仅测试）

我已经创建了一个内存存储版本，但数据不会持久化（重启后丢失）。

---

## 📝 步骤5：部署

### 5.1 提交代码到GitHub

```powershell
cd F:\ProReport-GenAI
git add .
git commit -m "添加Vercel Serverless Functions支持"
git push
```

### 5.2 Vercel自动部署

Vercel会自动检测到代码更新并重新部署。

### 5.3 查看部署日志

在Vercel控制台查看部署日志，确认没有错误。

---

## 🔗 步骤6：更新前端API URL

由于后端现在和前端在同一个域名下，需要更新前端配置：

### 6.1 更新 apiClient.ts

```typescript
// 开发环境使用代理，生产环境使用相对路径
const API_BASE_URL = import.meta.env.DEV 
    ? '/api'  // 开发环境使用Vite代理
    : '/api';  // 生产环境使用相对路径（同域名）
```

### 6.2 更新 vite.config.ts

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

## ✅ 完成！

部署完成后：
- 前端URL：`https://your-app.vercel.app`
- 后端API：`https://your-app.vercel.app/api`

无需配置CORS，因为前后端在同一域名下！

---

## 🆘 遇到问题？

### 部署失败

- 检查 `api/index.ts` 是否正确
- 检查环境变量是否配置
- 查看Vercel部署日志

### 数据不持久化

- 使用MongoDB Atlas或Supabase
- 不要使用内存存储（仅测试用）

### API调用失败

- 检查API路径是否正确
- 检查环境变量
- 查看Vercel函数日志

---

## 🎉 总结

使用Vercel部署后端：
- ✅ 最简单（与前端同项目）
- ✅ 完全免费
- ✅ 不需要信用卡
- ✅ 自动部署

只需要：
1. 配置数据存储（MongoDB Atlas或Supabase）
2. 更新存储服务代码
3. 推送到GitHub
4. Vercel自动部署

