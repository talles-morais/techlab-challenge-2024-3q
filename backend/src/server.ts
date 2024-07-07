import { app } from "./app.js";
import { APP_PORT } from "./constants/env.js";
import { database } from "./services/database.js";
import { createServer } from 'http'
import { Server } from 'socket.io'

await database.initialize()

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
})

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('disconnect', (reason) => {
    console.log(`User disconnected: ${socket.id}, reason: ${reason}`);
  });

  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', message);
  });

  socket.on('closeConversation', (conversationId) => {
    io.emit('conversationClosed', conversationId);
  });
});

httpServer.listen(APP_PORT, () => {
  console.log(`Server is running on port ${APP_PORT}`);
});