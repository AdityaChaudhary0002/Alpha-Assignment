require('dotenv').config();


const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const peopleController = require('./src/controllers/peopleController');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
app.set('io', io);

app.use(express.json());

// Routes
app.get('/api/people', peopleController.getPeople);
app.post('/api/enrich/:person_id', peopleController.enrichPerson);

// WebSocket endpoint
app.get('/ws', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
io.on('connection', (socket) => {
  const companyId = socket.handshake.query.companyId;
  if (!companyId) {
    socket.disconnect();
    return;
  }
  let progress = 0;
  const interval = setInterval(() => {
    progress += 20;
    if (progress < 100) {
      socket.emit('progress', { companyId, progress });
    } else {
      socket.emit('progress', { companyId, progress: 100 });
      socket.emit('done', { companyId });
      clearInterval(interval);
    }
  }, 1000);
  socket.on('disconnect', () => {
    clearInterval(interval);
  });
});

// GET /context-snippets/:companyId
app.get('/api/context-snippets/:companyId', async (req, res) => {
  const { companyId } = req.params;
  try {
    const snippet = await prisma.contextSnippet.findFirst({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
    if (!snippet) return res.status(404).json({ error: 'No snippet found' });
    res.json(snippet);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching context snippet' });
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
module.exports = { io };