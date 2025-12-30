# 🔗 获取MongoDB连接字符串详细步骤

## 📍 当前步骤：选择连接方式

你现在在 "Connect to Cluster0" 页面，需要选择正确的连接方式。

---

## ✅ 正确选择：Connect to your application

### 步骤1：选择 "Drivers" 选项

在模态窗口中，找到 **"Connect to your application"** 部分：

1. **找到 "Drivers" 选项**
   - 图标：显示 "1011"（二进制代码图标）
   - 描述：`Access your Atlas data using MongoDB's native drivers (e.g. Node.js, Go, etc.)`
   - 右侧有箭头图标 →

2. **点击 "Drivers" 选项**
   - 点击整个卡片区域或右侧箭头

### 步骤2：选择驱动和版本

点击后会进入下一个页面，需要选择：

1. **Driver（驱动）**：
   - 选择 **"Node.js"**

2. **Version（版本）**：
   - 选择 **"5.5 or later"** 或最新版本
   - 或选择 **"6.0 or later"**（推荐）

3. **点击 "Next" 或 "Continue"**

### 步骤3：复制连接字符串

在下一个页面，你会看到：

1. **连接字符串**：
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

2. **复制按钮**：
   - 点击连接字符串右侧的 **"Copy"** 按钮
   - 或手动选中整个字符串，按 `Ctrl + C` 复制

3. **重要**：这个连接字符串包含占位符 `<username>` 和 `<password>`
   - 需要替换为实际的用户名和密码

---

## 🔧 步骤4：替换用户名和密码

### 4.1 准备信息

你需要：
- **用户名**：你创建的数据库用户名（例如：`proreport_user`）
- **密码**：你创建的数据库密码

### 4.2 替换占位符

**原始连接字符串**：
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**替换后**（示例）：
```
mongodb+srv://proreport_user:MyPassword123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 4.3 处理特殊字符

如果密码包含特殊字符，需要进行URL编码：

| 字符 | URL编码 |
|------|---------|
| `@` | `%40` |
| `#` | `%23` |
| `$` | `%24` |
| `%` | `%25` |
| `&` | `%26` |
| `+` | `%2B` |
| `=` | `%3D` |
| `?` | `%3F` |
| `/` | `%2F` |
| ` ` (空格) | `%20` |

**示例**：
- 如果密码是：`My@Pass#123`
- 编码后：`My%40Pass%23123`
- 完整连接字符串：
  ```
  mongodb+srv://proreport_user:My%40Pass%23123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
  ```

### 4.4 添加数据库名称（可选但推荐）

在连接字符串中添加数据库名称：

**格式**：
```
mongodb+srv://用户名:密码@集群地址.mongodb.net/数据库名?retryWrites=true&w=majority
```

**示例**：
```
mongodb+srv://proreport_user:MyPassword123@cluster0.xxxxx.mongodb.net/proreport_genai?retryWrites=true&w=majority
```

**数据库名称**：`proreport_genai`

---

## 📋 完整连接字符串格式

### 标准格式：

```
mongodb+srv://[username]:[password]@[cluster-address]/[database-name]?[options]
```

### 各部分说明：

- `mongodb+srv://` - 协议（SRV连接）
- `[username]` - 数据库用户名
- `[password]` - 数据库密码（URL编码）
- `[cluster-address]` - 集群地址（例如：`cluster0.xxxxx.mongodb.net`）
- `[database-name]` - 数据库名称（例如：`proreport_genai`）
- `[options]` - 连接选项（例如：`retryWrites=true&w=majority`）

---

## ✅ 最终连接字符串示例

### 示例1：简单密码

```
mongodb+srv://proreport_user:MyPassword123@cluster0.xxxxx.mongodb.net/proreport_genai?retryWrites=true&w=majority
```

### 示例2：包含特殊字符的密码

如果密码是：`P@ssw0rd#2024`

编码后：
```
mongodb+srv://proreport_user:P%40ssw0rd%232024@cluster0.xxxxx.mongodb.net/proreport_genai?retryWrites=true&w=majority
```

---

## 🎯 快速操作步骤总结

1. ✅ 在 "Connect to Cluster0" 页面
2. ✅ 点击 **"Connect to your application"** → **"Drivers"**
3. ✅ 选择 **"Node.js"** 驱动
4. ✅ 选择版本 **"5.5 or later"** 或 **"6.0 or later"**
5. ✅ 点击 **"Next"** 或 **"Continue"**
6. ✅ 复制连接字符串
7. ✅ 替换 `<username>` 为你的用户名
8. ✅ 替换 `<password>` 为你的密码（特殊字符需URL编码）
9. ✅ 添加数据库名称 `/proreport_genai`（可选但推荐）
10. ✅ 保存完整的连接字符串

---

## ⚠️ 重要提示

### 不要选择其他选项

- ❌ **不要选择** "Compass"（桌面工具）
- ❌ **不要选择** "Shell"（命令行工具）
- ❌ **不要选择** "MongoDB for VS Code"（VS Code扩展）
- ❌ **不要选择** "Atlas SQL"（SQL工具）

这些选项是用于其他工具的，不是我们需要的连接字符串。

### 必须选择

- ✅ **必须选择** "Connect to your application" → "Drivers" → "Node.js"

---

## 🔍 如果找不到 "Drivers" 选项

### 可能的情况：

1. **页面加载不完整**
   - 刷新页面（F5）
   - 重新点击 "Connect" 按钮

2. **界面版本不同**
   - 查找 "Connect your application" 或 "Application" 相关选项
   - 查找 "Node.js" 或 "Driver" 相关选项

3. **需要先完成其他步骤**
   - 确认已创建数据库用户
   - 确认已配置网络访问（或稍后配置）

---

## 📝 下一步：配置Vercel环境变量

获取连接字符串后：

1. **访问Vercel**：https://vercel.com/dashboard
2. **选择项目** → **Settings** → **Environment Variables**
3. **添加环境变量**：
   - **Key**: `MONGODB_URI`
   - **Value**: 粘贴你刚才准备的完整连接字符串
   - **Environment**: 全选（Production, Preview, Development）
4. **点击 "Save"**

---

## 🆘 遇到问题？

### 问题1：连接字符串格式错误

**检查**：
- 用户名和密码是否正确
- 特殊字符是否进行了URL编码
- 数据库名称是否正确

### 问题2：无法复制连接字符串

**解决方案**：
- 手动选中整个字符串
- 按 `Ctrl + C` 复制
- 或右键点击 → "复制"

### 问题3：不知道用户名和密码

**解决方案**：
- 返回MongoDB Atlas
- 查看数据库用户设置
- 或重新创建数据库用户

---

## 🎉 完成！

获取连接字符串后，你就可以在Vercel中配置 `MONGODB_URI` 环境变量了！

---

## 💡 提示

- **保存连接字符串**：复制到安全的地方（如文本文件）
- **不要分享**：连接字符串包含密码，不要分享给他人
- **定期更换密码**：建议定期更换数据库密码

