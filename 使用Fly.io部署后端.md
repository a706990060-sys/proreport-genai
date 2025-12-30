# 🚀 使用Fly.io部署后端（无需信用卡）

## ✅ 为什么选择Fly.io？

- ✅ **完全免费**（不需要信用卡）
- ✅ **性能好**（不会休眠）
- ✅ **稳定可靠**
- ✅ **全球CDN**

---

## 📥 步骤1：安装Fly CLI

### Windows PowerShell

打开PowerShell（以管理员身份运行），执行：

```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

### 或者手动下载

1. 访问：https://fly.io/docs/getting-started/installing-flyctl/
2. 下载Windows安装包
3. 安装

### 验证安装

```bash
fly version
```

如果显示版本号，说明安装成功。

---

## 🔐 步骤2：登录Fly.io

```bash
fly auth login
```

这会：
1. 打开浏览器
2. 提示你用GitHub登录
3. 授权后自动完成登录

---

## 🚀 步骤3：初始化Fly应用

```bash
cd F:\ProReport-GenAI\server
fly launch
```

按照提示操作：

1. **App name**: 
   - 可以直接回车使用自动生成的名称
   - 或输入：`proreport-genai-backend`

2. **Region**: 
   - 选择离你最近的区域
   - 建议选择：`sin`（新加坡）或 `iad`（美国东部）

3. **Postgres/Redis**: 
   - 直接回车跳过（我们不需要数据库）

4. **Deploy now**: 
   - 输入 `n`（先不部署，等配置好环境变量）

---

## 🔐 步骤4：配置环境变量

```bash
fly secrets set GEMINI_API_KEY=AIzaSyD7L7GzfFwFu0BVA5N0EEOKCIe20mlAeK8
fly secrets set JWT_SECRET=proreport-secret-key-2024-change-this
fly secrets set FRONTEND_URL=https://your-app.vercel.app
fly secrets set NODE_ENV=production
fly secrets set DATA_PATH=./data
```

**注意**：
- `FRONTEND_URL` 需要填写你的Vercel前端URL
- `JWT_SECRET` 建议改为更复杂的随机字符串

---

## 📝 步骤5：检查fly.toml配置

Fly会自动创建 `server/fly.toml` 文件，检查并确保：

```toml
[build]
  builder = "nixpacks"

[env]
  PORT = "3001"

[http_service]
  internal_port = 3001
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 0
```

如果缺少，可以手动创建或修改。

---

## 🚀 步骤6：部署

```bash
fly deploy
```

等待部署完成（约5-10分钟）。

部署过程中会显示：
- 构建进度
- 部署状态
- 任何错误信息

---

## ✅ 步骤7：获取URL

部署成功后，Fly会显示：

```
App is available at https://proreport-genai-backend.fly.dev
```

**重要：复制这个URL！**

---

## 🔗 步骤8：连接前后端

### 在Vercel添加环境变量

1. 回到Vercel项目页面
2. Settings → Environment Variables
3. 添加：
   - **Key**: `VITE_API_URL`
   - **Value**: `https://proreport-genai-backend.fly.dev/api`
4. 保存

### 重新部署前端

1. Vercel → Deployments
2. 最新部署 → "..." → "Redeploy"
3. 等待重新部署完成

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

---

## 🛠️ 常用Fly命令

```bash
# 查看应用状态
fly status

# 查看日志
fly logs

# 查看环境变量
fly secrets list

# 更新环境变量
fly secrets set KEY=value

# 重新部署
fly deploy

# 打开应用
fly open
```

---

## 🆘 遇到问题？

### 部署失败

- 检查 `server/fly.toml` 配置
- 检查环境变量是否正确
- 查看 `fly logs` 查看错误

### 服务无法访问

- 检查 `fly status` 查看服务状态
- 检查环境变量配置
- 查看日志：`fly logs`

---

## 🎉 完成！

部署完成后，把前端URL分享给其他用户即可！

