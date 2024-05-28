import logo from "./logo.svg";
import "./App.css";
import Crossword from "./react-crossword";
import {
  grid,
  exampleAcrosses,
  exampleDowns,
} from "./react-crossword/utils/exampleData";

// const dataArray = [null, { answer: "A" }, {}, {}, {}, {}, {}, {}, {}, {}];
const dataArray = [
  // [null, { answer: "A" }, { answer: "B" }, { answer: "C" }, null],
  // [{ answer: "E" }, { answer: "1" }, null, { answer: "D" }, { answer: "A" }],
  // [null, { answer: "F" }, { answer: "G" }, { answer: "ABC" }, null],
  // [null, { answer: "F" }, { answer: "GFEEEEEE" }, { answer: "ABC" }, null],
  [{ answer: "S" }, { answer: "A" }, { answer: "G" }, { answer: "E" }, null],
  [
    { answer: "P" },
    { answer: "L" },
    { answer: "A" },
    { answer: "N" },
    { answer: "T" },
  ],
  [
    { answer: "E" },
    { answer: "L" },
    { answer: "U" },
    { answer: "D" },
    { answer: "E" },
  ],
  [
    { answer: "W" },
    { answer: "I" },
    { answer: "Z" },
    { answer: "E" },
    { answer: "N" },
  ],
  [
    { answer: "S" },
    { answer: "E" },
    { answer: "E" },
    { answer: "D" },
    { answer: "S" },
  ],
];

const acrosses = [
  { num: 1, clue: "Parsley, ___, rosemary and thyme" },
  { num: 5, clue: "Garden Growth" },
  { num: 7, clue: "Synonym of 'evade' and 'avoid'" },
  { num: 8, clue: "Shrivel up with age" },
  { num: 9, clue: "Germs spread by a gardener?" },
];

const downs = [
  { num: 1, clue: "Shoots out, as lava" },
  { num: 2, clue: "Nickname for Alexandra" },
  { num: 3, clue: "Bandage material" },
  { num: 4, clue: "Brought to a close" },
  { num: 6, clue: "Big bills for a vending machine" },
];

function App() {
  return (
    <div className="App">
      {/* <Crossword
        rows={2}
        columns={5}
        data={dataArray}
        revealAnswers={false}
        acrosses={acrosses}
        downs={downs}
      /> */}
      <Crossword
        rows={15}
        columns={15}
        data={grid}
        revealAnswers={false}
        acrosses={exampleAcrosses}
        downs={exampleDowns}
      />
    </div>
  );
}

export default App;
