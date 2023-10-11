import { Routes, Route } from "react-router-dom";
import Forms from "./components/Forms";
import RoomPage from "./pages/RoomPage";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
// if you host backend to heroku, that time add that server address here.
const server = "http://localhost:5000";

//options need to pass with server address
const connectionOptions = {
  "force new connection": true,
  reconnectionAttepmts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

//setting up socket connection to backend
const socket = io(server, connectionOptions);

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  //function to generate random user id

  const uuid = () => {
    let S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  };

  useEffect(() => {
    socket.on("userIsJoined", (data) => {
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.warn("Can't join this room");
      }
    });

    socket.on("allUsers", (data) => {
      setUsers(data);
    });

    socket.on("userJoinedMessageBroadcasted", (data) => {
      toast.info(`${data} joined the room`);
    });

    socket.on("userLeftMessageBroadCasted", (data) => {
      toast.info(`${data} left the room`);
    });
  }, []);

  return (
    <div className="container">
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={<Forms uuid={uuid} socket={socket} setUser={setUser} />}
        />
        <Route
          path="/:roomId"
          element={<RoomPage user={user} socket={socket} users={users} />}
        />
      </Routes>
    </div>
  );
}

export default App;
