@echo off
chcp 65001 >nul
echo ========================================
echo 🔍 MongoDB配置检查工具
echo ========================================
echo.

echo 正在检查MongoDB配置...
echo.

REM 检查是否安装了Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 未检测到Node.js
    echo    请先安装Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js 已安装
node --version
echo.

REM 检查是否安装了mongodb包
cd /d "%~dp0"
if exist "node_modules\mongodb" (
    echo ✅ mongodb 包已安装
) else (
    echo ⚠️  mongodb 包未安装
    echo    正在安装...
    call npm install mongodb
    if %ERRORLEVEL% EQU 0 (
        echo ✅ mongodb 包安装成功
    ) else (
        echo ❌ mongodb 包安装失败
        pause
        exit /b 1
    )
)
echo.

REM 检查环境变量文件
if exist ".env" (
    echo ✅ 找到 .env 文件
    findstr /C:"MONGODB_URI" .env >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo ✅ MONGODB_URI 已配置
    ) else (
        echo ⚠️  MONGODB_URI 未在 .env 中配置
        echo    注意: 本地开发需要配置，Vercel部署需要在Vercel控制台配置
    )
) else (
    echo ⚠️  未找到 .env 文件
    echo    注意: 本地开发可以创建 .env 文件，Vercel部署需要在Vercel控制台配置
)
echo.

REM 检查代码文件
if exist "server\src\services\mongodbService.ts" (
    echo ✅ MongoDB服务文件存在
) else (
    echo ❌ MongoDB服务文件不存在
    pause
    exit /b 1
)

if exist "server\src\services\storageService.ts" (
    echo ✅ 存储服务文件存在
) else (
    echo ❌ 存储服务文件不存在
    pause
    exit /b 1
)
echo.

echo ========================================
echo 📋 配置检查清单
echo ========================================
echo.
echo 请确认以下配置：
echo.
echo [ ] MongoDB Atlas账号已注册
echo [ ] 免费集群已创建
echo [ ] 数据库用户已创建（用户名和密码已保存）
echo [ ] 网络访问已配置（允许 0.0.0.0/0）
echo [ ] 连接字符串已获取并替换了用户名和密码
echo [ ] Vercel环境变量已配置：
echo     [ ] MONGODB_URI
echo     [ ] GEMINI_API_KEY
echo     [ ] JWT_SECRET
echo     [ ] FRONTEND_URL
echo [ ] 代码已提交到GitHub
echo [ ] Vercel已重新部署
echo.
echo ========================================
echo.
pause

