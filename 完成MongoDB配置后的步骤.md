# ✅ 完成MongoDB配置后的步骤

## 📋 检查清单

请确认你已经完成：

- [x] 注册MongoDB Atlas账号
- [x] 创建免费集群
- [x] 创建数据库用户（用户名和密码已保存）
- [x] 配置网络访问（或稍后配置）
- [x] 获取连接字符串
- [x] 替换了用户名和密码
- [x] 添加了数据库名称 `/proreport_genai`

---

## ⚙️ 步骤1：在Vercel配置环境变量

### 1.1 访问Vercel项目

1. **访问Vercel控制台**：
   - https://vercel.com/dashboard

2. **选择你的项目**：
   - 找到 `proreport-genai` 项目
   - 点击进入

### 1.2 添加环境变量

1. **进入设置**：
   - 点击 **"Settings"** 标签（顶部导航栏）
   - 点击 **"Environment Variables"**（左侧菜单）

2. **添加MongoDB连接字符串**：
   - 点击 **"Add New"** 按钮
   - **Key**: `MONGODB_URI`
   - **Value**: 粘贴你刚才准备的完整连接字符串
     - 格式：`mongodb+srv://用户名:密码@集群地址.mongodb.net/proreport_genai?retryWrites=true&w=majority`
   - **Environment**: 勾选所有选项
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - 点击 **"Save"**

3. **添加其他环境变量**（如果还没有）：

   **GEMINI_API_KEY**：
   - 点击 **"Add New"**
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `AIzaSyD7L7GzfFwFu0BVA5N0EEOKCIe20mlAeK8`（或你的API密钥）
   - **Environment**: 全选
   - 点击 **"Save"**

   **JWT_SECRET**：
   - 点击 **"Add New"**
   - **Key**: `JWT_SECRET`
   - **Value**: 生成一个随机字符串（至少32字符）
     - 可以使用在线工具：https://www.random.org/strings/
     - 或使用这个示例：`proreport-secret-key-2024-$(date +%s)-random-string`
   - **Environment**: 全选
   - 点击 **"Save"**

   **FRONTEND_URL**（可选）：
   - 点击 **"Add New"**
   - **Key**: `FRONTEND_URL`
   - **Value**: `*`（允许所有来源）
   - **Environment**: 全选
   - 点击 **"Save"**

   **NODE_ENV**（可选）：
   - 点击 **"Add New"**
   - **Key**: `NODE_ENV`
   - **Value**: `production`
   - **Environment**: 全选
   - 点击 **"Save"**

### 1.3 验证环境变量

确认以下环境变量都已添加：

- ✅ `MONGODB_URI`
- ✅ `GEMINI_API_KEY`
- ✅ `JWT_SECRET`
- ✅ `FRONTEND_URL`（可选）
- ✅ `NODE_ENV`（可选）

---

## 📤 步骤2：提交代码到GitHub

### 2.1 安装依赖（如果还没有）

```powershell
cd F:\ProReport-GenAI
npm install
```

### 2.2 提交代码

```powershell
git add .
git commit -m "添加MongoDB支持，配置Vercel Serverless Functions"
git push
```

---

## 🚀 步骤3：等待Vercel自动部署

1. **Vercel会自动检测到代码更新**
2. **开始部署**（约2-5分钟）
3. **查看部署日志**：
   - 在Vercel控制台查看部署状态
   - 点击最新的部署，查看日志
   - 应该看到：`📦 使用MongoDB存储`

---

## ✅ 步骤4：测试部署

### 4.1 访问前端

1. **访问你的Vercel前端URL**：
   - 例如：`https://your-app.vercel.app`
   - 在Vercel控制台的 "Deployments" 标签可以找到URL

### 4.2 测试功能

1. **注册新用户**：
   - 点击 "立即注册"
   - 输入用户名、密码、邮箱
   - 点击 "注册"
   - 应该成功注册

2. **登录**：
   - 使用刚才注册的账号登录
   - 应该成功登录

3. **创建项目**：
   - 点击 "创建新项目"
   - 填写项目信息
   - 应该成功创建

### 4.3 验证MongoDB

1. **访问MongoDB Atlas控制台**：
   - https://cloud.mongodb.com/

2. **查看数据**：
   - 进入 "Database" → "Browse Collections"
   - 应该看到数据库：`proreport_genai`
   - 应该看到集合：
     - `users` - 包含你注册的用户
     - `projects` - 包含你创建的项目

---

## 🆘 如果遇到问题

### 问题1：部署失败

**检查**：
- Vercel部署日志中的错误信息
- 确认环境变量已正确配置
- 确认代码已提交到GitHub

**解决方案**：
- 查看部署日志
- 检查环境变量是否正确
- 重新部署

### 问题2：API调用失败

**检查**：
- 浏览器控制台（F12）的错误信息
- 确认 `MONGODB_URI` 环境变量正确
- 确认网络访问已配置

**解决方案**：
- 检查MongoDB Atlas网络访问配置
- 确认连接字符串格式正确
- 检查Vercel环境变量

### 问题3：数据不保存

**检查**：
- Vercel部署日志
- 确认看到 `📦 使用MongoDB存储`
- 检查MongoDB Atlas是否有数据

**解决方案**：
- 检查MongoDB连接字符串
- 检查环境变量配置
- 查看Vercel函数日志

---

## 🎉 完成！

如果所有步骤都成功，你的后端就已经部署到Vercel并使用MongoDB Atlas存储数据了！

- ✅ 前端部署在Vercel
- ✅ 后端部署在Vercel（Serverless Functions）
- ✅ 数据存储在MongoDB Atlas
- ✅ 完全免费
- ✅ 不需要信用卡

---

## 📚 下一步

1. **测试所有功能**
2. **分享给同事使用**
3. **监控MongoDB使用量**（免费版512MB限制）

---

## 💡 提示

- **保护连接字符串**：不要分享给他人
- **定期备份数据**：MongoDB Atlas会自动备份
- **监控使用量**：免费版有512MB限制
- **网络访问**：如果还没配置，可以在需要时再配置

