import Square from "./Square";
import { useState } from "react";

function Crossword({ rows, columns, data, revealAnswers }) {
  const cols = data[0].length;
  //   if (data.length !== rows * columns) {
  //     throw "Data Array must be of length equal to the number of rows multiplied by columns!";
  //   }
  //   const size = `calc(${100 / columns}% - 6px)`;
  const size = `calc(${100 / cols}% - 6px)`;

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

  return (
    <div
      style={{ width: "100%", backgroundColor: "black" }}
      onKeyDown={(char) => {
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
      }}
      tabIndex="0"
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
      <h1 style={{ color: "white" }}>{across ? "across" : "down"}</h1>
    </div>
  );

  //   return (
  //     <div style={{ width: "100%", backgroundColor: "black" }}>
  //       {[...Array(rows)].map((row) => {
  //         return (
  //           <div style={{ width: "100%", display: "flex" }} id="ROW">
  //             {[...Array(columns)].map((col) => {
  //               return <Square size={size} />;
  //             })}
  //           </div>
  //         );
  //       })}
  //     </div>
  //   );
}

export default Crossword;
