# 📊 ProReport GenAI - 专业可行性研究报告生成工具

<div align="center">
<img width="1200" height="475" alt="ProReport GenAI" src="https://via.placeholder.com/1200x475?text=ProReport+GenAI" />
</div>

这是一个专业的可行性研究报告生成工具，使用 Gemini API，能够帮助工程咨询专家快速生成符合中国官方标准的可行性研究报告。

## ✨ 功能特点

- 📊 **标准报告模板**：内置 11 个章节的标准可行性研究报告模板
- 🎯 **智能内容生成**：基于项目信息和参考文件生成专业报告章节
- 📎 **多类型参考支持**：
  - **格式参考**：学习现有报告的格式和结构
  - **规范参考**：遵循技术规范和标准
  - **内容参考**：基于项目事实和数据
  - **知识库**：行业背景知识支持
- ✏️ **内容修改和扩写**：支持选中文本进行修改和扩写
- 💾 **项目管理**：支持多个项目、版本历史管理
- 👥 **多用户支持**：用户注册登录，数据隔离存储
- 📤 **导出功能**：支持导出为 HTML、PDF 等格式

## 🛠️ 技术栈

### 前端
- React 19.2
- TypeScript
- Vite
- Tailwind CSS

### 后端
- Node.js
- Express
- TypeScript
- JWT认证
- 文件存储

## 🚀 快速开始

### 本地开发

1. **克隆仓库**
   ```bash
   git clone https://github.com/your-username/proreport-genai.git
   cd proreport-genai
   ```

2. **安装依赖**
   ```bash
   # 安装前端依赖
   npm install
   
   # 安装后端依赖
   cd server
   npm install
   cd ..
   ```

3. **配置环境变量**
   
   复制 `server/.env.example` 为 `server/.env`，并填入：
   ```env
   GEMINI_API_KEY=你的API密钥
   JWT_SECRET=随机字符串（建议32字符以上）
   ```

4. **启动服务**
   ```bash
   npm run dev
   ```

5. **访问应用**
   
   打开浏览器访问：http://localhost:3000

### 在线部署

查看 `快速部署指南.md` 了解详细部署步骤。

## 📖 使用说明

1. **注册/登录**：首次使用需要注册账号
2. **创建项目**：点击"新建项目"开始
3. **生成内容**：选择章节，填写要求，点击生成
4. **编辑优化**：对生成的内容进行编辑和优化
5. **导出报告**：完成后导出为HTML或PDF

## 📝 项目结构

```
proreport-genai/
├── src/              # 前端源代码
├── components/       # React组件
├── services/         # 前端服务
├── server/           # 后端代码
│   ├── src/          # 后端源代码
│   └── data/         # 数据存储
├── package.json      # 前端依赖
└── server/
    └── package.json  # 后端依赖
```

## 🔧 环境变量

### 后端环境变量（server/.env）

```env
PORT=3001
GEMINI_API_KEY=你的API密钥
JWT_SECRET=随机字符串
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
DATA_PATH=./data
```

## 📚 文档

- `快速部署指南.md` - 部署到Vercel和Railway
- `用户使用说明.md` - 用户操作指南
- `部署操作步骤.md` - 详细部署步骤

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- Google Gemini API
- React团队
- 所有贡献者
