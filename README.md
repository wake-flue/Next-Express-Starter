# Next-Express-Starter

一个现代化的全栈开发模板，基于 Next.js 和 Express.js，提供完整的开发规范和最佳实践。

## 技术栈

### 前端
- React ^18.2.0
- React DOM ^18.2.0
- TypeScript ^5.0.0
- Vite ^4.4.0
- TailwindCSS ^3.3.0
- Shadcn/UI ^0.0.4
- Axios ^1.4.0

### 后端
- Node.js ^18.0.0
- Express ^4.18.0
- TypeScript ^5.0.0
- CORS ^2.8.5
- dotenv ^16.3.0
- Mongoose ^8.9.0
- Winston ^3.17.0
- Winston-MongoDB ^6.0.0
- Swagger-jsdoc ^6.2.8
- Swagger-ui-express ^5.0.1

## 快速开始

### 环境要求
- Windows 11（推荐）
- Node.js >= 18.0.0
- npm >= 8.0.0
- MongoDB >= 6.0

### 安装步骤

1. 克隆项目
```bash
git clone [项目地址]
cd Next-Express-Starter
```

2. 安装依赖

前端依赖：
```bash
cd web
npm install
```

后端依赖：
```bash
cd server
npm install
```

3. 环境配置
```bash
# 前端环境配置
cp web/.env.example web/.env.local

# 后端环境配置
cp server/.env.example server/.env
```

### 运行项目

1. 启动后端服务
```bash
cd server
npm run dev
# 服务将在 http://localhost:3001 运行
```

2. 启动前端服务
```bash
cd web
npm run dev
# 应用将在 http://localhost:3000 运行
```

## 项目结构

```
Next-Express-Starter/
├── client/                # 前端代码
│   └── web/              # Next.js 前端应用
│       ├── app/          # Pages
│       ├── components/   # Components
│       ├── lib/          # Libraries
│       │   ├── apis/     # API
│       │   ├── hooks/    # Hooks
│       │   └── utils/    # Utilities
│       ├── types/        # Types
│       └── public/       # Public assets
│
└── server/               # Express 后端服务
    ├── routes/           # 路由
    ├── models/           # Mongoose 模型
    ├── middleware/       # 中间件
    ├── config/           # 配置文件
    ├── logs/            # 日志文件
    └── utils/           # 工具函数
```

## 环境配置

### 前端环境变量 (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 后端环境变量 (.env)
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/your_database
LOG_LEVEL=info
ENABLE_SWAGGER=true
```

## 开发规范

### 命名规范
- 组件文件：使用 PascalCase（例：UserProfile.tsx）
- 工具文件：使用 camelCase（例：formatDate.ts）
- 变量命名：使用 camelCase
- 常量命名：使用 UPPER_SNAKE_CASE
- React 组件：使用 PascalCase

### 代码风格
- 使用 2 空格缩进
- 最大行长度：100 字符
- React：使用函数组件和 Hooks
- 后端：使用 async/await，RESTful API

### Git 提交规范
提交信息格式：`<type>(<scope>): <description>`

# type:
- feat: 新功能
- fix: Bug修复
- docs: 文档更新
- style: 代码格式(不影响代码运行的变动)
- refactor: 重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动
- perf: 性能优化

# scope:
- client: 前端相关
- server: 后端相关
- deps: 依赖更新
- config: 配置修改

## 功能特性

### API 文档
- 使用 Swagger UI 提供交互式 API 文档
- 访问地址：`http://localhost:3001/api-docs`
- 支持 API 测试和调试

### 日志系统
- 使用 Winston 进行日志管理
- 支持控制台和 MongoDB 双重输出
- 日志级别：error、warn、info、debug
- 自动记录 API 请求和响应

## 许可证

MIT
