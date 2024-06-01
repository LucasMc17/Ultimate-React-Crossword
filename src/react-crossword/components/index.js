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
  // Get the number of columns in the puzzle, based on the length of the first subarray passed to us in the data
  const cols = data[0].length;

  // Throw an error if any row in the data is not of equal length (puzzles must be a regular grid)
  if (!data.every((row) => row.length === cols)) {
    throw new Error("All rows must be of equal length");
  }

  // Calculate the size of each cell in the puzzle based on the number of columns
  const size = `calc(${100 / cols}% - 2px)`;

  // Format the inputted data grid with clue numbers, one for its corresponding across number and one for it's down number
  // Also add a display number where needed
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

  /*** CREATE CROSSWORD STATE ***/

  const [dataSet, setDataSet] = useState(getClueMap()); // Full answer map
  const [across, setAcross] = useState(true); // Boolean to track user's directional focus
  const [xFocus, setXFocus] = useState(null); // X coordinate of user focus
  const [yFocus, setYFocus] = useState(null); // Y coordinate of user focus
  const [currentClue, setCurrentClue] = useState(null); // null or object to track number and direction of currently focused clue

  /*** EVENT HANDLERS ***/

  // Set user focus on particular square, if it is not a blank
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

  // Handle user keystroke, either to input guess, backspace or navigate grid
  function handleKeyDown(e) {
    e.preventDefault();

    // If the input is alphanumeric, input guess
    if (alphabet.includes(e.key)) {
      // If the cell is marked disabled, move on as normal
      if (dataSet[yFocus][xFocus].disabled) {
        across
          ? setFocus(xFocus + 1, yFocus, true)
          : setFocus(xFocus, yFocus + 1, false);
        return;
      }

      // Create the next state of the crossword by mapping over the current state with the new guess
      const nextState = dataSet.map((row, yIndex) =>
        row.map((col, xIndex) =>
          yIndex === yFocus && xIndex === xFocus
            ? { ...col, input: e.key.toUpperCase() }
            : col,
        ),
      );

      // Custom event handler flow
      // Create a new placeholder for the state of the puzzle after event handlers
      let newData;

      // Run user's onInput function, if it exists. Replace newData with the return statement, if it exists
      if (onInput) {
        newData = onInput(xFocus, yFocus, e.key.toUpperCase(), nextState);
      }

      // Run user's onCellCorrect function, if it exists, and cell is correct. Replace newData with the return statement, if it exists
      if (
        onCellCorrect &&
        nextState[yFocus][xFocus].input === nextState[yFocus][xFocus].answer
      ) {
        newData =
          onCellCorrect(xFocus, yFocus, e.key, newData || nextState) || newData;
      }

      // Run user's onClueCorrect function, if it exists, once for all cells associated with the across clue and once for the down clue
      // Replace newData with the return statement, if it exists
      if (onClueCorrect) {
        if (
          nextState
            .flat(1)
            .filter(
              (square) =>
                square &&
                square.acrossNum === nextState[yFocus][xFocus].acrossNum,
            )
            .every((square) => square.input === square.answer)
        ) {
          newData =
            onClueCorrect(
              dataSet[yFocus][xFocus].acrossNum,
              "across",
              newData || nextState,
            ) || newData;
        }
        if (
          nextState
            .flat(1)
            .filter(
              (square) =>
                square && square.downNum === nextState[yFocus][xFocus].downNum,
            )
            .every((square) => square.input === square.answer)
        ) {
          newData =
            onClueCorrect(
              dataSet[yFocus][xFocus].downNum,
              "down",
              newData || nextState,
            ) || newData;
        }
      }

      // Run user's onPuzzleFinished or onPuzzleCorrect function, as appropriate, if they exist. Replace newData with the return statement, if it exists
      if (
        (onPuzzleFinished || onPuzzleCorrect) &&
        nextState.flat(1).every((square) => !square || square.input)
      ) {
        if (
          onPuzzleCorrect &&
          nextState
            .flat(1)
            .every((square) => !square || square.input === square.answer)
        ) {
          newData = onPuzzleCorrect(newData || nextState) || newData;
        } else {
          if (onPuzzleFinished && !dataSet[yFocus][xFocus]?.input) {
            newData = onPuzzleFinished(newData || nextState) || newData;
          }
        }
      }

      // Finally, replace the puzzle's data with the newData result if it exists, or just use nextState if not
      if (newData) {
        setDataSet(newData);
      } else {
        setDataSet(nextState);
      }
      // End of custom event handler flow

      // Advance user focus by 1 square in current direction
      across
        ? setFocus(xFocus + 1, yFocus, true)
        : setFocus(xFocus, yFocus + 1, false);
    } else {
      // If key is not alphanumeric, switch to navigation actions
      switch (e.key) {
        case "Tab":
          if (e.shiftKey) {
            skipClue(false);
          } else {
            skipClue(true);
          }
          break;
        case " ":
          setFocus(xFocus, yFocus, !across);
          break;
        case "ArrowRight":
          for (let i = xFocus + 1; i < cols; i++) {
            if (dataSet[yFocus][i]) {
              setFocus(i, yFocus, true);
              break;
            }
          }
          break;
        case "ArrowLeft":
          for (let i = xFocus - 1; i >= 0; i--) {
            if (dataSet[yFocus][i]) {
              setFocus(i, yFocus, true);
              break;
            }
          }
          break;
        case "ArrowUp":
          for (let i = yFocus - 1; i >= 0; i--) {
            if (dataSet[i][xFocus]) {
              setFocus(xFocus, i, false);
              break;
            }
          }
          break;
        case "ArrowDown":
          for (let i = yFocus + 1; i < dataSet.length; i++) {
            if (dataSet[i][xFocus]) {
              setFocus(xFocus, i, false);
              break;
            }
          }
          break;
        case "Backspace":
          handleBackspace();
          break;
        default:
          break;
      }
    }
  }

  // Set focus to the first square associated with a given clue
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

  // Skip to the first square of the next or previous clue, switching direction as necessary
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

  // Remove input and navigate backwards
  function handleBackspace() {
    const currentInput = dataSet[yFocus][xFocus]?.input;
    if (currentInput && !dataSet[yFocus][xFocus]?.disabled) {
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
          ? dataSet[yFocus][xFocus - 1] &&
            !dataSet[yFocus][xFocus - 1]?.disabled
          : dataSet[yFocus - 1] &&
            dataSet[yFocus - 1][xFocus] &&
            !dataSet[yFocus - 1][xFocus]?.disabled
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
