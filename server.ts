import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, {
      "Content-Type": "text/plain",
    });

    res.end("Socket.IO server running");
    return;
  }

  res.writeHead(404);
  res.end();
});

export const io = new Server(httpServer, {
  cors: {
    origin: [
      "https://project-management-developmentphase.vercel.app",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-project", (projectId) => {
    socket.join(projectId);
  });

  socket.on("task-created", ({ projectId, formData }) => {
    io.to(projectId).emit("receive-task", formData);
  });

  socket.on("task-assigned", (userId) => {
    socket.to(userId).emit("receive-assigned");
  });

  socket.on("send-message", ({ projectId, message }) => {
    io.to(projectId).emit("receive-message", message);
  });

  socket.on("register-user", (userId) => {
    socket.join(userId);
  });

  socket.on("notification", ({ addedEmail }) => {
    addedEmail.forEach((user: any) => {
      io.to(user.id).emit("notification");
    });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = Number(process.env.PORT) || 3001;

console.log("PORT env:", process.env.PORT);
console.log("Starting Socket.IO server on:", PORT);

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Socket.IO server listening on 0.0.0.0:${PORT}`);
});