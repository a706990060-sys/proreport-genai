# 🚀 使用Render部署后端（替代Railway）

## 📋 为什么使用Render？

Railway免费计划现在只能部署数据库，不能部署应用。Render提供免费的Node.js应用托管，完全适合我们的需求。

---

## 🌐 步骤1：访问Render

1. 打开浏览器访问：**https://render.com**
2. 点击右上角 **"Get Started for Free"** 或 **"Sign Up"**
3. 选择 **"Continue with GitHub"** 使用GitHub账号登录

---

## 📦 步骤2：创建Web Service

1. 登录后，点击 **"New +"** 按钮（右上角）
2. 选择 **"Web Service"**

---

## 🔗 步骤3：连接GitHub仓库

1. 在 **"Connect a repository"** 部分
2. 如果首次使用，点击 **"Connect GitHub"** 授权
3. 授权后，搜索并选择仓库：`a706990060-sys/proreport-genai`
4. 点击 **"Connect"**

---

## ⚙️ 步骤4：配置服务

### 基本信息

- **Name**: `proreport-genai-backend`
- **Environment**: 选择 `Node`
- **Region**: 选择离你最近的区域（建议选择 `Singapore` 或 `Oregon`）

### 构建和启动设置

- **Root Directory**: `server`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 计划选择

- 选择 **"Free"** 计划（免费）

---

## 🔐 步骤5：配置环境变量

1. 在配置页面，找到 **"Environment Variables"** 部分
2. 点击 **"Add Environment Variable"**
3. 逐个添加以下变量：

| Key | Value |
|-----|-------|
| `GEMINI_API_KEY` | `AIzaSyD7L7GzfFwFu0BVA5N0EEOKCIe20mlAeK8` |
| `JWT_SECRET` | `proreport-secret-key-2024-change-this` |
| `FRONTEND_URL` | `https://your-app.vercel.app`（填写你的Vercel URL） |
| `NODE_ENV` | `production` |
| `DATA_PATH` | `./data` |
| `PORT` | `3001` |

**注意**：
- `FRONTEND_URL` 需要填写步骤1（Vercel部署）获取的前端URL
- `JWT_SECRET` 建议改为更复杂的随机字符串

---

## 🚀 步骤6：部署

1. 检查所有配置是否正确
2. 点击页面底部的 **"Create Web Service"** 按钮
3. 等待部署完成（约5-10分钟）

部署过程中可以看到：
- 构建日志
- 部署进度
- 任何错误信息

---

## ✅ 步骤7：获取后端URL

部署成功后，Render会显示：

- **Service URL**: `https://proreport-genai-backend.onrender.com`

**重要：复制这个URL，稍后需要用到！**

---

## 🔗 步骤8：连接前后端

### 在Vercel添加环境变量

1. 回到Vercel项目页面
2. 点击 **"Settings"** → **"Environment Variables"**
3. 点击 **"Add New"**
4. 添加：
   - **Key**: `VITE_API_URL`
   - **Value**: `https://proreport-genai-backend.onrender.com/api`
     （Render URL + `/api`）
5. 点击 **"Save"**

### 重新部署前端

1. 在Vercel项目页面
2. 点击 **"Deployments"** 标签
3. 找到最新的部署
4. 点击右侧的 **"..."** → **"Redeploy"**
5. 等待重新部署完成

---

## ✅ 部署完成！

### 访问链接

用户访问的链接是：
```
https://your-app.vercel.app
```

### 验证部署

1. 访问前端URL
2. 应该能看到登录界面
3. 尝试注册账号
4. 尝试创建项目

如果一切正常，说明部署成功！

---

## ⚠️ Render免费计划说明

### 休眠机制

Render免费计划在**15分钟无活动后会自动休眠**。

**影响**：
- 首次访问需要等待几秒唤醒服务
- 之后访问速度正常

**解决方法**：
- 使用免费的外部监控服务定期访问（如UptimeRobot）
- 或升级到付费计划（$7/月起）

### 性能

- 免费计划有资源限制，但对于中小型应用足够使用
- 如果用户量大，建议升级到付费计划

---

## 🆘 遇到问题？

### 部署失败

- 检查Root Directory是否为`server`
- 检查Build Command是否正确
- 查看Render的构建日志

### 服务无法访问

- 检查环境变量是否配置正确
- 检查服务是否已部署成功
- 查看Render的日志

### 前后端无法连接

- 检查Vercel的`VITE_API_URL`是否正确
- 检查Render的`FRONTEND_URL`是否匹配前端URL
- 检查CORS配置

---

## 🎉 完成！

部署完成后，把前端URL分享给其他用户即可！

**用户只需：**
1. 打开浏览器
2. 访问你提供的URL
3. 注册/登录
4. 开始使用

**无需下载、无需安装！**

