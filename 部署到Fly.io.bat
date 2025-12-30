@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 部署后端到Fly.io
echo ========================================
echo.

REM 添加Fly CLI到PATH
set "PATH=%PATH%;C:\Users\lh\.fly\bin"

REM 切换到server目录
cd /d "%~dp0server"

echo 当前目录: %CD%
echo.

REM 检查是否已初始化
if not exist "fly.toml" (
    echo ⚠️  未找到fly.toml，需要先初始化...
    echo.
    echo 运行: flyctl launch
    echo.
    pause
    exit /b
)

echo 开始部署...
echo.
flyctl deploy

echo.
echo ✅ 部署完成！
echo.
pause

