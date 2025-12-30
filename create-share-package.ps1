# ProReport GenAI 分享包创建脚本
# 此脚本会创建一个干净的分享包，排除敏感信息和依赖

Write-Host "正在创建分享包..." -ForegroundColor Green

# 创建临时分享目录
$shareDir = "proreport-genai-share"
if (Test-Path $shareDir) {
    Remove-Item $shareDir -Recurse -Force
}
New-Item -ItemType Directory -Path $shareDir -Force | Out-Null

Write-Host "复制源代码文件..." -ForegroundColor Yellow

# 复制源代码文件
$filesToCopy = @(
    "App.tsx",
    "index.tsx",
    "index.html",
    "types.ts",
    "constants.ts",
    "package.json",
    "tsconfig.json",
    "vite.config.ts",
    "metadata.json",
    "README.md",
    "QUICKSTART.md",
    ".gitignore"
)

foreach ($file in $filesToCopy) {
    if (Test-Path $file) {
        Copy-Item $file -Destination $shareDir\ -Force
        Write-Host "  ✓ $file" -ForegroundColor Gray
    }
}

# 复制 services 目录
if (Test-Path "services") {
    Copy-Item "services" -Destination $shareDir\ -Recurse -Force
    Write-Host "  ✓ services/" -ForegroundColor Gray
}

# 复制示例文件
if (Test-Path ".env.local.example") {
    Copy-Item ".env.local.example" -Destination $shareDir\ -Force
    Write-Host "  ✓ .env.local.example" -ForegroundColor Gray
} else {
    # 创建示例文件
    @"
# Gemini API Key
# 从 https://aistudio.google.com/app/apikey 获取你的 API 密钥
GEMINI_API_KEY=your_gemini_api_key_here
"@ | Out-File -FilePath "$shareDir\.env.local.example" -Encoding utf8
    Write-Host "  ✓ .env.local.example (已创建)" -ForegroundColor Gray
}

# 复制分享指南
if (Test-Path "SHARING_GUIDE.md") {
    Copy-Item "SHARING_GUIDE.md" -Destination $shareDir\ -Force
    Write-Host "  ✓ SHARING_GUIDE.md" -ForegroundColor Gray
}

Write-Host "`n创建 ZIP 文件..." -ForegroundColor Yellow

# 创建 ZIP 文件
$zipFile = "proreport-genai-share.zip"
if (Test-Path $zipFile) {
    Remove-Item $zipFile -Force
}

Compress-Archive -Path "$shareDir\*" -DestinationPath $zipFile -Force

# 获取文件大小
$zipSize = (Get-Item $zipFile).Length / 1MB
Write-Host "  ✓ ZIP 文件已创建: $zipFile ($([math]::Round($zipSize, 2)) MB)" -ForegroundColor Green

# 清理临时目录
Remove-Item $shareDir -Recurse -Force

Write-Host "`n✅ 分享包创建完成！" -ForegroundColor Green
Write-Host "`n分享文件: $zipFile" -ForegroundColor Cyan
Write-Host "`n提醒：请确认 ZIP 文件中不包含以下内容：" -ForegroundColor Yellow
Write-Host "  - .env.local (包含你的 API key)" -ForegroundColor Red
Write-Host "  - node_modules/ (依赖文件夹)" -ForegroundColor Red
Write-Host "  - dist/ (构建输出)" -ForegroundColor Red

