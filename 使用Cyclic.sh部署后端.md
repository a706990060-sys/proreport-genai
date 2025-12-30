# 🚀 使用Cyclic.sh部署后端（最简单，无需信用卡）

## ✅ 为什么选择Cyclic.sh？

- ✅ **完全免费**（不需要信用卡）
- ✅ **最简单**（连接GitHub自动部署）
- ✅ **自动HTTPS**
- ✅ **全球CDN**
- ✅ **不会休眠**

---

## 📥 步骤1：准备GitHub仓库

### 1.1 确保代码已推送到GitHub

如果还没有推送，运行：

```powershell
cd F:\ProReport-GenAI
git add .
git commit -m "准备部署到Cyclic.sh"
git push
```

### 1.2 确认GitHub仓库URL

你的仓库应该是：
```
https://github.com/a706990060-sys/proreport-genai
```

---

## 🔗 步骤2：连接Cyclic.sh

### 2.1 访问Cyclic.sh

1. 打开浏览器，访问：**https://app.cyclic.sh/**
2. 点击 **"Sign up"** 或 **"Login"**
3. 选择 **"Sign in with GitHub"**（使用GitHub账号登录）

### 2.2 授权GitHub

1. 授权Cyclic.sh访问你的GitHub仓库
2. 选择你的账号：`a706990060-sys`

---

## 🚀 步骤3：创建新应用

### 3.1 点击 "New App"

在Cyclic.sh控制台，点击 **"New App"** 或 **"Create App"**

### 3.2 选择仓库

1. 选择你的GitHub账号
2. 选择仓库：`proreport-genai`
3. 选择分支：`main` 或 `master`

### 3.3 配置应用

**重要配置：**

1. **Root Directory**: 输入 `server`
   - 因为后端代码在 `server` 目录下

2. **Build Command**: 留空（Cyclic会自动检测）

3. **Start Command**: 留空（Cyclic会自动检测）

4. 点击 **"Connect"** 或 **"Deploy"**

---

## 🔐 步骤4：配置环境变量

部署开始后，在Cyclic.sh控制台：

### 4.1 进入环境变量设置

1. 点击你的应用
2. 进入 **"Environment"** 或 **"Env Vars"** 标签
3. 添加以下环境变量：

### 4.2 添加环境变量

点击 **"Add Variable"**，逐个添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `GEMINI_API_KEY` | `AIzaSyD7L7GzfFwFu0BVA5N0EEOKCIe20mlAeK8` | Gemini API密钥 |
| `JWT_SECRET` | `proreport-secret-key-2024-change-this` | JWT密钥（建议改为更复杂的随机字符串） |
| `FRONTEND_URL` | `https://your-app.vercel.app` | 前端URL（替换为你的Vercel URL） |
| `NODE_ENV` | `production` | 生产环境 |
| `PORT` | `3001` | 端口（可选，默认3001） |

**注意**：
- `FRONTEND_URL` 需要填写你的Vercel前端URL
- `JWT_SECRET` 建议改为更复杂的随机字符串

---

## ⏳ 步骤5：等待部署

1. Cyclic.sh会自动：
   - 检测到 `server/package.json`
   - 运行 `npm install`
   - 运行 `npm run build`（如果有）
   - 运行 `npm start`

2. 部署过程约 **3-5分钟**

3. 查看部署日志：
   - 在Cyclic.sh控制台查看 **"Logs"** 标签
   - 确认没有错误

---

## ✅ 步骤6：获取后端URL

部署成功后，Cyclic.sh会显示：

```
Your app is live at: https://your-app-name.cyclic.app
```

**重要：复制这个URL！**

格式通常是：
```
https://proreport-genai-backend.cyclic.app
```

---

## 🔗 步骤7：连接前后端

### 7.1 在Vercel添加环境变量

1. 访问Vercel项目：https://vercel.com/dashboard
2. 选择你的前端项目
3. 进入 **Settings** → **Environment Variables**
4. 添加：
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-app-name.cyclic.app/api`
   - **Environment**: 选择 `Production`, `Preview`, `Development`（全选）

5. 点击 **"Save"**

### 7.2 重新部署前端

1. 在Vercel控制台
2. 进入 **Deployments** 标签
3. 找到最新的部署
4. 点击 **"..."** → **"Redeploy"**
5. 等待重新部署完成

---

## ✅ 完成！

### 访问链接

用户访问的链接：
```
https://your-app.vercel.app
```

### 验证

1. 访问前端URL
2. 应该能看到登录界面
3. 尝试注册和创建项目
4. 检查浏览器控制台（F12），确认API调用成功

---

## 🛠️ 常用Cyclic.sh操作

### 查看日志

在Cyclic.sh控制台：
- 点击 **"Logs"** 标签
- 实时查看应用日志

### 更新环境变量

1. 进入 **"Environment"** 标签
2. 编辑或添加变量
3. 保存后自动重新部署

### 重新部署

1. 在GitHub推送新代码
2. Cyclic.sh会自动检测并重新部署

或手动触发：
- 在Cyclic.sh控制台点击 **"Redeploy"**

---

## 🆘 遇到问题？

### 部署失败

1. 检查 **"Logs"** 标签查看错误
2. 确认 `server/package.json` 存在
3. 确认 `server/src/index.ts` 存在
4. 检查环境变量是否正确

### 服务无法访问

1. 检查环境变量配置
2. 查看日志：`fly logs`（如果使用Fly.io）
3. 确认 `FRONTEND_URL` 正确

### API调用失败

1. 检查浏览器控制台（F12）
2. 确认 `VITE_API_URL` 在Vercel中正确配置
3. 确认后端URL可访问（在浏览器中打开）

---

## 🎉 完成！

部署完成后，把前端URL分享给其他用户即可！

**优势**：
- ✅ 完全免费
- ✅ 不需要信用卡
- ✅ 自动部署
- ✅ 非常简单

