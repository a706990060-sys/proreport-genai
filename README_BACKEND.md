# 前后端分离架构说明

## 项目结构

```
F:\ProReport-GenAI\
├── server/              # 后端服务器
│   ├── src/
│   │   ├── index.ts     # 服务器入口
│   │   ├── routes/      # API路由
│   │   ├── controllers/ # 控制器
│   │   ├── services/    # 业务逻辑服务
│   │   ├── middleware/  # 中间件（认证等）
│   │   └── types/       # 类型定义
│   ├── data/            # 数据存储目录（自动创建）
│   └── package.json
├── src/                 # 前端源代码
│   └── services/
│       └── apiClient.ts # API客户端
├── services/            # 前端服务（已更新为调用API）
└── package.json         # 前端配置
```

## 技术栈

### 后端
- **Express** - Web框架
- **TypeScript** - 类型安全
- **JWT** - 用户认证
- **bcryptjs** - 密码加密
- **@google/genai** - Gemini API调用
- **文件存储** - JSON文件存储（可升级为数据库）

### 前端
- **React** - UI框架
- **Vite** - 构建工具
- **API Client** - 统一的API调用接口

## API端点

### 认证 (`/api/auth`)
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录
- `GET /api/auth/me` - 获取当前用户

### 项目 (`/api/projects`)
- `GET /api/projects` - 获取所有项目
- `GET /api/projects/:id` - 获取单个项目
- `POST /api/projects` - 创建项目
- `PUT /api/projects/:id` - 更新项目
- `DELETE /api/projects/:id` - 删除项目

### 资料库 (`/api/library`)
- `GET /api/library/files` - 获取所有文件
- `POST /api/library/files` - 保存文件列表
- `GET /api/library/groups` - 获取所有分组
- `POST /api/library/groups` - 保存分组列表

### 生成 (`/api/generate`)
- `POST /api/generate/section` - 生成章节内容
- `POST /api/generate/refine` - 修改/扩写内容

## 运行项目

### 开发模式（前后端同时运行）

```bash
npm run dev
```

这会同时启动：
- 前端开发服务器：http://localhost:3000
- 后端API服务器：http://localhost:3001

### 单独运行

**前端：**
```bash
npm run dev:client
```

**后端：**
```bash
npm run dev:server
```

### 生产模式

**构建：**
```bash
npm run build
```

**启动后端：**
```bash
npm start
```

## 配置

### 后端配置 (`server/.env`)

```env
PORT=3001
NODE_ENV=development
GEMINI_API_KEY=your_api_key
JWT_SECRET=your_secret_key
DATA_PATH=./data
FRONTEND_URL=http://localhost:3000
```

### 前端配置

Vite会自动代理 `/api` 请求到后端服务器。

## 数据存储

- **用户数据**：`server/data/users.json`
- **项目数据**：`server/data/projects/{userId}.json`
- **资料库文件**：`server/data/library/{userId}_files.json`
- **资料库分组**：`server/data/library/{userId}_groups.json`

## 安全特性

1. **JWT认证**：所有API请求需要Bearer Token
2. **密码加密**：使用bcrypt加密存储
3. **数据隔离**：每个用户的数据完全隔离
4. **API Key保护**：Gemini API Key只在后端使用，不会暴露给前端

## 迁移说明

### 从旧版本迁移

1. 旧数据存储在浏览器localStorage中
2. 新版本数据存储在服务器文件系统中
3. 首次登录后，需要重新创建项目（或手动迁移数据）

### 数据迁移工具（可选）

可以创建一个迁移脚本，将localStorage中的数据导入到后端。

## 注意事项

1. **API Key安全**：确保 `.env` 文件不被提交到版本控制
2. **JWT Secret**：生产环境请使用强随机字符串
3. **数据备份**：定期备份 `server/data` 目录
4. **CORS配置**：生产环境需要正确配置CORS

## 未来改进

1. **数据库支持**：可以升级为MongoDB或PostgreSQL
2. **文件上传**：支持直接上传文件到服务器
3. **数据同步**：添加实时数据同步功能
4. **缓存优化**：添加Redis缓存层






