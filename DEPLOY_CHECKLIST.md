# ✅ 快速部署检查清单

## 📋 部署前准备

- [ ] 代码已提交到GitHub
- [ ] 已准备好Gemini API Key
- [ ] 已准备好JWT Secret（随机字符串）

## 🌐 Vercel部署（前端）

- [ ] 已注册Vercel账号
- [ ] 已导入GitHub仓库
- [ ] 已配置构建命令：`npm run build:client`
- [ ] 已设置输出目录：`dist`
- [ ] 已获取前端URL：`https://xxx.vercel.app`

## 🔧 Railway部署（后端）

- [ ] 已注册Railway账号
- [ ] 已导入GitHub仓库
- [ ] 已设置根目录：`server`
- [ ] 已配置环境变量：
  - [ ] `GEMINI_API_KEY`
  - [ ] `JWT_SECRET`
  - [ ] `FRONTEND_URL`（前端URL）
  - [ ] `NODE_ENV=production`
  - [ ] `DATA_PATH=./data`
- [ ] 已获取后端URL：`https://xxx.up.railway.app`

## 🔗 连接前后端

- [ ] 已在Vercel添加环境变量：`VITE_API_URL`
- [ ] `VITE_API_URL` 值设置为：`https://xxx.up.railway.app/api`
- [ ] 已重新部署前端

## ✅ 验证测试

- [ ] 后端健康检查通过：`/api/health`
- [ ] 前端页面可以访问
- [ ] 可以注册账号
- [ ] 可以登录
- [ ] 可以创建项目
- [ ] 可以生成内容

## 📝 用户说明

- [ ] 已创建用户使用说明文档
- [ ] 已提供访问网址给用户

---

## 🎯 快速命令

### 检查后端
```bash
curl https://your-railway-url.up.railway.app/api/health
```

### 检查前端
打开浏览器访问：`https://your-app.vercel.app`

---

## 📞 部署完成后

给用户的访问信息：
- **网址：** https://your-app.vercel.app
- **使用方式：** 打开浏览器访问即可
- **无需下载安装**

