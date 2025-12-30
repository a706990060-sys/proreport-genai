# 🚀 快速部署说明

## 用户使用方式

**通过浏览器访问网址，无需下载安装**

---

## 部署方案

### 推荐：Vercel + Railway（免费）

- **前端：** Vercel（免费CDN，自动HTTPS）
- **后端：** Railway（免费额度充足）
- **时间：** 5分钟完成部署
- **费用：** 完全免费（中小型应用）

---

## 快速部署步骤

### 1. 准备代码

确保代码已提交到GitHub

### 2. 部署前端（Vercel）

访问：https://vercel.com
- 导入GitHub仓库
- 构建命令：`npm run build:client`
- 输出目录：`dist`

### 3. 部署后端（Railway）

访问：https://railway.app
- 导入GitHub仓库
- 根目录：`server`
- 配置环境变量（见下方）

### 4. 连接前后端

在Vercel添加环境变量：
- `VITE_API_URL` = Railway后端URL + `/api`

---

## 环境变量配置

### Railway后端环境变量

```
GEMINI_API_KEY=你的API密钥
JWT_SECRET=随机字符串（建议32字符以上）
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
DATA_PATH=./data
```

### Vercel前端环境变量

```
VITE_API_URL=https://your-railway-url.up.railway.app/api
```

---

## 详细文档

- `快速部署指南.md` - 完整部署步骤
- `部署步骤详解.md` - 图文详细说明
- `DEPLOY_CHECKLIST.md` - 部署检查清单

---

## 部署后

用户只需：
1. 打开浏览器
2. 访问你提供的网址
3. 注册/登录
4. 开始使用

**无需下载、无需安装！**

