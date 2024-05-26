function SVGElement({ type, x1, x2, y1, y2, d }) {
  if (type === "line") {
    return <line x1={x1} x2={x2} y1={y1} y2={y2} stroke="black" />;
  } else if (type === "path") {
    return <path d={d} stroke="black" fill="none" />;
  }

  //   <path
  //     width="150px"
  //     height="200px"
  //     d="M72.3,171.5c0,0-45.6,1.1-48.5-69.9c-0.9-21.9-0.2-65.4,50.2-70c0,0,53-3.2,52.8,70C126.8,101.6,128.8,173.7,72.3,171.5z"
  //     class="c-path"
  //     stroke="hsl(70, 35%, 60%)"
  //     style="display: block; stroke-dasharray: 390.855, 390.855; stroke-dashoffset: 0; opacity: 1;"
  //   ></path>;
}

export default SVGElement;
