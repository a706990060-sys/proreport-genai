# 分享应用指南

本文档说明如何将 ProReport GenAI 应用分享给你的朋友。

## 方式一：打包为 ZIP 文件（推荐）

### 步骤 1：准备分享文件

创建一个不包含敏感信息和依赖的干净版本：

1. **排除以下文件和文件夹**：
   - `node_modules/` - 依赖包（朋友需要自己安装）
   - `.env.local` - 你的 API key（敏感信息）
   - `dist/` - 构建输出
   - `proreport-genai-extracted/` - 原始解压文件夹
   - `proreport-genai (1).zip` - 原始 zip 文件
   - `desktop.ini` - 系统文件

2. **必须包含的文件**：
   - 所有源代码文件（`.tsx`, `.ts`, `.html`）
   - `package.json`
   - `tsconfig.json`
   - `vite.config.ts`
   - `README.md`
   - `QUICKSTART.md`
   - `.env.local.example`（示例文件）
   - `.gitignore`

### 步骤 2：创建 ZIP 文件

使用以下 PowerShell 命令创建干净的分享包：

```powershell
# 创建分享目录
New-Item -ItemType Directory -Path "proreport-genai-share" -Force

# 复制必要文件
Copy-Item "App.tsx" -Destination "proreport-genai-share\"
Copy-Item "index.tsx" -Destination "proreport-genai-share\"
Copy-Item "index.html" -Destination "proreport-genai-share\"
Copy-Item "types.ts" -Destination "proreport-genai-share\"
Copy-Item "constants.ts" -Destination "proreport-genai-share\"
Copy-Item "package.json" -Destination "proreport-genai-share\"
Copy-Item "tsconfig.json" -Destination "proreport-genai-share\"
Copy-Item "vite.config.ts" -Destination "proreport-genai-share\"
Copy-Item "metadata.json" -Destination "proreport-genai-share\"
Copy-Item "README.md" -Destination "proreport-genai-share\"
Copy-Item "QUICKSTART.md" -Destination "proreport-genai-share\"
Copy-Item ".gitignore" -Destination "proreport-genai-share\"

# 复制 services 目录
Copy-Item "services" -Destination "proreport-genai-share\" -Recurse

# 复制 .env.local.example（如果存在）
if (Test-Path ".env.local.example") {
    Copy-Item ".env.local.example" -Destination "proreport-genai-share\"
}

# 创建 ZIP 文件
Compress-Archive -Path "proreport-genai-share\*" -DestinationPath "proreport-genai-share.zip" -Force

# 清理临时目录
Remove-Item "proreport-genai-share" -Recurse -Force
```

或者手动选择文件创建 ZIP：
1. 选中所有源代码文件（不包括 node_modules、.env.local 等）
2. 右键 → 发送到 → 压缩(zipped)文件夹
3. 命名为 `proreport-genai-share.zip`

## 方式二：使用 Git 仓库（适合开发者）

### 步骤 1：初始化 Git 仓库

```bash
git init
git add .
git commit -m "Initial commit: ProReport GenAI"
```

### 步骤 2：推送到 GitHub/Gitee

1. 在 GitHub/Gitee 创建新仓库
2. 添加远程仓库：
   ```bash
   git remote add origin <你的仓库URL>
   git push -u origin main
   ```

### 步骤 3：分享仓库链接

将仓库链接分享给朋友，他们可以：
```bash
git clone <仓库URL>
cd proreport-genai
npm install
# 配置 .env.local
npm run dev
```

## 方式三：直接分享文件夹（本地网络）

如果朋友在同一局域网：

1. 确保 `.env.local` 已删除或重命名
2. 压缩整个项目文件夹（排除 node_modules）
3. 通过 U盘、网盘或局域网共享

## 朋友接收后的安装步骤

收到分享包后，朋友需要：

1. **解压文件**到任意目录

2. **安装依赖**：
   ```bash
   npm install
   ```

3. **配置 API Key**：
   - 复制 `.env.local.example` 为 `.env.local`
   - 在 `.env.local` 中填入自己的 Gemini API Key：
     ```
     GEMINI_API_KEY=朋友的API密钥
     ```
   - 获取 API Key：访问 https://aistudio.google.com/app/apikey

4. **运行应用**：
   ```bash
   npm run dev
   ```

5. **访问应用**：
   打开浏览器访问 `http://localhost:3000`

## 重要提醒

### 分享前检查清单

- [ ] 已删除 `.env.local` 文件（包含你的 API key）
- [ ] 已排除 `node_modules` 文件夹
- [ ] 已包含 `.env.local.example` 示例文件
- [ ] 已包含 `README.md` 和 `QUICKSTART.md`
- [ ] 已测试打包文件可以正常解压和运行

### 安全建议

1. **不要分享 API Key**：每个用户应该使用自己的 API key
2. **检查文件大小**：如果 ZIP 文件很大（>50MB），可能包含了 `node_modules`，需要重新打包
3. **提供说明文档**：确保朋友知道如何配置和运行

## 常见问题

**Q: 为什么分享的文件没有 node_modules？**
A: `node_modules` 文件夹很大（通常几百MB），而且每个用户需要根据系统环境重新安装，所以不包含在分享包中。

**Q: 朋友需要自己申请 API Key 吗？**
A: 是的，每个用户需要从 Google AI Studio 申请自己的免费 API key。

**Q: 可以分享给多少人？**
A: 理论上没有限制，但注意 Gemini API 有使用配额限制，每个用户需要管理自己的配额。

