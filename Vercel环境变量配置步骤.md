# ⚙️ Vercel环境变量配置步骤（详细版）

## 📍 步骤1：访问Vercel项目

1. **打开浏览器**，访问：
   ```
   https://vercel.com/dashboard
   ```

2. **登录你的Vercel账号**

3. **找到你的项目**：
   - 在项目列表中找到 `proreport-genai`
   - 点击项目名称进入

---

## 📍 步骤2：进入环境变量设置

1. **点击顶部导航栏的 "Settings"**（设置）

2. **在左侧菜单中找到 "Environment Variables"**（环境变量）
   - 点击进入

---

## 📍 步骤3：添加环境变量

### 3.1 添加 MONGODB_URI（最重要）

1. **点击 "Add New" 按钮**（右上角或页面顶部）

2. **填写信息**：
   - **Key（键）**: `MONGODB_URI`
   - **Value（值）**: 粘贴你的MongoDB连接字符串
     - 格式：`mongodb+srv://用户名:密码@集群地址.mongodb.net/proreport_genai?retryWrites=true&w=majority`
     - **重要**：确保已替换用户名和密码
     - **重要**：确保已添加数据库名称 `/proreport_genai`

3. **Environment（环境）**: 
   - ✅ 勾选 **Production**（生产环境）
   - ✅ 勾选 **Preview**（预览环境）
   - ✅ 勾选 **Development**（开发环境）
   - **建议全选**，这样所有环境都能使用

4. **点击 "Save"**（保存）

### 3.2 添加 GEMINI_API_KEY

1. **点击 "Add New"**

2. **填写信息**：
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `AIzaSyD7L7GzfFwFu0BVA5N0EEOKCIe20mlAeK8`
     - 或使用你自己的Gemini API密钥

3. **Environment**: 全选

4. **点击 "Save"**

### 3.3 添加 JWT_SECRET

1. **点击 "Add New"**

2. **填写信息**：
   - **Key**: `JWT_SECRET`
   - **Value**: 生成一个随机字符串（至少32字符）
     - 可以使用在线工具：https://www.random.org/strings/
     - 或使用这个示例：`proreport-secret-key-2024-12-30-random-string-change-this`
     - **重要**：建议使用更复杂的随机字符串

3. **Environment**: 全选

4. **点击 "Save"**

### 3.4 添加 FRONTEND_URL（可选）

1. **点击 "Add New"**

2. **填写信息**：
   - **Key**: `FRONTEND_URL`
   - **Value**: `*`
     - `*` 表示允许所有来源
     - 或填写你的前端URL（例如：`https://your-app.vercel.app`）

3. **Environment**: 全选

4. **点击 "Save"**

### 3.5 添加 NODE_ENV（可选）

1. **点击 "Add New"**

2. **填写信息**：
   - **Key**: `NODE_ENV`
   - **Value**: `production`

3. **Environment**: 全选

4. **点击 "Save"**

---

## ✅ 步骤4：验证环境变量

配置完成后，你应该看到以下环境变量列表：

| Key | Value（部分显示） | Environment |
|-----|------------------|-------------|
| `MONGODB_URI` | `mongodb+srv://...` | Production, Preview, Development |
| `GEMINI_API_KEY` | `AIzaSy...` | Production, Preview, Development |
| `JWT_SECRET` | `proreport-secret...` | Production, Preview, Development |
| `FRONTEND_URL` | `*` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production, Preview, Development |

---

## 🔄 步骤5：重新部署

### 方法1：自动触发（推荐）

1. **推送代码到GitHub**（如果还没推送）：
   ```powershell
   cd F:\ProReport-GenAI
   git push
   ```
   - 如果推送失败，可以稍后重试
   - 或使用GitHub Desktop推送

2. **Vercel会自动检测到代码更新**
3. **自动开始部署**

### 方法2：手动触发

1. **在Vercel控制台**
2. **进入 "Deployments" 标签**
3. **找到最新的部署**
4. **点击 "..." → "Redeploy"**（重新部署）
5. **等待部署完成**（约2-5分钟）

---

## 🔍 步骤6：查看部署日志

1. **在Vercel控制台**
2. **点击最新的部署**
3. **查看 "Build Logs"**（构建日志）
4. **应该看到**：
   - `📦 使用MongoDB存储`（如果配置正确）
   - 或 `📁 使用文件系统存储`（如果MONGODB_URI未配置）

---

## ✅ 步骤7：测试

### 7.1 访问前端

1. **在Vercel控制台的 "Deployments" 标签**
2. **找到最新的部署**
3. **点击部署URL**（例如：`https://your-app.vercel.app`）

### 7.2 测试功能

1. **注册新用户**：
   - 应该能成功注册
   - 数据会保存到MongoDB

2. **登录**：
   - 应该能成功登录

3. **创建项目**：
   - 应该能成功创建

### 7.3 验证MongoDB

1. **访问MongoDB Atlas**：
   - https://cloud.mongodb.com/

2. **查看数据**：
   - Database → Browse Collections
   - 应该看到 `proreport_genai` 数据库
   - 应该看到 `users` 和 `projects` 集合

---

## 🆘 常见问题

### 问题1：环境变量未生效

**解决方案**：
- 确认环境变量的Environment选项已全选
- 重新部署项目
- 检查环境变量名称是否正确（区分大小写）

### 问题2：MongoDB连接失败

**检查**：
- MONGODB_URI格式是否正确
- 用户名和密码是否正确
- 特殊字符是否进行了URL编码
- 网络访问是否已配置

### 问题3：部署失败

**检查**：
- 查看部署日志中的错误信息
- 确认所有环境变量已配置
- 确认代码已提交到GitHub

---

## 🎉 完成！

配置完成后，你的应用就可以：
- ✅ 使用MongoDB存储数据
- ✅ 在Vercel上运行
- ✅ 完全免费
- ✅ 不需要信用卡

---

## 📚 下一步

1. **测试所有功能**
2. **分享给同事使用**
3. **监控使用量**

