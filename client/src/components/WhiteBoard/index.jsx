import React, { useEffect, useLayoutEffect, useState } from "react";
import rough from "roughjs";

const WhiteBoard = (props) => {
  const { canvasRef, ctxRef, elements, setElements, tool, color } = props;

  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.height = window.innerHeight * 2;
    canvas.width = window.innerWidth * 2;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    ctxRef.current.strokeStyle = color;
  }, [color]);

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool == "pencil") {
      setElements((prevElem) => [
        ...prevElem,
        {
          type: "pencil",
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: color,
        },
      ]);
    } else if (tool == "line") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "line",
          offsetX,
          offsetY,
          width: offsetX,
          height: offsetY,
          stroke: color,
        },
      ]);
    } else if (tool == "rect") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "rect",
          offsetX,
          offsetY,
          width: 0,
          height: 0,
          stroke: color,
        },
      ]);
    }

    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (isDrawing) {
      if (tool == "pencil") {
        const { path } = elements[elements.length - 1];
        //   console.log("path is == ", path);
        const newPath = [...path, [offsetX, offsetY]];
        setElements((prevElements) =>
          prevElements.map((elem, index) => {
            if (index == elements.length - 1) {
              return {
                ...elem,
                path: newPath,
              };
            } else {
              return elem;
            }
          })
        );
      } else if (tool == "line") {
        setElements((prevElements) =>
          prevElements.map((elem, index) => {
            if (index == elements.length - 1) {
              return {
                ...elem,
                width: offsetX,
                height: offsetY,
              };
            } else {
              return elem;
            }
          })
        );
      } else if (tool == "rect") {
        setElements((prevElements) =>
          prevElements.map((elem, index) => {
            if (index == elements.length - 1) {
              return {
                ...elem,
                width: offsetX - elem.offsetX,
                height: offsetY - elem.offsetY,
              };
            } else {
              return elem;
            }
          })
        );
      }
    }
  };

  useLayoutEffect(() => {
    const roughGen = rough.canvas(canvasRef.current);

    if (elements.length > 0) {
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }

    elements.forEach((element) => {
      if (element.type == "pencil") {
        roughGen.linearPath(element.path, {
          stroke: element.stroke,
          strokeWidth: 5,
          roughness: 0,
        });
      } else if (element.type == "line") {
        roughGen.line(
          element.offsetX,
          element.offsetY,
          element.width,
          element.height,
          {
            stroke: element.stroke,
            strokeWidth: 5,
            roughness: 0,
          }
        );
      } else if (element.type == "rect") {
        roughGen.rectangle(
          element.offsetX,
          element.offsetY,
          element.width,
          element.height,
          {
            stroke: element.stroke,
            strokeWidth: 5,
            roughness: 0,
          }
        );
      }
    });
  }, [elements]);

  const handleMouseUp = (e) => {
    setIsDrawing(false);
  };

  return (
    <>
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="border border-dark h-100 w-100 overflow-hidden"
      >
        <canvas ref={canvasRef}></canvas>
      </div>
    </>
  );
  ("black");
};

export default WhiteBoard;
