# 完整部署指南

## 🎯 推荐方案：Web应用部署

**用户使用方式：通过浏览器访问网址，无需下载安装**

---

## 📋 部署前准备

### 1. 构建生产版本

```bash
cd F:\ProReport-GenAI

# 构建前端（生成 dist 目录）
npm run build:client

# 构建后端（生成 server/dist 目录）
npm run build:server
```

### 2. 检查构建结果

```bash
# 检查前端构建
Test-Path "dist\index.html"

# 检查后端构建
Test-Path "server\dist\index.js"
```

---

## 🌐 方案A：部署到云服务器（生产环境）

### 服务器要求
- 操作系统：Linux (Ubuntu 20.04+) 或 Windows Server
- Node.js：18+ 版本
- 内存：至少 2GB
- 存储：至少 10GB

### 部署步骤

#### 1. 上传文件到服务器

**方式1：使用FTP/SFTP**
- 上传 `dist/` 到服务器Web目录
- 上传 `server/` 到服务器应用目录

**方式2：使用Git**
```bash
# 在服务器上
git clone your-repo
cd ProReport-GenAI
npm run build
```

#### 2. 配置后端

```bash
cd server
npm install --production
cp .env.example .env
# 编辑 .env 文件配置API Key等
```

#### 3. 启动后端服务

**使用PM2（推荐）：**
```bash
npm install -g pm2
pm2 start dist/index.js --name proreport-api
pm2 save
pm2 startup
```

**或使用systemd（Linux）：**
创建服务文件 `/etc/systemd/system/proreport.service`

#### 4. 配置Nginx（前端）

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # 前端静态文件
    root /var/www/proreport-genai/dist;
    index index.html;
    
    # SPA路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API代理到后端
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 5. 配置SSL（HTTPS）

使用Let's Encrypt免费证书：
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🚀 方案B：使用PaaS平台（最简单）

### Vercel + Railway（免费方案）

#### 前端部署（Vercel）

1. **准备前端代码**
   - 修改 `vite.config.ts` 设置生产环境API地址
   - 构建：`npm run build:client`

2. **部署到Vercel**
   - 访问 https://vercel.com
   - 导入GitHub仓库
   - 设置构建命令：`npm run build:client`
   - 设置输出目录：`dist`
   - 部署

#### 后端部署（Railway）

1. **准备后端代码**
   - 确保 `server/` 目录有 `package.json`

2. **部署到Railway**
   - 访问 https://railway.app
   - 创建新项目
   - 连接GitHub仓库
   - 设置根目录：`server`
   - 配置环境变量：
     - `GEMINI_API_KEY`
     - `JWT_SECRET`
     - `PORT` (Railway自动分配)
     - `FRONTEND_URL` (Vercel部署的URL)
   - 部署

3. **获取后端URL**
   - Railway会提供类似：`https://your-app.up.railway.app`
   - 更新前端API配置指向这个URL

---

## 📦 方案C：Docker容器化部署

### 创建Docker配置

#### 1. 前端Dockerfile

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:client

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. 后端Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install --production
COPY server/dist ./dist
COPY server/.env ./.env
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

#### 3. Docker Compose

```yaml
version: '3.8'
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend
  
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "3001:3001"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - ./data:/app/data
```

#### 4. 部署

```bash
docker-compose up -d
```

---

## 💻 方案D：桌面应用打包（Electron）

### 安装依赖

```bash
npm install electron electron-builder --save-dev
```

### 创建Electron主进程

创建 `electron/main.js` 和配置打包脚本

### 打包

```bash
npm run build:electron
```

会生成Windows/Mac/Linux安装包

---

## 🎯 推荐流程

### 最简单的方式（适合快速部署）

1. **使用Vercel部署前端**
   - 免费、自动HTTPS、CDN加速
   - 5分钟完成部署

2. **使用Railway部署后端**
   - 免费额度充足
   - 自动配置环境

3. **用户访问**
   - 只需提供Vercel的网址
   - 用户打开浏览器即可使用

### 最稳定的方式（适合生产环境）

1. **购买云服务器**
   - 阿里云/腾讯云/AWS

2. **使用Docker部署**
   - 一键部署、易于维护

3. **配置域名和SSL**
   - 专业、安全

---

## 📝 用户使用说明

### Web应用部署后

**给用户的说明：**

```
欢迎使用 ProReport GenAI！

访问地址：https://your-domain.com

使用步骤：
1. 打开浏览器（Chrome/Edge/Firefox）
2. 访问上述网址
3. 注册账号
4. 开始使用

无需下载、无需安装，随时随地访问！
```

### 桌面应用打包后

**给用户的说明：**

```
欢迎使用 ProReport GenAI！

安装步骤：
1. 下载安装包
2. 运行安装程序
3. 按照提示完成安装
4. 启动应用

支持 Windows/Mac/Linux 系统
```

---

## 🔧 需要我帮你做什么？

告诉我你的需求，我可以：

1. ✅ **创建Docker配置文件** - 一键部署
2. ✅ **创建Electron打包配置** - 桌面应用
3. ✅ **创建部署脚本** - 自动化部署
4. ✅ **配置CI/CD** - GitHub Actions自动部署
5. ✅ **创建用户使用手册** - 给最终用户的说明

**你希望选择哪种方案？**






