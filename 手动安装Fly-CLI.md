# 📥 手动安装Fly CLI（Windows）

## 方法1：使用Scoop（推荐）

如果你已经安装了Scoop包管理器：

```powershell
scoop install flyctl
```

## 方法2：手动下载安装

### 步骤1：下载Fly CLI

1. 访问：https://github.com/superfly/flyctl/releases/latest
2. 找到 **Windows** 版本（通常是 `flyctl_x.x.x_windows_amd64.zip`）
3. 下载zip文件

### 步骤2：解压文件

1. 解压zip文件到任意目录，例如：`C:\flyctl`
2. 记住这个路径

### 步骤3：添加到系统PATH

1. 按 `Win + R`，输入 `sysdm.cpl`，回车
2. 点击 **"高级"** 标签
3. 点击 **"环境变量"**
4. 在 **"系统变量"** 中找到 `Path`，点击 **"编辑"**
5. 点击 **"新建"**，输入Fly CLI的路径（例如：`C:\flyctl`）
6. 点击 **"确定"** 保存所有窗口

### 步骤4：验证安装

打开新的PowerShell窗口，运行：

```bash
fly version
```

如果显示版本号，说明安装成功！

---

## 方法3：使用Chocolatey（如果已安装）

```powershell
choco install flyctl
```

---

## 方法4：使用winget（Windows 10/11）

```powershell
winget install --id=Superfly.Flyctl -e
```

---

## ✅ 安装完成后

运行以下命令验证：

```bash
fly version
```

如果成功，继续下一步：登录Fly.io

