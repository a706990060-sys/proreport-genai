# ⚡ 快速配置 GEMINI_API_KEY（3步搞定）

## 🎯 问题
错误提示：`GEMINI_API_KEY is not configured`

## ✅ 解决方案（3步）

### 步骤1：获取 API 密钥（1分钟）

1. 访问：https://aistudio.google.com/
2. 登录 Google 账号
3. 点击 "Get API key" 或 "API 密钥"
4. 点击 "Create API key"
5. **复制生成的密钥**（类似：`AIzaSyD7L7GzfFwFu0BVA5N0EEOKCIe20mlAeK8`）

### 步骤2：在 Vercel 中配置（1分钟）

1. 访问：https://vercel.com/dashboard
2. 点击项目 `proreport-genai`
3. 点击 **Settings** → **Environment Variables**
4. 点击 **Add New**
5. 填写：
   - **Key**: `GEMINI_API_KEY`
   - **Value**: 粘贴刚才复制的密钥
   - **Environment**: ✅ 全选（Production、Preview、Development）
6. 点击 **Save**

### 步骤3：重新部署（1分钟）

1. 在 Vercel 控制台，点击 **Deployments**
2. 找到最新部署，点击 **...** → **Redeploy**
3. 等待 2-3 分钟

## 🎉 完成！

刷新浏览器，再次点击"生成本节内容"按钮，应该可以正常工作了！

---

**详细说明请查看：`配置GEMINI_API_KEY-紧急修复.md`**

