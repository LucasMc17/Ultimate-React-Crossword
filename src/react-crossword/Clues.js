import ClueList from "./ClueList";

function Clues({
  acrosses,
  downs,
  across,
  currentClue,
  focusClue,
  selectedSquareColor,
  selectedClueColor,
  clueMenuClassnames,
  clueListClassnames,
  clueClassnames,
}) {
  return (
    <div
      style={{ display: "flex", width: "33%" }}
      className={clueMenuClassnames}
    >
      <ClueList
        clues={acrosses}
        across={across}
        currentClue={currentClue}
        direction={"across"}
        focusClue={focusClue}
        selectedSquareColor={selectedSquareColor}
        selectedClueColor={selectedClueColor}
        clueListClassnames={clueListClassnames}
        clueClassnames={clueClassnames}
      ></ClueList>
      <ClueList
        clues={downs}
        across={across}
        currentClue={currentClue}
        direction={"down"}
        focusClue={focusClue}
        selectedSquareColor={selectedSquareColor}
        selectedClueColor={selectedClueColor}
        clueListClassnames={clueListClassnames}
        clueClassnames={clueClassnames}
      ></ClueList>
    </div>
  );
}

export default Clues;
