# 🔍 测试API连接

## 🐛 问题：无法连接到服务器

从登录界面看到错误："无法连接到服务器，请检查后端服务是否运行"

## 🔍 诊断步骤

### 步骤1：测试API健康检查

在浏览器中直接访问：

```
https://proreport-genai.vercel.app/api/health
```

**应该返回**：
```json
{
  "success": true,
  "message": "Server is running on Vercel"
}
```

**如果返回404或错误**：
- API路由配置有问题
- 需要检查Vercel Functions部署

### 步骤2：检查Vercel Functions日志

1. **在Vercel控制台**
2. **选择你的项目**
3. **点击 "Logs" 标签**（顶部导航栏）
4. **查看函数日志**：
   - 应该看到API请求的日志
   - 如果有错误，会显示具体错误信息

### 步骤3：检查浏览器网络请求

1. **打开前端URL**
2. **按 `F12` 打开开发者工具**
3. **切换到 "Network" 标签**
4. **点击 "Login" 按钮**
5. **查看请求**：
   - 请求URL应该是：`/api/auth/login`
   - 检查状态码：
     - `200` = 成功
     - `404` = API路由未找到
     - `500` = 服务器错误
     - `CORS error` = CORS配置问题

---

## 🔧 可能的问题和解决方案

### 问题1：API路由404

**原因**：
- `vercel.json` 的rewrites配置不正确
- API函数未正确部署

**解决方案**：
- 检查 `vercel.json` 配置
- 确认 `api/index.ts` 文件存在
- 重新部署

### 问题2：动态导入失败

**原因**：
- Vercel Serverless Functions中动态导入可能有问题
- 路径解析失败

**解决方案**：
- 检查Vercel Functions日志
- 可能需要改用不同的导入方式

### 问题3：MongoDB连接失败

**原因**：
- `MONGODB_URI` 环境变量未配置或配置错误
- MongoDB网络访问未配置

**解决方案**：
- 检查Vercel环境变量
- 检查MongoDB Atlas网络访问配置

---

## 🧪 快速测试

### 测试1：健康检查

在浏览器中访问：
```
https://proreport-genai.vercel.app/api/health
```

### 测试2：查看Vercel Functions

1. **在Vercel控制台**
2. **选择项目**
3. **点击 "Functions" 标签**（如果有）
4. **查看 `api/index.ts` 函数**

### 测试3：查看部署日志

1. **在Vercel控制台**
2. **Deployments → 最新部署**
3. **查看 "Functions" 部分**
4. **确认 `api/index.ts` 已部署**

---

## 📋 需要的信息

请提供以下信息：

1. **访问 `/api/health` 的结果**（在浏览器中直接访问）
2. **Vercel Functions日志**（如果有错误）
3. **浏览器Network标签中的请求详情**：
   - 请求URL
   - 状态码
   - 响应内容

---

## 💡 提示

- **健康检查端点**：`/api/health` 应该总是可用的
- **如果健康检查失败**：说明API路由配置有问题
- **如果健康检查成功但登录失败**：说明是认证或MongoDB的问题

