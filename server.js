const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// 内存存储（生产环境应该使用数据库）
let scores = [];
let gameStates = {};

// API 路由

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Tetris server is running' });
});

// 获取排行榜
app.get('/api/scores', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const topScores = scores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  res.json(topScores);
});

// 提交分数
app.post('/api/scores', (req, res) => {
  const { playerName, score, level, lines } = req.body;

  if (!playerName || score === undefined) {
    return res.status(400).json({ error: ' playerName and score are required' });
  }

  const newScore = {
    id: Date.now(),
    playerName: playerName.substring(0, 20), // 限制名称长度
    score,
    level: level || 1,
    lines: lines || 0,
    timestamp: new Date().toISOString()
  };

  scores.push(newScore);

  // 保持最多100条记录
  if (scores.length > 100) {
    scores = scores.sort((a, b) => b.score - a.score).slice(0, 100);
  }

  res.status(201).json(newScore);
});

// 获取单个玩家最高分
app.get('/api/scores/player/:playerName', (req, res) => {
  const { playerName } = req.params;
  const playerScores = scores.filter(s => s.playerName === playerName);
  const highScore = playerScores.length > 0
    ? playerScores.sort((a, b) => b.score - a.score)[0]
    : null;

  res.json({
    playerName,
    highScore: highScore?.score || 0,
    gamesPlayed: playerScores.length,
    bestGame: highScore
  });
});

// 获取统计信息
app.get('/api/stats', (req, res) => {
  const totalGames = scores.length;
  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
  const avgScore = totalGames > 0 ? Math.round(totalScore / totalGames) : 0;
  const highestScore = scores.length > 0
    ? Math.max(...scores.map(s => s.score))
    : 0;

  res.json({
    totalGames,
    totalScore,
    avgScore,
    highestScore,
    activePlayers: wss.clients.size
  });
});

// WebSocket 连接处理
wss.on('connection', (ws) => {
  console.log('New client connected');

  // 发送欢迎消息
  ws.send(JSON.stringify({
    type: 'connected',
    message: 'Connected to Tetris server',
    timestamp: new Date().toISOString()
  }));

  // 处理客户端消息
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      switch (data.type) {
        case 'gameState':
          // 保存游戏状态
          gameStates[data.playerId] = {
            score: data.score,
            level: data.level,
            lines: data.lines,
            timestamp: new Date().toISOString()
          };
          break;

        case 'gameOver':
          // 游戏结束通知
          broadcastToAll({
            type: 'playerGameOver',
            playerName: data.playerName,
            score: data.score
          });
          break;

        case 'getOnlinePlayers':
          // 获取在线玩家数量
          ws.send(JSON.stringify({
            type: 'onlinePlayers',
            count: wss.clients.size
          }));
          break;

        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  // 处理断开连接
  ws.on('close', () => {
    console.log('Client disconnected');
  });

  // 处理错误
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// 广播消息给所有客户端
function broadcastToAll(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// 启动服务器
server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   🎮 Tetris Server Started 🎮         ║
╠═══════════════════════════════════════╣
║   HTTP Server: http://localhost:${PORT}     ║
║   WebSocket Server: ws://localhost:${PORT}  ║
╚═══════════════════════════════════════╝
  `);
});

module.exports = { app, server, wss };
