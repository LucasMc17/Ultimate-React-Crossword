import { alphabet, SVGElement } from "./utils";

function Letter({ char, answer }) {
  const data = alphabet[char];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="black"
      viewBox="0 0 150 200"
      strokeWidth={15}
      strokeLinecap="round"
      stroke="black"
      style={{
        width: "100%",
        opacity: answer ? "0.5" : "1",
      }}
    >
      {data.map((datum) => (
        <SVGElement
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
