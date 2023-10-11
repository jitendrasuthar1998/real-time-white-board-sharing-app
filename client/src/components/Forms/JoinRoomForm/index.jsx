import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinRoomForm = ({ socket, setUser, uuid }) => {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  const handleJoinRoom = (e) => {
    e.preventDefault();
    const roomData = {
      name,
      roomId,
      userId: uuid(),
      presenter: false,
    };
    setUser(roomData);
    socket.emit("userJoined", roomData);
    navigate(`/${roomId}`);
  };

  return (
    <form className="form col-md-12 mt-5">
      <div className="form-group">
        <input
          type="text"
          name="name"
          id="name"
          className="form-control my-2"
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="roomId"
          id="roomId"
          onChange={(e) => setRoomId(e.target.value)}
          className="form-control my-2"
          placeholder="Enter room code"
        />
      </div>
      <button
        type="submit"
        className="mt-4 btn btn-primary btn-block form-control"
        onClick={handleJoinRoom}
      >
        Join Room
      </button>
    </form>
  );
};

export default JoinRoomForm;
