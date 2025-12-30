# ProReport GenAI 一键启动脚本 (PowerShell)
# 编码: UTF-8

$ErrorActionPreference = "Stop"

# 设置控制台编码
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# 设置窗口标题
$Host.UI.RawUI.WindowTitle = "ProReport GenAI - 启动中..."

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ProReport GenAI 启动工具" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否在正确的目录
if (-not (Test-Path "package.json")) {
    Write-Host "[错误] 请在项目根目录运行此脚本！" -ForegroundColor Red
    Write-Host "当前目录: $PWD" -ForegroundColor Yellow
    Read-Host "按回车键退出"
    exit 1
}

# 检查Node.js是否安装
try {
    $nodeVersion = node --version
    Write-Host "[✓] Node.js 已安装: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[错误] 未检测到 Node.js，请先安装 Node.js" -ForegroundColor Red
    Write-Host "下载地址: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "按回车键退出"
    exit 1
}

# 检查npm是否安装
try {
    $npmVersion = npm --version
    Write-Host "[✓] npm 已安装: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "[错误] 未检测到 npm" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

Write-Host ""
Write-Host "[1/3] 检查依赖..." -ForegroundColor Yellow

# 检查并安装前端依赖
if (-not (Test-Path "node_modules")) {
    Write-Host "[提示] 检测到未安装依赖，正在安装前端依赖..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[错误] 前端依赖安装失败" -ForegroundColor Red
        Read-Host "按回车键退出"
        exit 1
    }
    Write-Host "[✓] 前端依赖安装完成" -ForegroundColor Green
} else {
    Write-Host "[✓] 前端依赖已安装" -ForegroundColor Green
}

# 检查并安装后端依赖
if (-not (Test-Path "server\node_modules")) {
    Write-Host "[提示] 检测到未安装后端依赖，正在安装后端依赖..." -ForegroundColor Yellow
    Set-Location server
    npm install
    Set-Location ..
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[错误] 后端依赖安装失败" -ForegroundColor Red
        Read-Host "按回车键退出"
        exit 1
    }
    Write-Host "[✓] 后端依赖安装完成" -ForegroundColor Green
} else {
    Write-Host "[✓] 后端依赖已安装" -ForegroundColor Green
}

Write-Host ""
Write-Host "[2/3] 检查环境配置..." -ForegroundColor Yellow

# 检查并创建.env文件
if (-not (Test-Path "server\.env")) {
    Write-Host "[警告] 未找到 server\.env 文件" -ForegroundColor Yellow
    Write-Host "[提示] 正在创建默认配置文件..." -ForegroundColor Yellow
    
    $envContent = @"
PORT=3001
GEMINI_API_KEY=请替换为你的API密钥
JWT_SECRET=proreport-secret-key-change-this-in-production
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
DATA_PATH=./data
"@
    
    $envContent | Out-File -FilePath "server\.env" -Encoding UTF8
    Write-Host "[✓] 已创建 server\.env，请编辑并填入正确的配置" -ForegroundColor Green
    Write-Host "[提示] 3秒后继续启动..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
} else {
    Write-Host "[✓] 环境配置文件已存在" -ForegroundColor Green
}

Write-Host ""
Write-Host "[3/3] 检查启动依赖..." -ForegroundColor Yellow

# 检查concurrently是否安装
$concurrentlyInstalled = npm list concurrently 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[提示] 正在安装 concurrently..." -ForegroundColor Yellow
    npm install concurrently --save-dev
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[错误] concurrently 安装失败" -ForegroundColor Red
        Read-Host "按回车键退出"
        exit 1
    }
    Write-Host "[✓] concurrently 安装完成" -ForegroundColor Green
} else {
    Write-Host "[✓] 启动依赖已就绪" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  服务启动中，请稍候..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "前端地址: " -NoNewline
Write-Host "http://localhost:3000" -ForegroundColor Cyan
Write-Host "后端地址: " -NoNewline
Write-Host "http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "启动成功后，请在浏览器中访问: " -NoNewline
Write-Host "http://localhost:3000" -ForegroundColor Green -BackgroundColor DarkBlue
Write-Host ""
Write-Host "按 Ctrl+C 可停止服务" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 启动服务
try {
    npm run dev
} catch {
    Write-Host ""
    Write-Host "[错误] 服务启动失败: $_" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

