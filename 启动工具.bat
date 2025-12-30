@echo off
chcp 65001 >nul
title ProReport GenAI - 启动中...
color 0A

echo.
echo ========================================
echo   ProReport GenAI 启动工具
echo ========================================
echo.

:: 检查是否在正确的目录
if not exist "package.json" (
    echo [错误] 请在项目根目录运行此脚本！
    echo 当前目录: %CD%
    pause
    exit /b 1
)

:: 检查Node.js是否安装
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

:: 检查npm是否安装
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 npm，请先安装 Node.js
    pause
    exit /b 1
)

echo [1/3] 检查依赖...
if not exist "node_modules" (
    echo [提示] 检测到未安装依赖，正在安装前端依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo [错误] 前端依赖安装失败
        pause
        exit /b 1
    )
)

if not exist "server\node_modules" (
    echo [提示] 检测到未安装后端依赖，正在安装后端依赖...
    cd server
    call npm install
    cd ..
    if %errorlevel% neq 0 (
        echo [错误] 后端依赖安装失败
        pause
        exit /b 1
    )
)

echo [2/3] 检查环境配置...
if not exist "server\.env" (
    echo [警告] 未找到 server\.env 文件
    echo [提示] 正在创建默认配置文件...
    (
        echo PORT=3001
        echo GEMINI_API_KEY=请替换为你的API密钥
        echo JWT_SECRET=proreport-secret-key-change-this-in-production
        echo FRONTEND_URL=http://localhost:3000
        echo NODE_ENV=development
        echo DATA_PATH=./data
    ) > server\.env
    echo [提示] 已创建 server\.env，请编辑并填入正确的配置
    timeout /t 3 >nul
)

echo [3/3] 检查启动依赖...
:: 检查concurrently是否安装
call npm list concurrently >nul 2>&1
if %errorlevel% neq 0 (
    echo [提示] 正在安装 concurrently...
    call npm install concurrently --save-dev
)

echo.
echo ========================================
echo   服务启动中，请稍候...
echo ========================================
echo.
echo 前端地址: http://localhost:3000
echo 后端地址: http://localhost:3001
echo.
echo 启动成功后，请在浏览器中访问: http://localhost:3000
echo.
echo 按 Ctrl+C 可停止服务
echo ========================================
echo.

:: 启动服务
call npm run dev

pause

