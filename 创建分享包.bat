@echo off
chcp 65001 >nul
title 创建分享包
color 0A

echo.
echo ========================================
echo   创建 ProReport GenAI 分享包
echo ========================================
echo.

:: 检查是否在正确的目录
if not exist "package.json" (
    echo [错误] 请在项目根目录运行此脚本！
    pause
    exit /b 1
)

:: 创建临时目录
set SHARE_DIR=ProReport-GenAI-分享版
if exist "%SHARE_DIR%" (
    echo [提示] 删除旧的分享目录...
    rmdir /s /q "%SHARE_DIR%"
)

echo [1/5] 创建目录结构...
mkdir "%SHARE_DIR%"
mkdir "%SHARE_DIR%\server"

echo [2/5] 复制源代码文件...
xcopy /E /I /Y /Q "src" "%SHARE_DIR%\src\" >nul
xcopy /E /I /Y /Q "components" "%SHARE_DIR%\components\" >nul
xcopy /E /I /Y /Q "services" "%SHARE_DIR%\services\" >nul
xcopy /E /I /Y /Q "server\src" "%SHARE_DIR%\server\src\" >nul

echo [3/5] 复制配置文件...
copy /Y "package.json" "%SHARE_DIR%\" >nul
copy /Y "tsconfig.json" "%SHARE_DIR%\" >nul
copy /Y "vite.config.ts" "%SHARE_DIR%\" >nul
copy /Y "types.ts" "%SHARE_DIR%\" >nul
copy /Y "constants.ts" "%SHARE_DIR%\" >nul
copy /Y "index.html" "%SHARE_DIR%\" >nul
copy /Y "启动工具.bat" "%SHARE_DIR%\" >nul
copy /Y "README.md" "%SHARE_DIR%\" >nul

copy /Y "server\package.json" "%SHARE_DIR%\server\" >nul
copy /Y "server\tsconfig.json" "%SHARE_DIR%\server\" >nul

echo [4/5] 创建环境变量示例文件...
(
echo PORT=3001
echo GEMINI_API_KEY=请替换为你的API密钥
echo JWT_SECRET=请设置一个随机字符串（建议32字符以上）
echo FRONTEND_URL=http://localhost:3000
echo NODE_ENV=development
echo DATA_PATH=./data
) > "%SHARE_DIR%\server\.env.example"

echo [5/5] 复制文档文件...
if exist "用户使用说明.md" copy /Y "用户使用说明.md" "%SHARE_DIR%\" >nul
if exist "README.md" copy /Y "README.md" "%SHARE_DIR%\" >nul
if exist "快速部署指南.md" copy /Y "快速部署指南.md" "%SHARE_DIR%\" >nul

:: 创建用户使用说明
(
echo # ProReport GenAI 使用说明
echo.
echo ## 快速开始
echo.
echo ### 1. 安装依赖
echo.
echo ```bash
echo # 安装前端依赖
echo npm install
echo.
echo # 安装后端依赖
echo cd server
echo npm install
echo cd ..
echo ```
echo.
echo ### 2. 配置环境变量
echo.
echo 1. 复制 `server\.env.example` 为 `server\.env`
echo 2. 编辑 `server\.env`，填入：
echo    - `GEMINI_API_KEY`：你的Gemini API密钥
echo    - `JWT_SECRET`：随机字符串（建议32字符以上）
echo.
echo ### 3. 启动服务
echo.
echo 双击 `启动工具.bat` 或运行：
echo ```bash
echo npm run dev
echo ```
echo.
echo ### 4. 访问应用
echo.
echo 打开浏览器访问：http://localhost:3000
echo.
echo ## 注意事项
echo.
echo - 首次使用需要注册账号
echo - 确保端口3000和3001未被占用
echo - 需要有效的Gemini API密钥
) > "%SHARE_DIR%\使用说明.md"

echo.
echo ========================================
echo   分享包创建完成！
echo ========================================
echo.
echo 分享目录: %SHARE_DIR%\
echo.
echo 下一步：
echo 1. 检查分享目录内容
echo 2. 压缩为ZIP文件
echo 3. 分享给其他用户
echo.
pause

