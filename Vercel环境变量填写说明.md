# 📝 Vercel环境变量填写说明（详细版）

## 📋 当前页面字段说明

你现在在Vercel的"Environment Variables"页面，需要填写以下字段：

---

## 🔑 字段1：Key（键）

### 当前显示
- **Key**: `MONGODB_URI`（已预填）

### 说明
- ✅ **保持默认**：`MONGODB_URI`
- 这是环境变量的名称，代码中会使用这个名称来读取值
- **不要修改**，保持 `MONGODB_URI` 即可

---

## 💾 字段2：Value（值）

### 需要填写
- **Value**: 粘贴你的MongoDB连接字符串

### 填写步骤

1. **打开你之前保存的MongoDB连接字符串**
   - 应该类似这样：
   ```
   mongodb+srv://proreport_user:你的密码@cluster0.xxxxx.mongodb.net/proreport_genai?retryWrites=true&w=majority
   ```

2. **复制完整的连接字符串**

3. **粘贴到 "Value" 输入框**
   - 点击 "Value" 输入框
   - 按 `Ctrl + V` 粘贴

### 重要提示

✅ **确保连接字符串包含**：
- 用户名（已替换 `<username>`）
- 密码（已替换 `<password>`）
- 数据库名称 `/proreport_genai`

✅ **格式示例**：
```
mongodb+srv://proreport_user:MyPassword123@cluster0.xxxxx.mongodb.net/proreport_genai?retryWrites=true&w=majority
```

⚠️ **如果密码包含特殊字符**，需要URL编码：
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`

---

## 🌍 字段3：Environments（环境）

### 当前显示
- **Environments**: `Production, Preview, and Development`（已选择）

### 说明
- ✅ **保持默认选择**：全选（Production, Preview, Development）
- 这样所有环境（生产、预览、开发）都能使用这个环境变量
- **不需要修改**

---

## 📝 字段4：Note（备注）- 可选

### 说明
- **可选填写**：描述这个环境变量的用途
- 可以留空，也可以填写说明

### 示例内容
```
MongoDB Atlas连接字符串，用于存储用户和项目数据
```

或：
```
MongoDB connection string for storing user and project data
```

---

## 🔗 字段5：Link To Projects（链接到项目）- 可选

### 说明
- **可选配置**：指定哪些项目可以使用这个环境变量
- 如果留空，所有项目都可以使用
- **建议留空**（让所有项目都能使用）

### 如果需要指定项目
1. 点击 "Search for a Project to link to..."
2. 搜索并选择你的项目：`proreport-genai`
3. 可以添加多个项目

---

## 💾 字段6：Sensitive（敏感）- 可选

### 当前状态
- **Sensitive**: `Disabled`（已禁用，灰色）

### 说明
- **建议保持禁用**（当前状态）
- 如果启用，创建后无法查看值（更安全，但不方便调试）
- **保持默认即可**

---

## ✅ 填写完成后的操作

### 步骤1：检查填写内容

确认：
- ✅ Key: `MONGODB_URI`
- ✅ Value: 你的完整MongoDB连接字符串
- ✅ Environments: Production, Preview, Development（全选）
- ✅ Note: 可选填写
- ✅ Link To Projects: 可选留空

### 步骤2：保存

1. **点击页面右侧的黑色 "Save" 按钮**
2. **等待保存完成**（几秒钟）

### 步骤3：添加其他环境变量

保存后，继续添加其他环境变量：

#### 添加 GEMINI_API_KEY

1. **点击 "Add Another" 按钮**（页面上的加号按钮）

2. **填写**：
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `AIzaSyD7L7GzfFwFu0BVA5N0EEOKCIe20mlAeK8`
   - **Environments**: 全选
   - **Note**: `Gemini API密钥，用于AI内容生成`
   - **Link To Projects**: 留空

3. **点击 "Save"**

#### 添加 JWT_SECRET

1. **点击 "Add Another"**

2. **填写**：
   - **Key**: `JWT_SECRET`
   - **Value**: 生成随机字符串（至少32字符）
     - 示例：`proreport-secret-key-2024-12-30-random-string-change-this`
     - 或使用在线工具生成：https://www.random.org/strings/
   - **Environments**: 全选
   - **Note**: `JWT密钥，用于用户认证token生成`
   - **Link To Projects**: 留空

3. **点击 "Save"**

#### 添加 FRONTEND_URL（可选）

1. **点击 "Add Another"**

2. **填写**：
   - **Key**: `FRONTEND_URL`
   - **Value**: `*`
   - **Environments**: 全选
   - **Note**: `前端URL，*表示允许所有来源`
   - **Link To Projects**: 留空

3. **点击 "Save"**

#### 添加 NODE_ENV（可选）

1. **点击 "Add Another"**

2. **填写**：
   - **Key**: `NODE_ENV`
   - **Value**: `production`
   - **Environments**: 全选
   - **Note**: `Node.js环境变量，设置为production`
   - **Link To Projects**: 留空

3. **点击 "Save"**

---

## 📋 完整填写清单

配置完成后，你应该有5个环境变量：

| Key | Value | Environments | Note |
|-----|-------|--------------|------|
| `MONGODB_URI` | `mongodb+srv://...` | 全选 | MongoDB连接字符串 |
| `GEMINI_API_KEY` | `AIzaSy...` | 全选 | Gemini API密钥 |
| `JWT_SECRET` | `随机字符串` | 全选 | JWT密钥 |
| `FRONTEND_URL` | `*` | 全选 | 前端URL |
| `NODE_ENV` | `production` | 全选 | Node.js环境 |

---

## 🎯 快速填写指南

### 第一个环境变量（MONGODB_URI）

1. **Key**: 保持 `MONGODB_URI`（已填好）
2. **Value**: 粘贴你的MongoDB连接字符串
3. **Environments**: 保持全选（已选好）
4. **Note**: 可选，填写 `MongoDB连接字符串`
5. **Link To Projects**: 留空
6. **点击 "Save"**

### 后续环境变量

1. **点击 "Add Another"**
2. **重复上述步骤**，填写其他环境变量
3. **每次填写完都点击 "Save"**

---

## ⚠️ 常见错误

### 错误1：Value留空

**问题**：忘记填写Value
**解决**：确保Value字段有内容

### 错误2：连接字符串格式错误

**问题**：连接字符串不完整或格式错误
**解决**：
- 检查是否包含用户名和密码
- 检查是否包含数据库名称
- 检查特殊字符是否进行了URL编码

### 错误3：忘记保存

**问题**：填写完没有点击Save
**解决**：每次填写完都要点击 "Save" 按钮

---

## ✅ 完成后的验证

1. **检查环境变量列表**
   - 应该看到所有添加的环境变量
   - 确认Key和Value都正确

2. **重新部署项目**
   - 在Vercel控制台
   - Deployments → 最新部署 → "..." → "Redeploy"

3. **查看部署日志**
   - 应该看到：`📦 使用MongoDB存储`

---

## 🎉 完成！

配置完成后，你的应用就可以使用MongoDB存储数据了！

