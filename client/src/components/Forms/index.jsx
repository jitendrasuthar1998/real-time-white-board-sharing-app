import React from 'react'
import "./index.css";
import JoinRoomForm from './JoinRoomForm';
import CreateRoomForm from './CreateRoomForm';

const Forms = ({uuid, socket, setUser}) => {
  return (
    <div className='row h-100 pt-5'>
        <div className="col-md-4 mt-5 border border-primary rounded-2 mx-auto d-flex flex-column align-items-center form-box p-5">
            <h1 className="text-primary fw-bold">Create Room</h1>
            <CreateRoomForm uuid={uuid} socket={socket} setUser={setUser}/>
        </div>
        <div className="col-md-4 mt-5 border border-primary rounded-2 mx-auto d-flex flex-column align-items-center form-box p-5">
            <h1 className="text-primary fw-bold">Join Room</h1>
            <JoinRoomForm uuid={uuid} socket={socket} setUser={setUser}/>
        </div>
    </div>
  )
}

export default Forms