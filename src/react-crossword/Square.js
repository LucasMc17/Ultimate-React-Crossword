import Letter from "./Letter";
import { useState } from "react";

function Square({
  size,
  data,
  revealAnswers,
  focus,
  y,
  x,
  setFocus,
  input,
  toggleDirection,
}) {
  console.log(input);
  if (!data) {
    return (
      <square
        style={{
          backgroundColor: "black",
          border: "3px solid black",
          width: size,
          height: "0px",
          paddingTop: size,
        }}
      ></square>
    );
  }
  return (
    <square
      style={{
        backgroundColor: focus ? "blue" : "white",
        border: "3px solid black",
        width: size,
        height: "0px",
        paddingTop: size,
        position: "relative",
      }}
      onClick={() => {
        focus ? toggleDirection() : setFocus(x, y);
      }}
      //   onFocus={() => setFocus(x, y)}
    >
      {data.displayNum ? (
        <small
          style={{
            fontSize: "14px",
            position: "absolute",
            left: "2px",
            top: "2px",
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
          height: "90%",
          zIndex: "0",
          position: "absolute",
          bottom: "5%",
          left: 0,
          display: "flex",
        }}
      >
        {input ? (
          <>
            {input.split("").map((char) => (
              <Letter char={char} answer={false} />
            ))}
          </>
        ) : (
          <></>
        )}
        {revealAnswers ? (
          <>
            {data.answer.split("").map((char) => (
              <Letter char={char} answer={true} />
            ))}
          </>
        ) : (
          <></>
        )}
      </div>
    </square>
  );
}

export default Square;
