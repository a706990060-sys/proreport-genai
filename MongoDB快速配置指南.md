# 🚀 MongoDB Atlas 快速配置指南（图文版）

## 📝 步骤1：注册MongoDB Atlas账号

### 1.1 访问注册页面

**直接访问**：https://www.mongodb.com/cloud/atlas/register

或者：
1. 访问：https://www.mongodb.com/
2. 点击右上角 "Try Free"
3. 选择 "Atlas"

### 1.2 选择注册方式

- **方式1**：使用Google账号（推荐，最快）
  - 点击 "Sign in with Google"
  - 选择你的Google账号
  - 授权访问

- **方式2**：使用邮箱注册
  - 输入邮箱地址
  - 输入密码
  - 点击 "Sign Up"
  - 验证邮箱

---

## 🎯 步骤2：创建免费集群

### 2.1 创建项目

注册成功后，会提示创建项目：

1. **项目名称**：输入 `ProReport GenAI`
2. **组织**：选择默认组织或创建新组织
3. 点击 **"Next"** → **"Create Project"**

### 2.2 创建数据库集群

1. **选择集群类型**：
   - 选择 **"M0 FREE"**（免费，512MB）
   - 不要选择付费版本！

2. **选择云服务商和地区**：
   - **云服务商**：选择 `AWS` 或 `Google Cloud`
   - **地区**：选择离你最近的
     - 中国用户推荐：`ap-southeast-1`（新加坡）
     - 或 `ap-northeast-1`（东京）

3. **集群名称**：
   - 保持默认：`Cluster0`
   - 或自定义：`proreport-cluster`

4. **点击 "Create"**

5. **等待创建**（约3-5分钟）
   - 页面会显示 "Creating your cluster..."
   - 完成后会显示 "Your cluster is ready!"

---

## 👤 步骤3：创建数据库用户

### 3.1 设置用户名和密码

在 "Create Database User" 页面：

1. **认证方式**：选择 "Password"

2. **用户名**：
   - 输入：`proreport_user`
   - 或自定义用户名

3. **密码**：
   - **推荐**：点击 "Autogenerate Secure Password"
   - **重要**：立即复制密码并保存到安全的地方！
   - 或手动输入强密码（至少8个字符，包含大小写字母和数字）

4. **权限**：
   - 选择 **"Atlas Admin"**（完全权限）

5. **点击 "Create Database User"**

### 3.2 保存凭据

**重要**：保存以下信息到安全的地方：
- 用户名：`proreport_user`（或你设置的）
- 密码：`你生成的密码`（复制保存）

---

## 🌐 步骤4：配置网络访问

### 4.1 允许IP访问

在 "Network Access" 页面：

1. **点击 "Add IP Address"**

2. **选择访问方式**：
   - **选项1（推荐用于测试）**：点击 "Allow Access from Anywhere"
     - 这会添加 `0.0.0.0/0`（允许所有IP）
     - 点击 "Confirm"
   
   - **选项2（更安全）**：添加特定IP
     - 点击 "Add Current IP Address"（添加你的IP）
     - 或手动输入IP地址

3. **点击 "Confirm"**

---

## 🔗 步骤5：获取连接字符串

### 5.1 进入连接页面

1. **在 "Database" 页面**，找到你的集群
2. **点击 "Connect" 按钮**

### 5.2 选择连接方式

1. **选择 "Connect your application"**

2. **选择驱动和版本**：
   - **Driver**：`Node.js`
   - **Version**：`5.5 or later`（或最新版本）

3. **复制连接字符串**：
   - 你会看到类似这样的字符串：
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 5.3 替换用户名和密码

**重要**：将连接字符串中的占位符替换为实际值：

1. **替换 `<username>`**：
   - 例如：`proreport_user`

2. **替换 `<password>`**：
   - 使用你刚才保存的密码
   - **注意**：如果密码包含特殊字符（如 `@`, `#`, `$` 等），需要进行URL编码：
     - `@` → `%40`
     - `#` → `%23`
     - `$` → `%24`
     - `%` → `%25`

3. **最终连接字符串示例**：
   ```
   mongodb+srv://proreport_user:MyPassword123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 5.4 添加数据库名称（可选）

在连接字符串末尾添加数据库名称：

```
mongodb+srv://proreport_user:MyPassword123@cluster0.xxxxx.mongodb.net/proreport_genai?retryWrites=true&w=majority
```

**完整连接字符串格式**：
```
mongodb+srv://用户名:密码@集群地址.mongodb.net/数据库名?retryWrites=true&w=majority
```

---

## ⚙️ 步骤6：在Vercel配置环境变量

### 6.1 访问Vercel项目

1. **访问Vercel控制台**：
   - https://vercel.com/dashboard

2. **选择你的项目**：
   - 找到 `proreport-genai` 项目
   - 点击进入

### 6.2 添加环境变量

1. **进入设置**：
   - 点击 **"Settings"** 标签
   - 点击 **"Environment Variables"**

2. **添加MongoDB连接字符串**：
   - 点击 **"Add New"**
   - **Key**: `MONGODB_URI`
   - **Value**: 粘贴你刚才复制的完整连接字符串
   - **Environment**: 勾选所有选项
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - 点击 **"Save"**

3. **添加其他环境变量**（如果还没有）：

   **GEMINI_API_KEY**：
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `AIzaSyD7L7GzfFwFu0BVA5N0EEOKCIe20mlAeK8`（或你的API密钥）
   - **Environment**: 全选
   - 点击 **"Save"**

   **JWT_SECRET**：
   - **Key**: `JWT_SECRET`
   - **Value**: 生成一个随机字符串（至少32字符）
     - 可以使用在线工具：https://www.random.org/strings/
     - 或使用这个：`proreport-secret-key-2024-$(date +%s)-random-string`
   - **Environment**: 全选
   - 点击 **"Save"**

   **FRONTEND_URL**（可选）：
   - **Key**: `FRONTEND_URL`
   - **Value**: `*`（允许所有来源）
   - **Environment**: 全选
   - 点击 **"Save"**

   **NODE_ENV**（可选）：
   - **Key**: `NODE_ENV`
   - **Value**: `production`
   - **Environment**: 全选
   - 点击 **"Save"**

### 6.3 验证环境变量

确认以下环境变量都已添加：

- ✅ `MONGODB_URI`
- ✅ `GEMINI_API_KEY`
- ✅ `JWT_SECRET`
- ✅ `FRONTEND_URL`（可选）
- ✅ `NODE_ENV`（可选）

---

## 📤 步骤7：提交代码并部署

### 7.1 安装依赖

```powershell
cd F:\ProReport-GenAI
npm install
```

### 7.2 提交代码

```powershell
git add .
git commit -m "添加MongoDB支持"
git push
```

### 7.3 等待Vercel部署

1. **Vercel会自动检测到代码更新**
2. **开始部署**（约2-5分钟）
3. **查看部署日志**：
   - 在Vercel控制台查看部署状态
   - 应该看到：`📦 使用MongoDB存储`

---

## ✅ 步骤8：测试

### 8.1 访问前端

1. **访问你的Vercel前端URL**：
   - 例如：`https://your-app.vercel.app`

### 8.2 测试功能

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

### 8.3 验证MongoDB

1. **访问MongoDB Atlas控制台**：
   - https://cloud.mongodb.com/

2. **查看数据**：
   - 进入 "Database" → "Browse Collections"
   - 应该看到数据库：`proreport_genai`
   - 应该看到集合：
     - `users` - 包含你注册的用户
     - `projects` - 包含你创建的项目

---

## 🆘 常见问题

### 问题1：连接失败

**错误信息**：`MongoServerError: Authentication failed`

**解决方案**：
- 检查用户名和密码是否正确
- 检查密码中的特殊字符是否进行了URL编码
- 检查连接字符串格式是否正确

### 问题2：网络访问被拒绝

**错误信息**：`MongoServerError: IP not whitelisted`

**解决方案**：
- 在MongoDB Atlas → Network Access
- 确认已添加 `0.0.0.0/0` 或你的IP地址

### 问题3：环境变量未生效

**解决方案**：
- 在Vercel重新部署项目
- 确认环境变量已保存
- 检查环境变量的Environment选项是否全选

### 问题4：数据不保存

**解决方案**：
- 检查Vercel部署日志
- 确认看到 `📦 使用MongoDB存储`
- 检查MongoDB连接字符串是否正确

---

## 🎉 完成！

现在你的后端已经配置好MongoDB Atlas了！

- ✅ 数据会持久化保存
- ✅ 可以在MongoDB Atlas查看数据
- ✅ 支持多用户使用
- ✅ 完全免费

---

## 📚 下一步

1. **测试所有功能**
2. **分享给同事使用**
3. **监控MongoDB使用量**（免费版512MB限制）

---

## 💡 提示

- MongoDB Atlas免费版有512MB存储限制
- 如果数据量大，可以考虑升级到付费版
- 定期备份数据（MongoDB Atlas会自动备份）
- 保护好你的数据库密码，不要泄露

