@echo off
chcp 65001 >nul
title 使用Token推送到GitHub
color 0B

echo.
echo ========================================
echo   使用Personal Access Token推送
echo ========================================
echo.

cd /d F:\ProReport-GenAI

echo [提示] GitHub已不再支持密码认证
echo 必须使用Personal Access Token
echo.
echo 如果还没有Token，请：
echo 1. 访问 https://github.com/settings/tokens
echo 2. 点击 "Generate new token" → "Generate new token (classic)"
echo 3. 勾选 "repo" 权限
echo 4. 生成并复制Token
echo.
pause

echo.
echo [步骤1] 检查远程仓库...
git remote -v

echo.
echo [步骤2] 推送到GitHub...
echo.
echo 提示输入用户名时，输入：a706990060-sys
echo 提示输入密码时，输入：你的Personal Access Token
echo.
pause

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
    echo 请检查：
    echo 1. Token是否正确
    echo 2. Token是否有repo权限
    echo 3. 网络连接是否正常
    echo.
    echo 或尝试使用GitHub Desktop推送
    echo.
)

pause

