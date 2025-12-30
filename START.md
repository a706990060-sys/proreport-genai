# 🚀 启动指南

## 快速启动（推荐）

在项目根目录运行：

```bash
npm run dev
```

这会同时启动前端（3000端口）和后端（3001端口）。

## 分步启动

### 1. 启动后端服务器

```bash
cd server
npm run dev
```

后端将在 http://localhost:3001 启动

### 2. 启动前端开发服务器

打开新的终端：

```bash
npm run dev:client
```

前端将在 http://localhost:3000 启动

## 配置检查

### 后端配置

确保 `server/.env` 文件存在并包含：

```env
PORT=3001
GEMINI_API_KEY=你的API密钥
JWT_SECRET=随机字符串
```

### 前端配置

前端会自动通过代理连接到后端，无需额外配置。

## 访问应用

打开浏览器访问：http://localhost:3000

## 验证后端运行

访问：http://localhost:3001/api/health

应该看到：`{"success":true,"message":"Server is running"}`

## 故障排除

1. **端口被占用**：修改 `server/.env` 中的 PORT
2. **API连接失败**：确保后端已启动
3. **认证失败**：检查JWT_SECRET配置






