# API 文档

## 目录
- [模型定义](#模型定义)
  - [Todo模型](#todo模型)
  - [Log模型](#log模型)
- [API端点](#api端点)
  - [Todo API](#todo-api)
  - [Log API](#log-api)

## 模型定义

### Todo模型

```typescript
interface Todo {
  _id: ObjectId;          // MongoDB ID，自动生成
  title: string;          // 标题，必填，2-100字符
  completed: boolean;     // 完成状态，默认false
  createdAt: Date;       // 创建时间，自动生成
  updatedAt: Date;       // 更新时间，自动生成
}
```

#### 字段验证规则
- title
  - 必填
  - 类型：字符串
  - 长度：2-100字符
  - 会自动去除首尾空格
- completed
  - 类型：布尔值
  - 默认值：false

### Log模型

```typescript
interface Log {
  timestamp: Date;        // 日志时间戳
  level: string;         // 日志级别
  message: string;       // 日志消息
  meta: {
    operation: string;   // 操作类型
    model: string;       // 相关模型
    source: string;      // 来源(frontend/backend)
    environment: string; // 环境(development/production)
    requestInfo?: {      // HTTP请求信息
      method: string;
      url: string;
      ip: string;
      headers: any;
      query: any;
    };
    responseInfo?: {     // HTTP响应信息
      status: number;
      message: string;
      duration: number;
    };
    error?: {           // 错误信息
      name: string;
      message: string;
      stack: string;
    };
    client?: {          // 客户端信息
      browser: string;
      os: string;
      device: string;
      url: string;
    };
    additionalData?: any; // 其他元数据
  };
}
```

## API端点

### Todo API

#### 获取待办事项列表
```http
GET /api/todos
```

查询参数：
- `page`: 页码，默认1
- `pageSize`: 每页数量，默认20
- `sortBy`: 排序字段(title/createdAt/completed)，默认createdAt
- `sortOrder`: 排序方向(asc/desc)，默认desc
- `completed`: 过滤完成状态(true/false)
- `title`: 按标题模糊搜索

响应示例：
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "_id": "...",
        "title": "示例待办",
        "completed": false,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "pageSize": 20,
      "totalPages": 5
    },
    "filters": {
      "completed": false,
      "title": "示例"
    },
    "sort": {
      "sortBy": "createdAt",
      "sortOrder": "desc"
    }
  }
}
```

#### 获取待办事项详情
```http
GET /api/todos/:id
```

路径参数：
- `id`: Todo ID

响应示例：
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "示例待办",
    "completed": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

错误响应：
- 400: 无效的ID格式
- 404: 资源不存在

#### 创建待办事项
```http
POST /api/todos
```

请求体：
```json
{
  "title": "新待办事项",
  "completed": false
}
```

#### 更新待办事项
```http
PUT /api/todos/:id
```

请求体：
```json
{
  "title": "更新的标题",
  "completed": true
}
```

#### 删除待办事项
```http
DELETE /api/todos/:id
```

### Log API

#### 获取日志列表
```http
GET /api/logs
```

查询参数：
- `page`: 页码，默认1
- `pageSize`: 每页数量，默认20
- `sortBy`: 排序字段(timestamp/level/message)，默认timestamp
- `sortOrder`: 排序方向(asc/desc)，默认desc
- `level`: 日志级别过滤
- `source`: 来源过滤(frontend/backend)
- `status`: HTTP状态码过滤
- `operation`: 操作类型过滤
- `errorType`: 错误类型过滤
- `startTime`: 开始时间
- `endTime`: 结束时间
- `search`: 搜索关键词(匹配message和operation)
- `environment`: 环境过滤(development/production)

响应示例：
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "timestamp": "2024-01-01T00:00:00.000Z",
        "level": "info",
        "message": "示例日志",
        "meta": {
          "operation": "GET_TODOS",
          "source": "backend",
          "environment": "development",
          "requestInfo": {
            "method": "GET",
            "url": "/api/todos"
          }
        }
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "pageSize": 20,
      "totalPages": 5
    },
    "filters": {
      "level": "info",
      "source": "backend"
    },
    "sort": {
      "sortBy": "timestamp",
      "sortOrder": "desc"
    }
  }
}
```

#### 获取日志详情
```http
GET /api/logs/:id
```

路径参数：
- `id`: Log ID

响应示例：
```json
{
  "success": true,
  "data": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "level": "info",
    "message": "示例日志",
    "meta": {
      "operation": "GET_TODOS",
      "source": "backend",
      "environment": "development",
      "requestInfo": {
        "method": "GET",
        "url": "/api/todos"
      },
      "responseInfo": {
        "status": 200,
        "message": "操作成功",
        "duration": 50
      }
    }
  }
}
```

错误响应：
- 400: 无效的ID格式
- 404: 资源不存在

#### 创建日志
```http
POST /api/logs
```

请求体：
```json
[
  {
    "level": "info",
    "message": "示例日志",
    "meta": {
      "operation": "CREATE_TODO",
      "source": "backend",
      "environment": "development"
    }
  }
]
```

## 通用响应格式

### 成功响应
```json
{
  "success": true,
  "data": any
}
```

### 错误响应
```json
{
  "success": false,
  "error": {
    "message": "错误信息",
    "details": "详细错误信息"
  }
}
```

## HTTP状态码

- 200: 成功
- 201: 创建成功
- 400: 请求参数错误
- 404: 资源不存在
- 500: 服务器内部错误 