import Letter from "./Letter";

function Square({
  squareClassnames,
  size,
  data,
  revealAnswers,
  focus,
  y,
  x,
  setFocus,
  input,
  across,
  clueSelected,
  squareStyle,
  selectedSquareColor,
  selectedClueColor,
}) {
  if (!data) {
    return (
      <div
        style={{
          backgroundColor: "transparent",
          margin: "1px",
          width: size,
          height: "0px",
          paddingTop: size,
        }}
      ></div>
    );
  }
  return (
    <div
      className={squareClassnames}
      style={{
        margin: "1px",
        width: size,
        height: "0px",
        paddingTop: size,
        position: "relative",
        ...squareStyle,
        backgroundColor: focus
          ? selectedSquareColor || "#96a8ff"
          : clueSelected
          ? selectedClueColor || "#c2dfff"
          : squareStyle?.backgroundColor || "white",
      }}
      onClick={() => {
        setFocus(x, y, focus ? !across : across);
      }}
    >
      {data.displayNum ? (
        <small
          style={{
            fontSize: "10px",
            position: "absolute",
            left: "0px",
            top: "0px",
          }}
        >
          {data.displayNum}
        </small>
      ) : (
        <></>
      )}
      <div
        style={{
          width: "100%",
          height: "80%",
          zIndex: "0",
          position: "absolute",
          bottom: "7.5%",
          left: 0,
          display: "flex",
        }}
      >
        {input ? (
          <>
            {input.split("").map((char, i) => (
              <Letter char={char} answer={false} key={i} />
            ))}
          </>
        ) : (
          <></>
        )}
        {revealAnswers ? (
          <>
            {data.answer.split("").map((char, i) => (
              <Letter char={char} answer={true} key={i} />
            ))}
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Square;
