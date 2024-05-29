import Clue from "./Clue";

function ClueList({ clues, across, currentClue, direction, focusClue }) {
  return (
    <div style={{ width: "50%", height: "100%" }}>
      <h1
        style={{
          backgroundColor: "white",
          margin: "0",
        }}
      >
        {direction === "across" ? "ACROSS" : "DOWN"}
      </h1>
      <div style={{ overflow: "scroll", height: "90%" }}>
        {clues.map((clue) => {
          const isSelected =
            direction === "across"
              ? across && currentClue === clue.num
              : !across && currentClue === clue.num;
          return (
            <Clue
              isSelected={isSelected}
              focusClue={focusClue}
              clue={clue}
              direction={direction}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ClueList;
