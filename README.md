# 俄罗斯方块游戏（前后端一体）

一个轻量但功能完整的俄罗斯方块项目：前端用 Canvas 实现经典玩法与现代化页面风格，后端提供排行榜 API 与 WebSocket 实时事件。启动服务后访问 `tetris.html` 即可开始游戏。

## 亮点

- 经典俄罗斯方块玩法，7 种方块形状
- 分数 / 等级 / 消行统计，等级提升加快下落速度
- 幽灵方块预览落点、消行动效粒子
- 现代暗色 UI（玻璃质感、网格背景、留白排版）
- REST API + WebSocket 实时事件
- 在线人数与玩家统计

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
- API 健康检查：http://localhost:3000/api/health

### 4. 修改端口

```bash
PORT=3001 npm start
```

## 游戏操作

- **← →**：左右移动
- **↑**：旋转方块
- **↓**：加速下落（软降）
- **空格**：直接落地（硬降）

## 计分与速度规则

- 软降（↓）：每下落一格 +1 分
- 硬降（空格）：每下落一格 +2 分
- 消行得分：`linesCleared * 100 * level`
- 等级计算：`level = floor(lines / 10) + 1`
- 下落间隔：`max(100, 1000 - (level - 1) * 100)` 毫秒

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

## API 接口

### 数据结构（Score）

```json
{
  "id": 1700000000000,
  "playerName": "玩家名",
  "score": 1000,
  "level": 5,
  "lines": 20,
  "timestamp": "2026-02-03T09:01:38.000Z"
}
```

### 获取排行榜

```http
GET /api/scores?limit=10
```

返回：按分数降序的 Score 数组。

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

返回：新增的 Score 记录。

### 获取玩家统计

```http
GET /api/scores/player/:playerName
```

返回示例：

```json
{
  "playerName": "玩家名",
  "highScore": 1200,
  "gamesPlayed": 3,
  "bestGame": { }
}
```

### 获取全局统计

```http
GET /api/stats
```

返回示例：

```json
{
  "totalGames": 12,
  "totalScore": 8400,
  "avgScore": 700,
  "highestScore": 1500,
  "activePlayers": 2
}
```

### 健康检查

```http
GET /api/health
```

## WebSocket 连接

连接地址：`ws://localhost:3000`

### 客户端 -> 服务端

- `gameState`
```json
{
  "type": "gameState",
  "playerId": "unique-id",
  "score": 1000,
  "level": 5,
  "lines": 20
}
```

- `gameOver`
```json
{
  "type": "gameOver",
  "playerName": "玩家名",
  "score": 1000
}
```

- `getOnlinePlayers`
```json
{
  "type": "getOnlinePlayers"
}
```

### 服务端 -> 客户端

- `connected`
```json
{
  "type": "connected",
  "message": "Connected to Tetris server",
  "timestamp": "2026-02-03T09:01:38.000Z"
}
```

- `playerGameOver`
```json
{
  "type": "playerGameOver",
  "playerName": "玩家名",
  "score": 1000
}
```

- `onlinePlayers`
```json
{
  "type": "onlinePlayers",
  "count": 2
}
```

## 前端开发说明

- 所有前端代码都在 `tetris.html`（HTML / CSS / JS 同文件）
- 视觉样式主要在 `<style>` 中，游戏逻辑在页面底部 `<script>` 中
- 后端已提供排行榜与在线人数 API，可在前端自行接入展示

## 数据与限制

- 分数与游戏状态仅保存在内存中，服务重启后会清空
- 排行榜最多保留 100 条记录
- 玩家名长度限制 20 字符
- 未包含鉴权与反作弊逻辑

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
