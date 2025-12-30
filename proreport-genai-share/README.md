# ProReport GenAI - 专业可行性研究报告生成工具

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

这是一个专业的可行性研究报告生成工具，使用 Gemini 3 Pro 模型，能够帮助工程咨询专家快速生成符合中国官方标准的可行性研究报告。

## 功能特点

- 📊 **标准报告模板**：内置 11 个章节的标准可行性研究报告模板
- 🎯 **智能内容生成**：基于项目信息和参考文件生成专业报告章节
- 📎 **多类型参考支持**：
  - **格式参考**：学习现有报告的格式和结构
  - **规范参考**：遵循技术规范和标准
  - **内容参考**：基于项目事实和数据
  - **知识库**：行业背景知识支持
- ✏️ **内容修改和扩写**：支持选中文本进行修改和扩写
- 🔍 **网络搜索**：可选启用 Google 搜索获取最新信息
- 💾 **项目管理**：支持多个项目、版本历史管理
- 📤 **导出功能**：支持导出为 HTML、PDF 等格式

## 技术栈

- React 19.2
- TypeScript
- Vite
- Google GenAI SDK (@google/genai)
- Tailwind CSS

## 安装和运行

### 前置要求

- Node.js (推荐 18+ 版本)
- Gemini API Key（从 [Google AI Studio](https://aistudio.google.com/app/apikey) 获取）

### 安装步骤

1. **安装依赖**：
   ```bash
   npm install
   ```

2. **配置 API Key**：
   - 复制 `.env.local.example` 文件为 `.env.local`
   - 在 `.env.local` 中填入你的 Gemini API Key：
     ```
     GEMINI_API_KEY=your_gemini_api_key_here
     ```

3. **运行开发服务器**：
   ```bash
   npm run dev
   ```

4. **访问应用**：
   打开浏览器访问 `http://localhost:3000`

### 构建生产版本

```bash
npm run build
npm run preview
```

## 使用指南

### 1. 创建新项目

- 点击"新建项目"按钮
- 输入项目名称和描述
- 选择使用标准模板或自定义大纲

### 2. 填写项目信息

- 在侧边栏的"项目信息"标签中填写项目概况
- 这些信息将作为生成报告的基础数据

### 3. 添加参考文件

为每个章节可以添加四种类型的参考文件：

- **格式参考**：上传现有报告，学习其格式和结构
- **规范参考**：上传技术规范文件，确保符合标准
- **内容参考**：上传项目相关文档，提供事实依据
- **知识库**：上传行业知识文档

### 4. 生成报告章节

- 选择要生成的章节
- 点击"生成"按钮
- AI 将根据项目信息、参考文件和章节要求生成内容

### 5. 修改和优化

- 选中需要修改的文本
- 输入修改指令（如"扩写这段"、"添加更多技术细节"）
- AI 将根据指令修改内容

## 报告模板结构

工具内置了标准的可行性研究报告模板，包含以下章节：

1. **第一章 概述**
2. **第二章 项目建设背景和必要性**
3. **第三章 项目需求分析与产出方案**
4. **第四章 项目选址与要素保障**
5. **第五章 项目建设方案**
6. **第六章 项目运营方案**
7. **第七章 项目投融资与财务方案**
8. **第八章 项目影响效果分析**
9. **第九章 项目风险管控方案**
10. **第十章 研究结论及建议**
11. **第十一章 附表、附图和附件**

每个章节都有详细的子章节和要求说明。

## 注意事项

1. **API 密钥安全**：请勿将 `.env.local` 文件提交到版本控制系统
2. **API 配额**：注意 Gemini API 的使用配额限制
3. **内容审核**：生成的内容需要人工审核和调整
4. **参考文件**：上传的参考文件会以 Base64 编码存储在浏览器本地存储中

## 项目结构

```
.
├── App.tsx              # 主应用组件
├── index.tsx            # 入口文件
├── index.html           # HTML 模板
├── types.ts             # TypeScript 类型定义
├── constants.ts         # 报告模板常量
├── services/
│   └── geminiService.ts # Gemini API 服务
├── package.json         # 项目配置
├── tsconfig.json        # TypeScript 配置
└── vite.config.ts       # Vite 配置
```

## 许可证

本项目为 Google AI Studio 导出项目，请遵循相应的使用条款。

## 相关链接

- [Google AI Studio](https://ai.studio/)
- [Gemini API 文档](https://ai.google.dev/docs)
