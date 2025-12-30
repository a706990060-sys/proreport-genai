@echo off
chcp 65001 >nul
title ProReport GenAI - 停止服务
color 0C

echo.
echo ========================================
echo   正在停止 ProReport GenAI 服务...
echo ========================================
echo.

:: 查找并结束Node.js进程（前端和后端）
echo [1/2] 查找运行中的服务进程...

:: 结束前端进程（Vite，端口3000）
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo 发现前端进程 (PID: %%a)，正在结束...
    taskkill /F /PID %%a >nul 2>&1
)

:: 结束后端进程（Express，端口3001）
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001 ^| findstr LISTENING') do (
    echo 发现后端进程 (PID: %%a)，正在结束...
    taskkill /F /PID %%a >nul 2>&1
)

:: 结束所有node进程（更彻底的方式）
echo [2/2] 清理所有相关进程...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo [完成] 服务已停止
echo.
pause

