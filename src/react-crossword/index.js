import Square from "./Square";
import { useState } from "react";
import Clues from "./Clues";

const alphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

function Crossword({ rows, columns, data, revealAnswers, acrosses, downs }) {
  const cols = data[0].length;
  //   if (data.length !== rows * columns) {
  //     throw "Data Array must be of length equal to the number of rows multiplied by columns!";
  //   }
  //   const size = `calc(${100 / columns}% - 6px)`;
  const size = `calc(${100 / cols}% - 2px)`;

  function getClueMap() {
    let num = 1;
    for (let y = 0; y < data.length; y++) {
      for (let x = 0; x < data[y].length; x++) {
        const currentSquare = data[y][x];

        if (currentSquare) {
          if (y === 0 || x === 0 || !data[y - 1][x] || !data[y][x - 1]) {
            currentSquare.displayNum = num;
            num++;
          }
          if (y === 0 || !data[y - 1][x]) {
            currentSquare.downNum = currentSquare.displayNum;
          } else {
            currentSquare.downNum = data[y - 1][x].downNum;
          }
          if (x === 0 || !data[y][x - 1]) {
            currentSquare.acrossNum = currentSquare.displayNum;
          } else {
            currentSquare.acrossNum = data[y][x - 1].acrossNum;
          }
        }
      }
    }
    return data;
  }

  const [dataSet, setDataSet] = useState(getClueMap());
  const [across, setAcross] = useState(true);
  const [xFocus, setXFocus] = useState(null);
  const [yFocus, setYFocus] = useState(null);
  const [answerMap, setAnswerMap] = useState(
    data.map((row) => row.map((cell) => (cell ? { answer: "" } : null))),
  );
  const [currentClue, setCurrentClue] = useState(null);

  function toggleDirection() {
    setAcross(!across);
  }

  function setFocus(x, y, across) {
    if (dataSet && dataSet[y]) {
      if (dataSet[y][x]) {
        setXFocus(x);
        setYFocus(y);
        setAcross(across);
        setCurrentClue(
          across ? dataSet[y][x].acrossNum : dataSet[y][x].downNum,
        );
      }
    }
  }

  function handleKeyDown(char) {
    char.preventDefault();
    if (alphabet.includes(char.key)) {
      setAnswerMap(
        answerMap.map((row, yIndex) =>
          row.map((col, xIndex) =>
            yIndex === yFocus && xIndex === xFocus
              ? { answer: char.key.toUpperCase() }
              : col,
          ),
        ),
      );
      across
        ? setFocus(xFocus + 1, yFocus, true)
        : setFocus(xFocus, yFocus + 1, false);
    } else {
      console.log(char);
      switch (char.key) {
        case "Tab":
          console.log("YOU PRESSED TAB");
          if (char.shiftKey) {
            skipClue(false);
          } else {
            skipClue(true);
          }
          break;
        case "ArrowRight":
          setFocus(xFocus + 1, yFocus, true);
          break;
        case "ArrowLeft":
          setFocus(xFocus - 1, yFocus, true);
          break;
        case "ArrowUp":
          setFocus(xFocus, yFocus - 1, false);
          break;
        case "ArrowDown":
          setFocus(xFocus, yFocus + 1, false);
          break;
        case "Backspace":
          handleBackspace();
          break;
        default:
          console.log("tbh I don't know what you just pressed...");
          break;
      }
    }
  }

  function focusClue(number, across) {
    for (let y = 0; y < dataSet.length; y++) {
      for (let x = 0; x < dataSet[y].length; x++) {
        const square = dataSet[y][x];
        if (square && square.displayNum === number) {
          setFocus(x, y, across);
          return;
        }
      }
    }
  }

  function skipClue(forward) {
    console.log("SKIPPING");
    let newX = xFocus,
      newY = yFocus;
    if (across) {
      while (
        forward
          ? newX !== dataSet[0].length - 1 || newY !== dataSet.length - 1
          : newX !== 0 || newY !== 0
      ) {
        console.log("WHILE LOOP");
        if (forward ? newX !== dataSet[0].length - 1 : newX !== 0) {
          console.log(forward ? "MOVING RIGHT" : "MOVING LEFT");
          forward ? newX++ : newX--;
          console.log("X: ", newX, "Y: ", newY);
        } else if (forward ? newY !== dataSet.length - 1 : newY !== 0) {
          console.log(forward ? "MOVING DOWN" : "MOVING UP");
          forward ? newY++ : newY--;
          newX = forward ? 0 : dataSet[0].length - 1;
        }
        if (
          dataSet[newY][newX] &&
          (forward
            ? dataSet[newY][newX].acrossNum > currentClue
            : dataSet[newY][newX].acrossNum < currentClue &&
              dataSet[newY][newX].acrossNum === dataSet[newY][newX].displayNum)
        ) {
          setFocus(newX, newY, across);
          return;
        }
      }
      newX = forward ? 0 : dataSet[0].length - 1;
      newY = forward ? 0 : dataSet[0].length - 1;
      while (
        forward
          ? newX !== dataSet[0].length - 1 || newY !== dataSet.length - 1
          : newX !== 0 || newY !== 0
      ) {
        if (
          dataSet[newY][newX] &&
          (forward
            ? dataSet[newY][newX].downNum === 1
            : dataSet[newY][newX].downNum === dataSet[newY][newX].displayNum)
        ) {
          setFocus(newX, newY, !across);
          return;
        }
        console.log("WHILE LOOP");
        if (forward ? newX !== dataSet[0].length - 1 : newX !== 0) {
          console.log(forward ? "MOVING RIGHT" : "MOVING LEFT");
          forward ? newX++ : newX--;
          console.log("X: ", newX, "Y: ", newY);
        } else if (forward ? newY !== dataSet.length - 1 : newY !== 0) {
          console.log(forward ? "MOVING DOWN" : "MOVING UP");
          forward ? newY++ : newY--;
          newX = forward ? 0 : dataSet[0].length - 1;
        }
      }
    }
    if (!across) {
      // first get the first square of the clue
      let newX = xFocus,
        newY = yFocus;
      if (dataSet[newY][newX].displayNum !== currentClue) {
        console.log("NOT ON FIRST SQUARE");
        while (true) {
          newY--;
          if (dataSet[newY][newX].displayNum === currentClue) {
            break;
          }
        }
      }
      console.log("X: ", newX, "Y: ", newY);
      while (
        forward
          ? newX !== dataSet[0].length - 1 || newY !== dataSet.length - 1
          : newX !== 0 || newY !== 0
      ) {
        console.log("WHILE LOOP");
        if (forward ? newX !== dataSet[0].length - 1 : newX !== 0) {
          console.log(forward ? "MOVING RIGHT" : "MOVING LEFT");
          forward ? newX++ : newX--;
          console.log("X: ", newX, "Y: ", newY);
        } else if (forward ? newY !== dataSet.length - 1 : newY !== 0) {
          console.log(forward ? "MOVING DOWN" : "MOVING UP");
          forward ? newY++ : newY--;
          newX = forward ? 0 : dataSet[0].length - 1;
        }
        if (
          dataSet[newY][newX] &&
          (forward
            ? dataSet[newY][newX].downNum > currentClue
            : dataSet[newY][newX].downNum === dataSet[newY][newX].displayNum)
        ) {
          setFocus(newX, newY, across);
          return;
        }
      }
      newX = forward ? 0 : dataSet[0].length - 1;
      newY = forward ? 0 : dataSet.length - 1;
      while (
        forward
          ? newX !== dataSet[0].length - 1 || newY !== dataSet.length - 1
          : newX !== 0 || newY !== 0
      ) {
        if (
          dataSet[newY][newX] &&
          (forward
            ? dataSet[newY][newX].acrossNum === 1
            : dataSet[newY][newX].acrossNum === dataSet[newY][newX].displayNum)
        ) {
          setFocus(newX, newY, !across);
          return;
        }
        console.log("WHILE LOOP");
        if (forward ? newX !== dataSet[0].length - 1 : newX !== 0) {
          console.log(forward ? "MOVING RIGHT" : "MOVING LEFT");
          forward ? newX++ : newX--;
          console.log("X: ", newX, "Y: ", newY);
        } else if (forward ? newY !== dataSet.length - 1 : newY !== 0) {
          console.log(forward ? "MOVING DOWN" : "MOVING UP");
          forward ? newY++ : newY--;
          newX = forward ? 0 : dataSet[0].length - 1;
        }
      }
      // next look for the next clue
      //   while (newX !== dataSet[0].length - 1 || newY !== dataSet.length - 1) {
      //     console.log("WHILE LOOP");
      //     if (newX !== dataSet[0].length - 1) {
      //       console.log("MOVING RIGHT");
      //       newX++;
      //       console.log("X: ", newX, "Y: ", newY);
      //     } else if (newY !== dataSet.length - 1) {
      //       console.log("MOVING DOWN");
      //       newY++;
      //       newX = 0;
      //     }
      //     if (
      //       dataSet[newY][newX] &&
      //       dataSet[newY][newX].acrossNum > currentClue
      //     ) {
      //       setFocus(newX, newY, across);
      //       return;
      //     }
      //   }
      // }
    }
  }

  function handleBackspace() {
    const currentInput = answerMap[yFocus][xFocus]?.answer;
    if (currentInput) {
      setAnswerMap(
        answerMap.map((row, y) =>
          row.map((col, x) =>
            x === xFocus && y === yFocus ? { answer: "" } : col,
          ),
        ),
      );
    } else {
      if (
        across
          ? answerMap[yFocus][xFocus - 1]
          : answerMap[yFocus - 1] && answerMap[yFocus - 1][xFocus]
      ) {
        setAnswerMap(
          answerMap.map((row, y) =>
            row.map((col, x) =>
              across
                ? x === xFocus - 1 && y === yFocus
                  ? { answer: "" }
                  : col
                : x === xFocus && y === yFocus - 1
                ? { answer: "" }
                : col,
            ),
          ),
        );
      }
      across
        ? setFocus(xFocus - 1, yFocus, across)
        : setFocus(xFocus, yFocus - 1, across);
    }
  }

  return (
    <div
      style={{ display: "flex", height: "100vh" }}
      id="crossword"
      onKeyDown={handleKeyDown}
      tabIndex="0"
    >
      <div
        style={{
          width: "66%",
          backgroundColor: "black",
          height: "fit-content",
        }}
      >
        {data.map((row, y) => (
          <div style={{ width: "100%", display: "flex" }}>
            {row.map((cell, x) => (
              <Square
                size={size}
                across={across}
                data={cell}
                revealAnswers={revealAnswers}
                focus={y === yFocus && x === xFocus}
                y={y}
                x={x}
                input={answerMap[y][x]?.answer}
                setFocus={setFocus}
                toggleDirection={toggleDirection}
                clueSelected={
                  dataSet[y][x] &&
                  (across
                    ? dataSet[y][x].acrossNum === currentClue
                    : dataSet[y][x].downNum === currentClue)
                }
              />
            ))}
          </div>
        ))}
      </div>
      <Clues
        acrosses={acrosses}
        downs={downs}
        across={across}
        currentClue={currentClue}
        focusClue={focusClue}
      />
    </div>
  );
}

export default Crossword;
