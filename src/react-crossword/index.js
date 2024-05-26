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

        if (
          currentSquare &&
          (y === 0 || x === 0 || !data[y - 1][x] || !data[y][x - 1])
        ) {
          currentSquare.displayNum = num;
          num++;
        }
      }
    }
    console.log(num);
  }

  getClueMap();

  const [across, setAcross] = useState(true);
  const [xFocus, setXFocus] = useState(null);
  const [yFocus, setYFocus] = useState(null);
  const [answerMap, setAnswerMap] = useState(
    data.map((row) => row.map((cell) => (cell ? { answer: "" } : null))),
  );

  function toggleDirection() {
    setAcross(!across);
  }

  function setFocus(x, y) {
    console.log(x, y);
    if (data[y]) {
      if (data[y][x]) {
        setXFocus(x);
        setYFocus(y);
      }
    }
  }
  console.log(answerMap);

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
        across ? setFocus(xFocus + 1, yFocus) : setFocus(xFocus, yFocus + 1);
      }}
      tabIndex="0"
    >
      {data.map((row, y) => (
        <div style={{ width: "100%", display: "flex" }}>
          {row.map((cell, x) => (
            <Square
              size={size}
              data={cell}
              revealAnswers={revealAnswers}
              focus={y === yFocus && x === xFocus}
              y={y}
              x={x}
              input={answerMap[y][x]?.answer}
              setFocus={setFocus}
              toggleDirection={toggleDirection}
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
