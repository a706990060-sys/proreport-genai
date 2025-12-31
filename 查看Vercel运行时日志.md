# 🔍 查看Vercel Functions运行时日志

## 📍 重要：区分构建日志和运行时日志

- **构建日志**：显示npm警告（黄色）- 这些可以忽略
- **运行时日志**：显示函数执行时的错误 - 这些需要查看

## 🔍 如何查看运行时日志

### 方法1：在Vercel控制台查看

1. **访问Vercel控制台**：https://vercel.com/dashboard
2. **选择你的项目**
3. **点击 "Logs" 标签**（顶部导航栏，不是Deployments标签）
4. **查看实时日志**：
   - 应该看到函数执行时的日志
   - 包括错误信息和堆栈跟踪

### 方法2：在部署详情中查看

1. **进入 "Deployments" 标签**
2. **点击最新的部署**
3. **查看 "Functions" 部分**（如果有）
4. **或查看 "Runtime Logs"**（运行时日志）

### 方法3：触发请求后查看

1. **在浏览器中访问**：`https://proreport-genai.vercel.app/api/health`
2. **立即在Vercel控制台查看 "Logs" 标签**
3. **应该看到新的日志条目**，包括错误信息

---

## 🐛 常见运行时错误

### 错误1：模块未找到

**错误信息**：
```
Cannot find module '../server/src/services/storageService.js'
```

**原因**：导入路径在Vercel环境中无法解析

**解决方案**：需要调整导入路径或文件结构

### 错误2：MongoDB连接失败

**错误信息**：
```
MongoServerError: Authentication failed
```

**原因**：MONGODB_URI配置错误或网络访问未配置

**解决方案**：检查环境变量和MongoDB Atlas配置

### 错误3：JWT_SECRET未设置

**错误信息**：
```
JWT_SECRET is not defined
```

**原因**：环境变量未配置

**解决方案**：在Vercel添加JWT_SECRET环境变量

---

## 📋 需要的信息

请提供：
1. **Vercel Logs标签中的错误信息**（不是构建日志）
2. **完整的错误堆栈跟踪**
3. **错误发生的时间**（触发API请求后）

---

## 💡 提示

- **构建日志**：显示在 "Deployments" → 部署详情 → "Build Logs"
- **运行时日志**：显示在 "Logs" 标签（顶部导航栏）
- **触发请求**：访问 `/api/health` 后会生成新的日志

