@echo off
chcp 65001 >nul
title 修复并推送到GitHub
color 0E

echo.
echo ========================================
echo   修复GitHub推送问题
echo ========================================
echo.

cd /d F:\ProReport-GenAI

echo [步骤1] 检查远程仓库配置...
git remote -v
if %errorlevel% neq 0 (
    echo [提示] 远程仓库未配置
) else (
    echo [提示] 发现远程仓库配置
    echo.
    echo 是否要删除并重新配置？(Y/N)
    set /p RECONFIG="请输入: "
    if /i "%RECONFIG%"=="Y" (
        git remote remove origin
        echo [成功] 已删除旧的远程仓库配置
    )
)

echo.
echo ========================================
echo   配置GitHub远程仓库
echo ========================================
echo.
echo 请先在GitHub创建仓库：
echo 1. 访问 https://github.com
echo 2. 点击右上角 "+" → "New repository"
echo 3. 仓库名: proreport-genai
echo 4. 创建后复制仓库URL
echo.
set /p REPO_URL="请输入GitHub仓库URL: "

if "%REPO_URL%"=="" (
    echo [错误] 未输入仓库URL
    pause
    exit /b 1
)

echo.
echo [步骤2] 添加远程仓库...
git remote add origin "%REPO_URL%"
if %errorlevel% neq 0 (
    echo [错误] 添加远程仓库失败
    pause
    exit /b 1
)

echo [成功] 远程仓库已添加
git remote -v

echo.
echo [步骤3] 推送到GitHub...
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
    echo 1. 需要GitHub认证
    echo 2. 仓库URL不正确
    echo 3. 没有推送权限
    echo.
    echo 解决方法：
    echo 1. 使用GitHub Desktop推送
    echo 2. 或配置Personal Access Token
    echo 3. 或配置SSH密钥
    echo.
    echo 详细说明请查看：修复GitHub推送问题.md
    echo.
)

pause

