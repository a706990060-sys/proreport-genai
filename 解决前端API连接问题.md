# 解决前端API连接问题

## 问题症状
前端仍然尝试连接 `localhost:3001`，而不是使用 Vercel Serverless Function。

## 解决方案

### 1. 清除浏览器缓存
浏览器可能缓存了旧版本的 JavaScript 文件。

**方法1：硬刷新**
- Windows/Linux: `Ctrl + Shift + R` 或 `Ctrl + F5`
- Mac: `Cmd + Shift + R`

**方法2：清除缓存**
1. 打开浏览器开发者工具（F12）
2. 右键点击刷新按钮
3. 选择"清空缓存并硬性重新加载"

**方法3：无痕模式测试**
- 打开无痕/隐私模式窗口
- 访问你的 Vercel URL
- 检查是否还有 `localhost:3001` 错误

### 2. 检查 Vercel 部署状态
1. 登录 Vercel 控制台
2. 进入项目 `proreport-genai`
3. 检查最新的部署是否成功
4. 如果看到失败的部署，点击查看日志

### 3. 验证代码已更新
在浏览器控制台（F12）中，应该看到以下日志：
```
=== API配置信息 ===
API_BASE_URL: /api
当前hostname: proreport-genai.vercel.app (或你的域名)
当前URL: https://proreport-genai.vercel.app/...
环境变量VITE_API_URL: 未设置
==================
```

如果看到 `API_BASE_URL: http://localhost:3001/api`，说明浏览器仍在使用旧版本。

### 4. 手动触发重新部署
如果代码已推送但 Vercel 没有自动部署：

1. 在 Vercel 控制台
2. 进入项目设置
3. 找到 "Git" 或 "Deployments" 标签
4. 点击 "Redeploy" 或 "Redeploy Latest"

### 5. 检查网络请求
在浏览器开发者工具的 "Network" 标签中：

1. 刷新页面
2. 查找对 `/api/auth/me` 或 `/api/auth/login` 的请求
3. 检查请求的 URL：
   - ✅ 正确：`https://proreport-genai.vercel.app/api/auth/me`
   - ❌ 错误：`http://localhost:3001/api/auth/me`

### 6. 如果问题仍然存在

**临时解决方案：**
在 Vercel 环境变量中设置 `VITE_API_URL=/api`：

1. 进入 Vercel 项目设置
2. 找到 "Environment Variables"
3. 添加：
   - Key: `VITE_API_URL`
   - Value: `/api`
   - Environment: Production, Preview, Development
4. 保存后重新部署

**检查构建日志：**
1. 在 Vercel 部署详情页面
2. 查看 "Build Logs"
3. 确认没有构建错误
4. 确认构建成功完成

## 验证修复

修复后，在浏览器控制台应该看到：
- ✅ `API_BASE_URL: /api`
- ✅ 网络请求指向 `/api/...` 而不是 `localhost:3001`
- ✅ 登录功能正常工作
- ❌ 不再有 `ERR_CONNECTION_REFUSED` 错误

## 联系支持

如果以上步骤都无法解决问题，请提供：
1. 浏览器控制台的完整错误日志
2. Vercel 部署日志
3. 网络请求的详细信息（从 Network 标签）

