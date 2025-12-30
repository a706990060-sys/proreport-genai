@echo off
chcp 65001 >nul
echo ========================================
echo 🔧 MongoDB Atlas 环境变量配置助手
echo ========================================
echo.

echo 这个脚本将帮助你配置Vercel环境变量
echo.
echo 请按照以下步骤操作：
echo.
echo 步骤1: 注册MongoDB Atlas
echo   - 访问: https://www.mongodb.com/cloud/atlas/register
echo   - 使用Google账号快速注册
echo.
echo 步骤2: 创建免费集群
echo   - 选择 M0 FREE 集群
echo   - 选择地区（推荐: ap-southeast-1 新加坡）
echo.
echo 步骤3: 创建数据库用户
echo   - 用户名: proreport_user
echo   - 密码: 生成强密码（保存好！）
echo.
echo 步骤4: 配置网络访问
echo   - 允许 0.0.0.0/0（所有IP）
echo.
echo 步骤5: 获取连接字符串
echo   - 点击 Connect → Connect your application
echo   - 复制连接字符串
echo   - 替换 <username> 和 <password>
echo.
pause

echo.
echo ========================================
echo 📝 环境变量配置清单
echo ========================================
echo.
echo 请在Vercel中添加以下环境变量：
echo.
echo 1. MONGODB_URI
echo    值: mongodb+srv://用户名:密码@集群地址.mongodb.net/proreport_genai?retryWrites=true^&w=majority
echo.
echo 2. GEMINI_API_KEY
echo    值: AIzaSyD7L7GzfFwFu0BVA5N0EEOKCIe20mlAeK8
echo.
echo 3. JWT_SECRET
echo    值: 随机字符串（至少32字符）
echo.
echo 4. FRONTEND_URL
echo    值: *
echo.
echo 5. NODE_ENV
echo    值: production
echo.
echo ========================================
echo.
echo 配置步骤：
echo 1. 访问: https://vercel.com/dashboard
echo 2. 选择你的项目
echo 3. Settings → Environment Variables
echo 4. 逐个添加上述环境变量
echo 5. 保存后重新部署
echo.
pause

echo.
echo ========================================
echo 🔍 生成JWT_SECRET（随机字符串）
echo ========================================
echo.
echo 正在生成随机JWT_SECRET...
echo.

REM 生成随机字符串
setlocal enabledelayedexpansion
set "chars=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
set "jwt_secret="
for /L %%i in (1,1,32) do (
    set /a "rand=!random! %% 62"
    set "char=!chars:~!rand!,1!"
    set "jwt_secret=!jwt_secret!!char!"
)

echo JWT_SECRET: %jwt_secret%
echo.
echo 请复制上面的JWT_SECRET，在Vercel中配置环境变量时使用
echo.
pause

echo.
echo ========================================
echo ✅ 配置完成后的操作
echo ========================================
echo.
echo 1. 提交代码到GitHub:
echo    git add .
echo    git commit -m "添加MongoDB支持"
echo    git push
echo.
echo 2. Vercel会自动部署
echo.
echo 3. 查看部署日志，确认看到: 📦 使用MongoDB存储
echo.
echo 4. 测试功能（注册、登录、创建项目）
echo.
pause

