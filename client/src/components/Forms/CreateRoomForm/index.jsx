import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateRoomForm = ({uuid, socket, setUser}) => {

  const [roomId, setRoomId] = useState(uuid());
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const handleCreateRoom = (e) => {
    e.preventDefault();
    //name, roomId, userId, host, presenter

    const roomData = {
      name, roomId, userId: uuid(), presenter: true
    }

    // console.log('roomData is == ', roomData);
    setUser(roomData);    
    //emitting an event with some data
    socket.emit("userJoined", roomData);
    
    navigate(`/${roomId}`);
  }

  return (
    <form className="form col-md-12 mt-5">
      <div className="form-group">
        <input
          type="text"
          name="name"
          value={name}
          id="name"
          onChange={(e)=> setName(e.target.value) }
          className="form-control my-2"
          placeholder="Enter your name"
        />
      </div>
      <div className="form-group border">
        <div className="input-group d-flex align-items-center justify-content-center">
          <input
            type="text"
            name="roomId"
            id="roomId"
            value={roomId}
            disabled
            title={roomId}
            className="form-control my-2 border-0"
            placeholder="Generate room code"
          />
          <div className="input-group-append">
            <button type="button" className="btn btn-primary btn-small me-1" onClick={()=>setRoomId(uuid())}>
              Generate
            </button>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm me-1"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
      <button type="submit" className="mt-4 btn btn-primary btn-block form-control" onClick={(e)=> handleCreateRoom(e)}>Generate Room</button>
    </form>
  );
};

export default CreateRoomForm;
