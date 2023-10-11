const express = require("express");
const app = express();

const server = require("http").createServer(app);

const { Server } = require("socket.io");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const io = new Server(server);

const port = process.env.PORT || 5000;

//routes

app.get("/", (req, res) => {
  res.send(
    "This is mern realtime board sharing app official server by Jitendra Suthar"
  );
});

let roomIdGlobal, imageUrlGlobal;

//setting up socket connection.
io.on("connection", (socket) => {
  // console.log("User connected");
  socket.on("userJoined", (roomData) => {
    const { name, userId, roomId, host, presenter } = roomData;
    // console.log("roomData is == ", roomData);
    roomIdGlobal = roomId;

    //to create room, use socket.join("roomId");
    socket.join(roomId);
    const users = addUser({
      name,
      userId,
      roomId,
      host,
      presenter,
      socketId: socket.id,
    });
    socket.emit("userIsJoined", { success: true, users });

    //emitting event to all the users or client connected with this particular room id
    socket.broadcast.to(roomId).emit("userJoinedMessageBroadcasted", name);

    const usersInRoom = getUsersInRoom(roomId);
    socket.broadcast.to(roomId).emit("allUsers", usersInRoom);
    socket.broadcast.to(roomId).emit("whiteBoardDataResponse", {
      imgUrl: imageUrlGlobal,
    });
  });

  socket.on("whiteBoardData", (data) => {
    imageUrlGlobal = data;
    //broadcasting image url to all clients joined a particular room
    socket.broadcast.to(roomIdGlobal).emit("whiteBoardDataResponse", {
      imgUrl: data,
    });
  });

  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    if (user) {
      // console.log("user is == ", user);
      removeUser(socket.id);
      socket.broadcast
        .to(roomIdGlobal)
        .emit("userLeftMessageBroadCasted", user.name);

      socket.leave(roomIdGlobal);
    }
  });
});

server.listen(port, () => {
  console.log("server is running on http://localhost:5000");
});
