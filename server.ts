import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

export const io = new Server(httpServer, {
  cors: {
    origin: [
      "https://project-management-developmentphase.vercel.app/",
            "http://localhost:3000",
    ],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("join-project", (projectId) => {
    socket.join(projectId);
  });

  socket.on("task-created", ({ projectId, formData }) => {
    io.to(projectId).emit("receive-task", formData);
  });

  socket.on("task-assigned",(userId)=>{
    socket.to(userId).emit("receive-assigned");
  })

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

});

const PORT = Number(process.env.PORT) || 3001;
httpServer.listen(PORT, "0.0.0.0");
