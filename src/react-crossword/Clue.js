import { useRef } from "react";

function Clue({ isSelected, focusClue, clue, direction }) {
  const ref = useRef();

  const scrollToElement = () => {
    const { current } = ref;
    if (current) {
      const relativeTop =
        window.scrollY > current.parentNode.offsetTop
          ? window.scrollY
          : current.parentNode.offsetTop;
      current.parentNode.scrollTo({
        behavior: "smooth",
        top: current.offsetTop - relativeTop,
      });
    }
  };

  if (isSelected) {
    scrollToElement();
  }
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        color: isSelected ? "white" : "black",
        margin: "5px 0",
      }}
      ref={ref}
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
}

export default Clue;
