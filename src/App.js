import Crossword, {
  examplePuzzleFull,
  examplePuzzleShort,
} from "./react-crossword";

const onInput = (x, y, input, crosswordData) => {
  console.log("SOMEONE IS INPUTTING");
  // console.log(input);
  // console.log(crosswordData);
  // console.log(x);
  // console.log(y);
  // return crosswordData.map((row) =>
  //   row.map((col) => (col ? { ...col, input } : col)),
  // );
};

const onCellCorrect = (x, y, input, crosswordData) => {
  console.log("THAT CELL IS CORRECT");
  // console.log(input);
  // console.log(crosswordData);
  // console.log(x);
  // console.log(y);
  // return crosswordData.map((row) =>
  //   row.map((col) => (col ? { ...col, input: "CORRECT" } : col)),
  // );
};

const onClueCorrect = (clueNum, direction, crosswordData) => {
  console.log("THAT CLUE IS CORRECT");
  return crosswordData.map((row, y) =>
    row.map((cell, x) =>
      direction === "across"
        ? cell && cell.acrossNum === clueNum
          ? { ...cell, disabled: true }
          : cell
        : cell && cell.downNum === clueNum
        ? { ...cell, disabled: true }
        : cell,
    ),
  );
  // console.log(clueNum);
  // console.log(direction);
  // console.log(crosswordData);
  // return crosswordData.map((row) =>
  //   row.map((col) => (col ? { ...col, input: "CORRECT" } : col)),
  // );
};

const onPuzzleFinished = (crosswordData) => {
  console.log("THE PUZZLE IS FINISHED");
};

const onPuzzleCorrect = (crosswordData) => {
  console.log("THE PUZZLE IS CORRECT");
};

function App() {
  return (
    <div className="App">
      <Crossword
        data={examplePuzzleShort.grid}
        revealAnswers={false}
        acrosses={examplePuzzleShort.acrosses}
        downs={examplePuzzleShort.downs}
        onInput={onInput}
        onCellCorrect={onCellCorrect}
        onClueCorrect={onClueCorrect}
        onPuzzleFinished={onPuzzleFinished}
        onPuzzleCorrect={onPuzzleCorrect}
        // crosswordStyle={{
        //   backgroundColor: "blue",
        // }}
        // puzzleStyle={{
        //   backgroundColor: "red",
        // }}
        // squareStyle={{
        //   backgroundColor: "green",
        //   borderRadius: "10px",
        // }}
        // selectedSquareColor={"cyan"}
        // selectedClueColor={"white"}
        // puzzleClassnames={"hello"}
        // crosswordClassnames={"world"}
        // squareClassnames={"I-am-a-square"}
        // clueMenuClassnames={"I am the clue menu"}
        // clueListClassnames={"I am a list of clues"}
        // clueClassnames={"I am a clue!"}
      />
      <Crossword
        data={examplePuzzleFull.grid}
        // revealAnswers={true}
        acrosses={examplePuzzleFull.acrosses}
        downs={examplePuzzleFull.downs}
        // onInput={onInput}
        // onCellCorrect={onCellCorrect}
        // onClueCorrect={onClueCorrect}
        // squareStyle={{ backgroundColor: "gray" }}
      />
    </div>
  );
}

export default App;
