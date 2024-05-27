import ClueList from "./ClueList";

function Clues({ acrosses, downs, across, currentClue, focusClue }) {
  return (
    <div style={{ display: "flex", width: "33%" }}>
      <ClueList
        clues={acrosses}
        across={across}
        currentClue={currentClue}
        direction={"across"}
        focusClue={focusClue}
      ></ClueList>
      <ClueList
        clues={downs}
        across={across}
        currentClue={currentClue}
        direction={"down"}
        focusClue={focusClue}
      ></ClueList>
    </div>
  );
}

export default Clues;
