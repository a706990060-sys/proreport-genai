# 🗄️ MongoDB Atlas 配置指南

## ✅ 为什么选择MongoDB Atlas？

- ✅ **完全免费**（M0集群，512MB存储）
- ✅ **不需要信用卡**
- ✅ **全球可用**
- ✅ **自动备份**
- ✅ **简单易用**

---

## 📝 步骤1：注册MongoDB Atlas

1. **访问注册页面**：
   - https://www.mongodb.com/cloud/atlas/register

2. **注册账号**：
   - 可以使用Google账号快速注册
   - 或使用邮箱注册

3. **验证邮箱**（如果需要）

---

## 🚀 步骤2：创建免费集群

1. **登录MongoDB Atlas控制台**：
   - https://cloud.mongodb.com/

2. **创建新项目**（如果还没有）：
   - 点击 "New Project"
   - 输入项目名称：`ProReport GenAI`
   - 点击 "Create Project"

3. **创建免费集群**：
   - 点击 "Build a Database"
   - 选择 **"M0 FREE"** 集群（免费）
   - 选择云服务商和地区：
     - 推荐：**AWS** 或 **Google Cloud**
     - 地区：选择离你最近的（如 `ap-southeast-1` 新加坡）
   - 集群名称：保持默认或自定义
   - 点击 **"Create"**

4. **等待集群创建**（约3-5分钟）

---

## 🔐 步骤3：创建数据库用户

1. **在集群创建完成后**，会提示创建数据库用户

2. **设置用户名和密码**：
   - 用户名：例如 `proreport_user`
   - 密码：**生成一个强密码**（点击 "Autogenerate Secure Password"）
   - **重要：保存这个密码！**（复制到安全的地方）

3. **选择权限**：
   - 选择 **"Atlas Admin"**（完全权限）

4. **点击 "Create Database User"**

---

## 🌐 步骤4：配置网络访问

1. **在 "Network Access" 页面**：
   - 点击 "Add IP Address"

2. **允许访问**：
   - 选择 **"Allow Access from Anywhere"**（`0.0.0.0/0`）
   - 或添加特定IP地址（更安全）

3. **点击 "Confirm"**

---

## 🔗 步骤5：获取连接字符串

1. **在 "Database" 页面**，点击 **"Connect"**

2. **选择连接方式**：
   - 选择 **"Connect your application"**

3. **复制连接字符串**：
   - 你会看到类似这样的字符串：
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

4. **替换用户名和密码**：
   - 将 `<username>` 替换为你的数据库用户名
   - 将 `<password>` 替换为你的数据库密码
   - 例如：
   ```
   mongodb+srv://proreport_user:your_password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

5. **复制完整的连接字符串**（保存好，下一步要用）

---

## ⚙️ 步骤6：在Vercel配置环境变量

1. **访问Vercel项目**：
   - https://vercel.com/dashboard
   - 选择你的项目

2. **进入环境变量设置**：
   - Settings → **Environment Variables**

3. **添加MongoDB连接字符串**：
   - **Key**: `MONGODB_URI`
   - **Value**: 粘贴你刚才复制的连接字符串
   - **Environment**: 选择 `Production`, `Preview`, `Development`（全选）

4. **添加其他环境变量**（如果还没有）：
   - `GEMINI_API_KEY`: 你的Gemini API密钥
   - `JWT_SECRET`: 随机字符串（至少32字符）
   - `FRONTEND_URL`: `*` 或你的前端URL
   - `NODE_ENV`: `production`

5. **点击 "Save"**

---

## 📤 步骤7：重新部署

1. **提交代码到GitHub**：
   ```powershell
   cd F:\ProReport-GenAI
   git add .
   git commit -m "添加MongoDB支持"
   git push
   ```

2. **Vercel自动部署**：
   - Vercel会自动检测到代码更新
   - 开始重新部署
   - 等待部署完成（约2-5分钟）

3. **查看部署日志**：
   - 在Vercel控制台查看部署日志
   - 确认没有错误
   - 应该看到：`📦 使用MongoDB存储`

---

## ✅ 步骤8：测试

1. **访问前端URL**

2. **尝试注册新用户**：
   - 应该能成功注册
   - 数据会保存到MongoDB

3. **尝试登录**：
   - 使用刚才注册的账号登录
   - 应该能成功登录

4. **创建项目**：
   - 创建新项目
   - 数据应该保存到MongoDB

---

## 🔍 验证MongoDB连接

### 在MongoDB Atlas查看数据

1. **访问MongoDB Atlas控制台**

2. **进入 "Database" 页面**

3. **点击 "Browse Collections"**

4. **查看数据库**：
   - 数据库名称：`proreport_genai`
   - 应该看到以下集合：
     - `users` - 用户数据
     - `projects` - 项目数据
     - `library_files` - 资料库文件
     - `library_groups` - 资料库分组

5. **查看数据**：
   - 点击集合名称
   - 应该能看到你创建的用户和项目数据

---

## 🆘 遇到问题？

### 连接失败

- 检查 `MONGODB_URI` 环境变量是否正确
- 检查用户名和密码是否正确
- 检查网络访问是否配置（允许 `0.0.0.0/0`）

### 数据不保存

- 检查Vercel部署日志
- 确认看到 `📦 使用MongoDB存储`
- 检查MongoDB Atlas是否有数据

### 部署失败

- 检查 `package.json` 是否包含 `mongodb` 依赖
- 检查代码是否有语法错误
- 查看Vercel部署日志

---

## 🎉 完成！

现在你的后端已经配置好MongoDB Atlas了！

- ✅ 数据会持久化保存
- ✅ 可以在MongoDB Atlas查看数据
- ✅ 支持多用户使用
- ✅ 完全免费

---

## 📚 下一步

1. **测试所有功能**（注册、登录、创建项目）
2. **分享给同事使用**
3. **监控MongoDB使用量**（免费版有512MB限制）

---

## 💡 提示

- MongoDB Atlas免费版有512MB存储限制
- 如果数据量大，可以考虑升级到付费版
- 定期备份数据（MongoDB Atlas会自动备份）

