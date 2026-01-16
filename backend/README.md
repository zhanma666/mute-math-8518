# 考研复试演讲训练系统 - 后端服务

## 项目介绍
这是一个基于Node.js + Express + TypeScript + MySQL的后端服务，为考研复试演讲训练系统提供API支持。

## 技术栈
- **Node.js**: JavaScript运行时
- **Express**: Web框架
- **TypeScript**: 类型安全的JavaScript超集
- **MySQL**: 关系型数据库
- **MySQL2**: MySQL驱动
- **CORS**: 跨域资源共享
- **Helmet**: 安全中间件
- **Dotenv**: 环境变量管理
- **TSX**: TypeScript执行和观察工具

## 项目结构
```
backend/
├── src/
│   ├── models/          # 数据模型
│   │   ├── Professional.ts  # 专业模型
│   │   └── Topic.ts         # 演讲题目模型
│   ├── routes/          # 路由处理
│   │   ├── professionalRoutes.ts  # 专业相关路由
│   │   └── topicRoutes.ts         # 演讲题目相关路由
│   ├── utils/           # 工具函数
│   │   └── db.ts              # 数据库连接和初始化
│   └── server.ts        # 主服务器文件
├── config/              # 配置文件
├── .env                 # 环境变量
├── package.json         # 项目依赖
├── tsconfig.json        # TypeScript配置
└── README.md            # 项目说明
```

## 功能特性

### 专业管理
- 获取所有专业列表
- 根据ID获取专业详情
- 创建新专业
- 更新专业信息
- 删除专业

### 演讲题目管理
- 获取所有演讲题目
- 根据专业ID获取题目列表
- 随机获取一个演讲题目
- 创建新演讲题目
- 更新演讲题目
- 删除演讲题目
- 统计特定专业的题目数量

## 环境要求
- Node.js 18.x或更高版本
- MySQL 8.0或更高版本

## 安装和运行

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
编辑`.env`文件，配置数据库连接信息：
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=speech_training

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### 3. 运行开发服务器
```bash
npm run dev
```

### 4. 构建生产版本
```bash
npm run build
```

### 5. 运行生产版本
```bash
npm start
```

## API端点

### 健康检查
- `GET /api/health` - 检查服务器状态

### 专业相关
- `GET /api/professionals` - 获取所有专业
- `GET /api/professionals/:id` - 获取指定专业
- `POST /api/professionals` - 创建新专业
- `PUT /api/professionals/:id` - 更新专业信息
- `DELETE /api/professionals/:id` - 删除专业

### 演讲题目相关
- `GET /api/topics` - 获取所有演讲题目
- `GET /api/topics/professional/:professionalId` - 获取指定专业的演讲题目
- `GET /api/topics/random/:professionalId` - 随机获取一个演讲题目
- `GET /api/topics/count/:professionalId` - 统计指定专业的题目数量
- `POST /api/topics` - 创建新演讲题目
- `PUT /api/topics/:id` - 更新演讲题目
- `DELETE /api/topics/:id` - 删除演讲题目

## 数据库初始化

服务器启动时会自动执行数据库初始化脚本，包括：
1. 创建专业表(`professionals`)
2. 创建演讲题目表(`topics`)
3. 插入默认专业数据（计算机、医学、经济学、教育学、文学）
4. 为每个专业插入10个默认演讲题目

## 示例请求和响应

### 获取所有专业
```bash
GET /api/professionals
```

响应：
```json
{
  "success": true,
  "data": [
    {
      "id": "computer",
      "name": "计算机科学与技术",
      "description": "计算机科学与技术专业复试演讲题目",
      "createdAt": "2026-01-16T06:00:00.000Z",
      "updatedAt": "2026-01-16T06:00:00.000Z"
    },
    // 更多专业...
  ]
}
```

### 随机获取一个演讲题目
```bash
GET /api/topics/random/computer
```

响应：
```json
{
  "success": true,
  "data": {
    "id": 1,
    "content": "请谈谈你对人工智能发展的看法",
    "professional": "computer",
    "createdAt": "2026-01-16T06:00:00.000Z",
    "updatedAt": "2026-01-16T06:00:00.000Z"
  }
}
```

## 开发说明

### 代码风格
- 使用TypeScript进行类型安全开发
- 遵循ESLint和Prettier的代码规范

### 数据库设计
- 采用关系型数据库设计
- 专业和演讲题目之间是一对多关系
- 外键约束确保数据完整性

### 错误处理
- 统一的错误响应格式
- 详细的错误信息
- 适当的HTTP状态码

## 部署建议

### 开发环境
- 使用`npm run dev`命令运行开发服务器
- 支持热重载

### 生产环境
1. 构建生产版本：`npm run build`
2. 设置环境变量：配置生产环境的数据库和服务器信息
3. 运行生产服务器：`npm start`
4. 建议使用PM2进行进程管理

## 许可证

MIT
