# 俄罗斯方块游戏

一个简单但功能完整的俄罗斯方块游戏，包含前端和后端。

## 功能特性

### 前端
- 经典俄罗斯方块游戏玩法
- 7种不同的方块形状
- 分数、等级和消除行数统计
- 渐变背景和美观的界面设计
- 响应式键盘控制

### 后端
- RESTful API 接口
- 分数排行榜系统
- 玩家统计功能
- WebSocket 实时通信
- 在线玩家数量统计

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动服务器

```bash
# 生产模式
npm start

# 开发模式（自动重启）
npm run dev
```

### 3. 访问游戏

打开浏览器访问：
- 游戏页面：http://localhost:3000/tetris.html
- API健康检查：http://localhost:3000/api/health

## API 接口

### 获取排行榜
```http
GET /api/scores?limit=10
```

### 提交分数
```http
POST /api/scores
Content-Type: application/json

{
  "playerName": "玩家名",
  "score": 1000,
  "level": 5,
  "lines": 20
}
```

### 获取玩家统计
```http
GET /api/scores/player/:playerName
```

### 获取全局统计
```http
GET /api/stats
```

### 健康检查
```http
GET /api/health
```

## WebSocket 连接

连接到 `ws://localhost:3000` 可接收实时更新：

```javascript
const ws = new WebSocket('ws://localhost:3000');

// 发送游戏状态
ws.send(JSON.stringify({
  type: 'gameState',
  playerId: 'unique-id',
  score: 1000,
  level: 5,
  lines: 20
}));

// 游戏结束通知
ws.send(JSON.stringify({
  type: 'gameOver',
  playerName: '玩家名',
  score: 1000
}));
```

## 游戏操作

- **← →** : 左右移动
- **↑** : 旋转方块
- **↓** : 加速下落
- **空格** : 直接落地

## 技术栈

### 前端
- HTML5 Canvas
- 原生 JavaScript
- CSS3

### 后端
- Node.js
- Express.js
- WebSocket (ws)
- CORS

## 项目结构

```
.
├── tetris.html       # 前端游戏页面
├── server.js         # 后端服务器
├── package.json      # 项目配置
└── README.md         # 项目文档
```

## 开发计划

- [ ] 添加用户认证系统
- [ ] 实现多人对战模式
- [ ] 添加数据库支持（MongoDB/PostgreSQL）
- [ ] 实现游戏回放功能
- [ ] 添加成就系统
- [ ] 优化移动端体验

## 许可证

ISC
