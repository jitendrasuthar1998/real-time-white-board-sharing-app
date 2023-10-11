import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import WhiteBoard from "../../components/WhiteBoard";

const RoomPage = ({ user, socket, users }) => {
  const canvasRef = useRef(null);

  const ctxRef = useRef(null);

  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("black");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [openUsersTab, setOpenUsersTab] = useState(false);

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillRect = "white";
    ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    setElements([]);
  };

  const handleUndo = () => {
    setHistory((prevHistory) => [
      ...prevHistory,
      elements[elements.length - 1],
    ]);

    setElements((prevElements) =>
      prevElements.slice(0, prevElements.length - 1)
    );
  };

  const handleRedo = () => {
    setElements((prevElements) => [
      ...prevElements,
      history[history.length - 1],
    ]);

    setHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
  };

  return (
    <div className="row pb-5">
      <button className="btn btn-dark" style={{display:"block", position:"absolute", top:"5%", left:"5%", height:"50px", width:"100px"}} onClick={()=> setOpenUsersTab(true)}>Users</button>
      {
        openUsersTab ? (
          <div className="position-fixed top-0  h-100 text-white bg-dark border" style={{width:"250px", left:"0%"}}>
            <button type="button" className="btn btn-light btn-block w-100 mt-5" onClick={()=> setOpenUsersTab(false)}>Close</button>
            <div className="w-100 pt-5">
            {
              users.map((usr, index)=> <p key={index*999} className="my-2 w-100 text-center">{usr.name}{user && user.userId === usr.userId ? "(You)" : null}</p>)
            }
              </div>
          </div>
        ) : (null)
      }
      <h1 className="text-center py-5">
        White Board Sharing App{" "}
        <span className="text-primary">[Users Online : {users.length}]</span>
      </h1>
      {user && user?.presenter ? (
        <div className="col-md-10 mx-auto px-5 mb-4 d-flex align-items-center justify-content-between">
          <div className="d-flex col-md-3 justify-content-between gap-2">
            <div className="d-flex gap-1 align-items-center">
              <label htmlFor="pencil">Pencil</label>
              <input
                checked={tool === "pencil"}
                type="radio"
                name="tool"
                value="pencil"
                id="pencil"
                onChange={(e) => setTool(e.target.value)}
              />
            </div>
            <div className="d-flex gap-1 align-items-center">
              <label htmlFor="line">Line</label>
              <input
                type="radio"
                name="tool"
                value="line"
                id="line"
                checked={tool == "line"}
                onChange={(e) => setTool(e.target.value)}
              />
            </div>
            <div className="d-flex gap-1 align-items-center">
              <label htmlFor="rect">Rectangle</label>
              <input
                type="radio"
                name="tool"
                value="rect"
                id="rect"
                checked={tool == "rect"}
                onChange={(e) => setTool(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="d-flex align-items-center">
              <label htmlFor="color">Select Color :</label>
              <input
                type="color"
                name="color"
                id="color"
                className="ms-3"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3 d-flex gap-2 justify-content-end">
            <button
              className="btn btn-primary"
              disabled={elements.length === 0}
              onClick={handleUndo}
            >
              Undo
            </button>
            <button
              className="btn btn-outline-primary"
              disabled={history.length < 1}
              onClick={handleRedo}
            >
              Redo
            </button>
          </div>
          <div className="col-md-2 d-flex justify-content-end">
            <button className="btn btn-danger" onClick={handleClearCanvas}>
              Clear Canvas
            </button>
          </div>
        </div>
      ) : null}
      <div className="col-md-10 mx-auto mt-4 canvas-box">
        <WhiteBoard
          color={color}
          canvasRef={canvasRef}
          ctxRef={ctxRef}
          elements={elements}
          setElements={setElements}
          tool={tool}
          user={user}
          socket={socket}
        />
      </div>
    </div>
  );
};

export default RoomPage;
