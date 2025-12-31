# 🔧 紧急修复：配置 GEMINI_API_KEY

## 问题说明

当前错误：`GEMINI_API_KEY is not configured`

这是因为在 Vercel 环境变量中没有配置 Gemini API 密钥，导致无法生成内容。

## ✅ 解决步骤

### 第一步：获取 Gemini API 密钥

1. **访问 Google AI Studio**
   - 打开：https://aistudio.google.com/
   - 使用你的 Google 账号登录

2. **创建 API 密钥**
   - 点击左侧菜单的 "Get API key" 或 "API 密钥"
   - 点击 "Create API key" 或 "创建 API 密钥"
   - 选择项目（如果没有，创建一个新项目）
   - 复制生成的 API 密钥（格式类似：`AIzaSyD7L7GzfFwFu0BVA5N0EEOKCIe20mlAeK8`）

### 第二步：在 Vercel 中配置环境变量

1. **登录 Vercel**
   - 访问：https://vercel.com/
   - 登录你的账号

2. **进入项目设置**
   - 点击你的项目 `proreport-genai`
   - 点击顶部菜单的 **"Settings"**（设置）
   - 在左侧菜单中点击 **"Environment Variables"**（环境变量）

3. **添加 GEMINI_API_KEY**
   - 点击 **"Add New"**（添加新变量）按钮
   - 在 **"Key"** 字段输入：`GEMINI_API_KEY`
   - 在 **"Value"** 字段粘贴你的 Gemini API 密钥
   - 在 **"Environment"** 选择中，勾选：
     - ✅ **Production**（生产环境）
     - ✅ **Preview**（预览环境）
     - ✅ **Development**（开发环境）
   - 点击 **"Save"**（保存）

4. **重新部署**
   - 配置完成后，Vercel 会自动触发重新部署
   - 或者手动点击 **"Deployments"** 标签，找到最新的部署，点击右侧的 **"..."** 菜单，选择 **"Redeploy"**

### 第三步：验证配置

1. **等待部署完成**（约 2-3 分钟）
2. **刷新浏览器页面**
3. **再次点击"生成本节内容"按钮**
4. **检查是否成功生成内容**

## 📋 环境变量配置清单

确保以下环境变量都已配置：

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `MONGODB_URI` | MongoDB 连接字符串 | ✅ 必需 |
| `GEMINI_API_KEY` | Gemini API 密钥 | ✅ 必需 |
| `JWT_SECRET` | JWT 密钥（建议设置） | ⚠️ 建议 |

## 🔍 如何检查环境变量是否已配置

1. 在 Vercel 项目设置中，进入 **"Environment Variables"**
2. 查看列表中是否有 `GEMINI_API_KEY`
3. 如果有，点击它查看值（会显示为 `••••••••`）
4. 确保它被应用到所有环境（Production、Preview、Development）

## ⚠️ 常见问题

### Q: 配置后仍然报错？
A: 
1. 确保点击了 **"Save"** 按钮
2. 等待 Vercel 重新部署完成（查看 Deployments 标签）
3. 清除浏览器缓存并刷新页面
4. 检查 API 密钥是否正确（没有多余空格）

### Q: 如何获取免费的 Gemini API 密钥？
A: 
- Google AI Studio 提供免费的 API 配额
- 访问 https://aistudio.google.com/ 注册并获取密钥
- 免费配额通常足够个人使用

### Q: API 密钥安全吗？
A: 
- Vercel 环境变量是加密存储的
- 只有项目管理员可以查看和修改
- 不要在代码中硬编码 API 密钥

## 📞 需要帮助？

如果按照以上步骤操作后仍然有问题，请检查：
1. Vercel 部署日志（Deployments → 点击最新部署 → Logs）
2. 浏览器控制台（F12 → Console）
3. 确保 API 密钥格式正确（以 `AIzaSy` 开头）

---

**配置完成后，工具应该可以正常生成内容了！** 🎉

