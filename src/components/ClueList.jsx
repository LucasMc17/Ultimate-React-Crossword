import Clue from "./Clue.jsx";

function ClueList({
  clues,
  across,
  currentClue,
  direction,
  focusClue,
  selectedSquareColor,
  selectedClueColor,
  clueListClassnames,
  clueClassnames,
}) {
  return (
    <div
      style={{ width: "50%", height: "100%" }}
      className={clueListClassnames}
    >
      <h1
        style={{
          margin: "0",
        }}
      >
        {direction === "across" ? "ACROSS" : "DOWN"}
      </h1>
      <div style={{ overflow: "scroll", height: "90%" }}>
        {clues.map((clue, i) => {
          const isSelected =
            direction === "across"
              ? across && currentClue === clue.num
              : !across && currentClue === clue.num;
          return (
            <Clue
              key={i}
              isSelected={isSelected}
              focusClue={focusClue}
              clue={clue}
              direction={direction}
              selectedSquareColor={selectedSquareColor}
              selectedClueColor={selectedClueColor}
              clueClassnames={clueClassnames}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ClueList;
