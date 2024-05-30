function SVGElement({ type, x1, x2, y1, y2, d }) {
  if (type === "line") {
    return <line x1={x1} x2={x2} y1={y1} y2={y2} />;
  } else if (type === "path") {
    return <path d={d} stroke="black" fill="none" />;
  }
}

export default SVGElement;
