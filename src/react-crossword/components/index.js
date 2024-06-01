import Square from "./Square";
import { useState } from "react";
import Clues from "./Clues";

const alphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

function Crossword({
  data,
  revealAnswers,
  acrosses,
  downs,
  onInput,
  onCellCorrect,
  onClueCorrect,
  onPuzzleFinished,
  onPuzzleCorrect,
  crosswordStyle,
  puzzleStyle,
  squareStyle,
  selectedSquareColor,
  selectedClueColor,
  puzzleClassnames,
  crosswordClassnames,
  squareClassnames,
  clueMenuClassnames,
  clueListClassnames,
  clueClassnames,
}) {
  const cols = data[0].length;
  if (!data.every((row) => row.length === cols)) {
    throw new Error("All rows must be of equal length");
  }
  const size = `calc(${100 / cols}% - 2px)`;

  function getClueMap() {
    let num = 1;
    for (let y = 0; y < data.length; y++) {
      for (let x = 0; x < data[y].length; x++) {
        const currentSquare = data[y][x];

        if (currentSquare) {
          currentSquare.input = "";
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
  const [currentClue, setCurrentClue] = useState(null);

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
      if (dataSet[yFocus][xFocus].disabled) {
        across
          ? setFocus(xFocus + 1, yFocus, true)
          : setFocus(xFocus, yFocus + 1, false);
        return;
      }
      const nextState = dataSet.map((row, yIndex) =>
        row.map((col, xIndex) =>
          yIndex === yFocus && xIndex === xFocus
            ? { ...col, input: char.key.toUpperCase() }
            : col,
        ),
      );
      let newData;
      if (onInput) {
        newData = onInput(xFocus, yFocus, char.key.toUpperCase(), nextState);
      }
      if (
        onCellCorrect &&
        nextState[yFocus][xFocus].input === nextState[yFocus][xFocus].answer
      ) {
        newData = onCellCorrect(xFocus, yFocus, char.key, nextState) || newData;
      }
      if (
        onClueCorrect &&
        (across
          ? nextState
              .flat(1)
              .filter(
                (square) =>
                  square &&
                  square.acrossNum === nextState[yFocus][xFocus].acrossNum,
              )
              .every((square) => square.input === square.answer)
          : nextState
              .flat(1)
              .filter(
                (square) =>
                  square &&
                  square.downNum === nextState[yFocus][xFocus].downNum,
              )
              .every((square) => square.input === square.answer))
      ) {
        newData =
          onClueCorrect(
            across
              ? dataSet[yFocus][xFocus].acrossNum
              : dataSet[yFocus][xFocus].downNum,
            across ? "across" : "down",
            nextState,
          ) || newData;
      }
      if (
        onPuzzleFinished &&
        nextState.flat(1).every((square) => !square || square.input)
      ) {
        if (
          onPuzzleCorrect &&
          nextState
            .flat(1)
            .every((square) => !square || square.input === square.answer)
        ) {
          newData = onPuzzleCorrect(nextState) || newData;
        } else {
          if (!dataSet[yFocus][xFocus]?.input) {
            newData = onPuzzleFinished(nextState) || newData;
          }
        }
      }
      if (newData) {
        setDataSet(newData);
      } else {
        setDataSet(nextState);
      }
      across
        ? setFocus(xFocus + 1, yFocus, true)
        : setFocus(xFocus, yFocus + 1, false);
    } else {
      switch (char.key) {
        case "Tab":
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
    let newX = xFocus,
      newY = yFocus;
    if (across) {
      while (
        forward
          ? newX !== dataSet[0].length - 1 || newY !== dataSet.length - 1
          : newX !== 0 || newY !== 0
      ) {
        if (forward ? newX !== dataSet[0].length - 1 : newX !== 0) {
          forward ? newX++ : newX--;
        } else if (forward ? newY !== dataSet.length - 1 : newY !== 0) {
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
        if (forward ? newX !== dataSet[0].length - 1 : newX !== 0) {
          forward ? newX++ : newX--;
        } else if (forward ? newY !== dataSet.length - 1 : newY !== 0) {
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
        while (true) {
          newY--;
          if (dataSet[newY][newX].displayNum === currentClue) {
            break;
          }
        }
      }
      while (
        forward
          ? newX !== dataSet[0].length - 1 || newY !== dataSet.length - 1
          : newX !== 0 || newY !== 0
      ) {
        if (forward ? newX !== dataSet[0].length - 1 : newX !== 0) {
          forward ? newX++ : newX--;
        } else if (forward ? newY !== dataSet.length - 1 : newY !== 0) {
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
        if (forward ? newX !== dataSet[0].length - 1 : newX !== 0) {
          forward ? newX++ : newX--;
        } else if (forward ? newY !== dataSet.length - 1 : newY !== 0) {
          forward ? newY++ : newY--;
          newX = forward ? 0 : dataSet[0].length - 1;
        }
      }
    }
  }

  function handleBackspace() {
    const currentInput = dataSet[yFocus][xFocus]?.input;
    if (currentInput) {
      setDataSet(
        dataSet.map((row, y) =>
          row.map((col, x) =>
            x === xFocus && y === yFocus ? { ...col, input: "" } : col,
          ),
        ),
      );
    } else {
      if (
        across
          ? dataSet[yFocus][xFocus - 1]
          : dataSet[yFocus - 1] && dataSet[yFocus - 1][xFocus]
      ) {
        setDataSet(
          dataSet.map((row, y) =>
            row.map((col, x) =>
              across
                ? x === xFocus - 1 && y === yFocus
                  ? { ...col, input: "" }
                  : col
                : x === xFocus && y === yFocus - 1
                ? { ...col, input: "" }
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
      style={{ display: "flex", height: "100vh", ...puzzleStyle }}
      className={`react-crossword ${puzzleClassnames}`}
      onKeyDown={handleKeyDown}
      tabIndex="0"
    >
      <div
        className={crosswordClassnames}
        style={{
          width: "66%",
          backgroundColor: "black",
          height: "fit-content",
          ...crosswordStyle,
        }}
      >
        {data.map((row, y) => (
          <div style={{ width: "100%", display: "flex" }} key={y}>
            {row.map((cell, x) => (
              <Square
                squareClassnames={squareClassnames}
                squareStyle={squareStyle}
                key={`${x}-${y}`}
                size={size}
                across={across}
                data={cell}
                revealAnswers={revealAnswers}
                focus={y === yFocus && x === xFocus}
                y={y}
                x={x}
                input={dataSet[y][x]?.input}
                setFocus={setFocus}
                clueSelected={
                  dataSet[y][x] &&
                  (across
                    ? dataSet[y][x].acrossNum === currentClue
                    : dataSet[y][x].downNum === currentClue)
                }
                selectedSquareColor={selectedSquareColor}
                selectedClueColor={selectedClueColor}
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
        selectedSquareColor={selectedSquareColor}
        selectedClueColor={selectedClueColor}
        clueMenuClassnames={clueMenuClassnames}
        clueListClassnames={clueListClassnames}
        clueClassnames={clueClassnames}
      />
    </div>
  );
}

export default Crossword;
