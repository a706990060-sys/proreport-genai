# 快速开始指南

## 第一步：安装依赖

```bash
npm install
```

## 第二步：配置 API Key

1. 创建 `.env.local` 文件（如果不存在）
2. 添加以下内容：

```
GEMINI_API_KEY=你的_Gemini_API_密钥
```

> **获取 API Key**：访问 [Google AI Studio](https://aistudio.google.com/app/apikey) 获取你的 Gemini API 密钥

## 第三步：运行项目

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动。

## 使用提示

1. **创建项目**：点击"新建项目"开始
2. **填写项目信息**：在侧边栏填写项目概况
3. **添加参考文件**：为章节添加格式参考、规范参考、内容参考等
4. **生成内容**：选择章节后点击"生成"按钮
5. **修改优化**：选中文本后输入修改指令进行优化

## 常见问题

### API Key 错误
- 确保 `.env.local` 文件存在且包含正确的 API Key
- 检查 API Key 是否有效且有足够的配额

### 端口被占用
- 修改 `vite.config.ts` 中的端口号（默认 3000）

### 依赖安装失败
- 确保 Node.js 版本 >= 18
- 尝试删除 `node_modules` 和 `package-lock.json` 后重新安装

