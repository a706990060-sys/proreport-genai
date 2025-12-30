@echo off
chcp 65001 >nul
title 推送到GitHub
color 0A

echo.
echo ========================================
echo   推送到GitHub
echo ========================================
echo.

cd /d F:\ProReport-GenAI

:: 检查远程仓库
git remote -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [提示] 远程仓库未配置
    echo.
    echo 请先添加GitHub远程仓库：
    echo 1. 在GitHub创建仓库
    echo 2. 复制仓库URL
    echo 3. 运行：git remote add origin YOUR_REPO_URL
    echo.
    set /p REPO_URL="请输入GitHub仓库URL: "
    if not "%REPO_URL%"=="" (
        git remote add origin "%REPO_URL%"
        echo [成功] 远程仓库已添加
    ) else (
        echo [取消] 未添加远程仓库
        pause
        exit /b 1
    )
)

echo [步骤1] 检查当前状态...
git status --short

echo.
echo [步骤2] 推送到GitHub...
echo 如果提示需要认证，请按照提示操作
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   代码已成功推送到GitHub！
    echo ========================================
    echo.
    echo 下一步：
    echo 1. 访问 https://vercel.com 部署前端
    echo 2. 访问 https://railway.app 部署后端
    echo 3. 按照"部署操作步骤.md"完成部署
    echo.
) else (
    echo.
    echo [错误] 推送失败
    echo.
    echo 可能的原因：
    echo 1. 需要GitHub认证（使用Personal Access Token）
    echo 2. 远程仓库URL不正确
    echo 3. 没有推送权限
    echo.
    echo 解决方法：
    echo 1. 使用GitHub Desktop推送
    echo 2. 或配置SSH密钥
    echo 3. 或使用Personal Access Token
    echo.
)

pause

