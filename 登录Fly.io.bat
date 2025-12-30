@echo off
chcp 65001 >nul
echo ========================================
echo 🔐 登录Fly.io
echo ========================================
echo.

REM 添加Fly CLI到PATH
set "PATH=%PATH%;C:\Users\lh\.fly\bin"

echo 正在打开浏览器进行登录...
echo.
flyctl auth login

echo.
echo ✅ 登录完成！
echo.
pause

