import alphabet from "../utils/alphabet.json";
import SVGElement from "./SVGElement.jsx";

function Letter({ char, answer }) {
  const data = alphabet[char];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="black"
      viewBox={data.viewBox}
      strokeWidth={0.1}
      stroke="black"
      style={{
        width: "100%",
        opacity: answer ? "0.5" : "1",
      }}
    >
      {data.elements.map((datum, i) => (
        <SVGElement
          key={i}
          type={datum.type}
          x1={datum.x1}
          x2={datum.x2}
          y1={datum.y1}
          y2={datum.y2}
          d={datum.d}
        />
      ))}
    </svg>
  );
}

export default Letter;
