@echo off
chcp 65001 >nul
title 准备GitHub部署
color 0B

echo.
echo ========================================
echo   准备推送到GitHub
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

echo [1/4] 检查Git仓库状态...
if exist ".git" (
    echo [提示] Git仓库已存在
    git status
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
echo [2/4] 添加文件到Git...
git add .
if %errorlevel% neq 0 (
    echo [错误] 添加文件失败
    pause
    exit /b 1
)

echo.
echo [3/4] 提交更改...
git commit -m "Initial commit: ProReport GenAI with backend separation"
if %errorlevel% neq 0 (
    echo [警告] 提交失败，可能没有更改或已提交
)

echo.
echo [4/4] 检查远程仓库...
git remote -v >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo   需要添加GitHub远程仓库
    echo ========================================
    echo.
    echo 请先在GitHub创建仓库，然后：
    echo 1. 复制仓库URL（例如：https://github.com/username/proreport-genai.git）
    echo 2. 运行以下命令：
    echo    git remote add origin YOUR_REPO_URL
    echo    git branch -M main
    echo    git push -u origin main
    echo.
    set /p REPO_URL="请输入GitHub仓库URL（直接回车跳过）: "
    if not "!REPO_URL!"=="" (
        git remote add origin !REPO_URL!
        git branch -M main
        echo.
        echo 准备推送到GitHub...
        echo 如果提示需要认证，请按照GitHub的提示操作
        git push -u origin main
    )
) else (
    echo [提示] 远程仓库已配置
    git remote -v
    echo.
    echo 要推送到GitHub，运行：
    echo   git push -u origin main
)

echo.
echo ========================================
echo   准备完成！
echo ========================================
echo.
echo 下一步：
echo 1. 如果还没有GitHub仓库，先创建
echo 2. 添加远程仓库并推送代码
echo 3. 按照"部署操作步骤.md"完成部署
echo.
pause

