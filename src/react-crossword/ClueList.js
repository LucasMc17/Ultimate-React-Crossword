function ClueList({ clues, across, currentClue, direction, focusClue }) {
  return (
    <div style={{ width: "50%" }}>
      <h1>{direction === "across" ? "ACROSS" : "DOWN"}</h1>
      {clues.map((clue) => {
        const isSelected =
          direction === "across"
            ? across && currentClue === clue.num
            : !across && currentClue === clue.num;
        return (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              color: isSelected ? "white" : "black",
              margin: "5px 0",
            }}
            onClick={() => focusClue(clue.num, direction === "across")}
          >
            <div
              style={{
                backgroundColor: isSelected ? "blue" : "transparent",
                height: "100%",
              }}
            >
              <p style={{ margin: "0" }}>{clue.num}.</p>
            </div>
            <div
              style={{
                textAlign: "left",
                padding: "0px 4px",
                backgroundColor: isSelected ? "lightblue" : "transparent",
              }}
            >
              <p style={{ margin: "0" }}>{clue.clue}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ClueList;
