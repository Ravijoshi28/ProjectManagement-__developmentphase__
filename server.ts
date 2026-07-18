import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev=process.env.NODE_ENV!=="production";
const app=next({dev});
const handle=app.getRequestHandler();

app.prepare().then(()=>{
    const httpServer=createServer((req,res)=>{
        handle(req,res);
    });

    const io=new Server(httpServer,{
        cors:{
            origin:"*",
        },
    });

    io.on("connection",(socket)=>{
        console.log("user connected:",socket.id);

          socket.onAny((event, ...args) => {
    console.log("SERVER EVENT:", event, args);
  });

        socket.on("join-project", (projectId) => {
  socket.join(projectId);
  
});
socket.on("task-created",({projectId,formData})=>{
    io.to(projectId).emit("receive-task",formData);
})

        socket.on("send-message", ({ projectId, message}) => {
            
  io.to(projectId).emit("receive-message", message);
 
});

    socket.on("register-user",(user)=>{
        console.log(`user registered ${user}`)
        socket.join(user);
    })

    socket.on("notification",({addedEmail})=>{
        console.log(addedEmail)
        console.log("notification received");
        console.log(addedEmail)
       addedEmail.forEach((user:any) => {
        io.to(user.id).emit("notification")
        console.log(user.id);
        console.log("message sended")
       });
    })

        socket.on("disconnect",()=>{
            console.log("user disconnected");
        })
    });

    httpServer.listen(3000,()=>{
        console.log("running on server 3000");
    })
})