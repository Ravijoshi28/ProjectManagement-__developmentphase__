import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

export const io = new Server(httpServer, {
  cors: {
    origin: 
      "http://localhost:3000",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.onAny((event, ...args) => {
    console.log("SERVER EVENT:", event, args);
  });

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
    console.log(`User registered ${userId}`);
    socket.join(userId);
  });

  socket.on("notification", ({ addedEmail }) => {
      console.log(addedEmail);
  console.log(typeof addedEmail);
  console.log(Array.isArray(addedEmail));
    addedEmail.forEach((user: any) => {
      io.to(user.id).emit("notification");
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT =  4000;

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Socket server running on ${PORT}`);
});