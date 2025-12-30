# 🔧 解决Railway"Limited Access"问题

## ❌ 问题分析

Railway显示：
```
Limited Access
Your account is on a limited plan and can only deploy databases.
Upgrade your plan
```

**问题原因**：Railway的免费计划现在有限制，只能部署数据库，不能部署应用服务。

## ✅ 解决方案

### 方案1：使用Render（推荐，免费）

Render提供免费的Node.js应用托管，适合我们的后端。

#### 步骤1：访问Render

1. 访问：https://render.com
2. 用GitHub登录
3. 点击 **"New +"** → **"Web Service"**

#### 步骤2：连接GitHub仓库

1. 选择 **"Connect GitHub"**
2. 授权Render访问GitHub
3. 选择仓库：`a706990060-sys/proreport-genai`

#### 步骤3：配置服务

**基本信息：**
- **Name**: `proreport-genai-backend`
- **Environment**: `Node`
- **Region**: 选择离你最近的区域（如Singapore）

**构建和启动：**
- **Root Directory**: `server`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

**环境变量：**
点击 **"Advanced"** → **"Add Environment Variable"**，添加：

```
GEMINI_API_KEY=AIzaSyD7L7GzfFwFu0BVA5N0EEOKCIe20mlAeK8
JWT_SECRET=proreport-secret-key-2024-change-this
FRONTEND_URL=https://your-app.vercel.app（Vercel前端URL）
NODE_ENV=production
DATA_PATH=./data
PORT=3001
```

#### 步骤4：部署

1. 点击 **"Create Web Service"**
2. 等待部署完成（约5-10分钟）
3. Render会自动生成URL，例如：`https://proreport-genai-backend.onrender.com`

**注意**：Render免费计划在15分钟无活动后会休眠，首次访问需要等待几秒唤醒。

---

### 方案2：使用Fly.io（免费，性能好）

Fly.io也提供免费的Node.js应用托管。

#### 步骤1：安装Fly CLI

```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex
```

#### 步骤2：登录Fly.io

```bash
fly auth login
```

#### 步骤3：初始化Fly应用

```bash
cd F:\ProReport-GenAI\server
fly launch
```

按照提示操作，Fly会自动检测并配置。

#### 步骤4：配置环境变量

```bash
fly secrets set GEMINI_API_KEY=AIzaSyD7L7GzfFwFu0BVA5N0EEOKCIe20mlAeK8
fly secrets set JWT_SECRET=proreport-secret-key-2024-change-this
fly secrets set FRONTEND_URL=https://your-app.vercel.app
fly secrets set NODE_ENV=production
fly secrets set DATA_PATH=./data
```

#### 步骤5：部署

```bash
fly deploy
```

---

### 方案3：升级Railway计划（付费）

如果坚持使用Railway：

1. 点击Railway的 **"Upgrade your plan"**
2. 选择付费计划（Hobby计划约$5/月）
3. 升级后可以部署应用服务

---

### 方案4：使用其他免费服务

- **Render**：免费，但会休眠（推荐）
- **Fly.io**：免费，性能好
- **Heroku**：不再免费，但稳定
- **DigitalOcean App Platform**：有免费额度

---

## 🎯 推荐方案

**最推荐：使用Render**

**优点**：
- ✅ 完全免费
- ✅ 支持Node.js
- ✅ 自动部署
- ✅ 简单易用

**缺点**：
- ⚠️ 免费计划会休眠（15分钟无活动后）
- ⚠️ 首次访问需要等待几秒唤醒

---

## 📝 使用Render的完整步骤

### 1. 访问Render

https://render.com

### 2. 创建Web Service

1. 点击 **"New +"** → **"Web Service"**
2. 连接GitHub仓库
3. 选择 `proreport-genai`

### 3. 配置

- **Name**: `proreport-genai-backend`
- **Root Directory**: `server`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment**: `Node`

### 4. 环境变量

添加所有必需的环境变量

### 5. 部署

点击 **"Create Web Service"**，等待部署完成

### 6. 获取URL

部署完成后，Render会提供URL，例如：
```
https://proreport-genai-backend.onrender.com
```

### 7. 更新Vercel配置

在Vercel添加环境变量：
- `VITE_API_URL` = `https://proreport-genai-backend.onrender.com/api`

---

## ✅ 完成

使用Render部署后端后，整个部署流程就完成了！

用户访问链接：Vercel前端URL

