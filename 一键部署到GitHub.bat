@echo off
chcp 65001 >nul
title 一键部署到GitHub
color 0E

echo.
echo ========================================
echo   ProReport GenAI - 部署到GitHub
echo ========================================
echo.

:: 检查是否在正确的目录
if not exist "package.json" (
    echo [错误] 请在项目根目录运行此脚本！
    pause
    exit /b 1
)

:: 检查Git是否安装
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Git，请先安装 Git
    echo 下载地址: https://git-scm.com/
    pause
    exit /b 1
)

echo [步骤1] 检查Git仓库状态...
if exist ".git" (
    echo [提示] Git仓库已存在
) else (
    echo [提示] 初始化Git仓库...
    git init
    if %errorlevel% neq 0 (
        echo [错误] Git初始化失败
        pause
        exit /b 1
    )
)

echo.
echo [步骤2] 添加文件到Git...
git add .
if %errorlevel% neq 0 (
    echo [错误] 添加文件失败
    pause
    exit /b 1
)

echo.
echo [步骤3] 提交更改...
git commit -m "Initial commit: ProReport GenAI with backend separation" 2>&1
if %errorlevel% neq 0 (
    echo [提示] 可能没有更改或已提交
)

echo.
echo [步骤4] 检查远程仓库...
git remote -v >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo   需要添加GitHub远程仓库
    echo ========================================
    echo.
    echo 请先在GitHub创建仓库：
    echo 1. 访问 https://github.com
    echo 2. 点击右上角 "+" → "New repository"
    echo 3. 仓库名: proreport-genai
    echo 4. 创建后复制仓库URL
    echo.
    set /p REPO_URL="请输入GitHub仓库URL: "
    if not "%REPO_URL%"=="" (
        echo.
        echo [步骤5] 添加远程仓库...
        git remote add origin "%REPO_URL%"
        git branch -M main
        
        echo.
        echo [步骤6] 推送到GitHub...
        echo 如果提示需要认证，请按照GitHub的提示操作
        git push -u origin main
        
        if %errorlevel% equ 0 (
            echo.
            echo ========================================
            echo   代码已推送到GitHub！
            echo ========================================
            echo.
            echo 下一步：
            echo 1. 按照"部署操作步骤.md"完成Vercel和Railway部署
            echo 2. 或访问 https://vercel.com 开始部署
            echo.
        ) else (
            echo.
            echo [错误] 推送失败，请检查：
            echo 1. GitHub仓库URL是否正确
            echo 2. 是否已登录GitHub
            echo 3. 是否有推送权限
            echo.
        )
    ) else (
        echo.
        echo [提示] 已跳过添加远程仓库
        echo 稍后可以手动运行：
        echo   git remote add origin YOUR_REPO_URL
        echo   git branch -M main
        echo   git push -u origin main
    )
) else (
    echo [提示] 远程仓库已配置
    git remote -v
    echo.
    echo 要推送到GitHub，运行：
    echo   git push -u origin main
)

echo.
pause

