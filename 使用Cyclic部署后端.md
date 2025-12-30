# 🌐 使用Cyclic.sh部署后端（最简单，无需信用卡）

## ✅ 为什么选择Cyclic？

- ✅ **完全免费**
- ✅ **不需要信用卡**
- ✅ **最简单**（网页操作）
- ✅ **自动部署**

---

## 🚀 步骤1：访问Cyclic

1. 打开浏览器访问：**https://cyclic.sh**
2. 点击 **"Deploy Now"** 或 **"Sign Up"**
3. 选择 **"Continue with GitHub"** 使用GitHub登录

---

## 📦 步骤2：连接GitHub仓库

1. 登录后，Cyclic会自动显示你的GitHub仓库
2. 找到并选择：`a706990060-sys/proreport-genai`
3. 点击 **"Connect"** 或 **"Deploy"**

---

## ⚙️ 步骤3：配置服务

Cyclic会自动检测，但需要手动调整：

### 基本设置

- **App Name**: `proreport-genai-backend`（自动生成或自定义）
- **Root Directory**: `server`
- **Framework**: `Node.js`（自动检测）

### 构建设置

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

---

## 🔐 步骤4：配置环境变量

1. 在项目设置中找到 **"Environment Variables"**
2. 点击 **"Add Variable"**
3. 逐个添加：

```
GEMINI_API_KEY=AIzaSyD7L7GzfFwFu0BVA5N0EEOKCIe20mlAeK8
JWT_SECRET=proreport-secret-key-2024-change-this
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
DATA_PATH=./data
PORT=3001
```

---

## 🚀 步骤5：部署

1. 检查所有配置
2. 点击 **"Deploy"** 或 **"Save & Deploy"**
3. 等待部署完成（约5-10分钟）

---

## ✅ 步骤6：获取URL

部署成功后，Cyclic会显示：

- **App URL**: `https://proreport-genai-backend.cyclic.app`

**重要：复制这个URL！**

---

## 🔗 步骤7：连接前后端

### 在Vercel添加环境变量

1. 回到Vercel项目页面
2. Settings → Environment Variables
3. 添加：
   - **Key**: `VITE_API_URL`
   - **Value**: `https://proreport-genai-backend.cyclic.app/api`
4. 保存

### 重新部署前端

1. Vercel → Deployments
2. 最新部署 → "..." → "Redeploy"

---

## ✅ 完成！

用户访问链接：`https://your-app.vercel.app`

---

## 🆘 遇到问题？

### 部署失败

- 检查Root Directory是否为`server`
- 检查Build Command是否正确
- 查看Cyclic的部署日志

### 服务无法访问

- 检查环境变量配置
- 查看Cyclic的日志

---

## 🎉 完成！

Cyclic是最简单的方案，完全网页操作，不需要命令行！

