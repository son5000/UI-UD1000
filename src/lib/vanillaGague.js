// ✅ ArcSlider 함수 (React 없이 바닐라 JS로 구현)
// - width, height, currentdB 값을 인자로 받아 SVG 게이지를 렌더링합니다
// - DOM 요소를 직접 생성하고 조작하며, React의 useRef/useEffect 없이 구성

function ArcSlider({ container, width = 150, height = 150, currentdB }) {
  // SVG를 삽입할 대상 컨테이너가 필요
  if (!container) return;
  container.innerHTML = ""; // 기존 내용 비우기

  const cx = width / 2;
  const cy = height / 2;
  const tau = 2 * Math.PI; // 360도 표현용

  const defaultArcFractionSpacingRatio = 0.45;
  const defaultArcFractionLength = 3;
  const defaultArcFractionThickness = 18;

  const sliders = [
    // current dB
    {
      radius: 50,
      min: 0,
      max: 30,
      step: 1,
      initialValue: currentdB,
      valueColor: "rgba(0,145,255,1)",
      arcBgFractionColor: "rgba(0, 0, 0, 0.2)",
      backgroundAngle: 270,
      arcFractionSpacingRatio: 0.45,
      arcFractionLength: 3,
      arcFractionThickness: 18,
    },
    // sub 항목 미정
    {
      radius: 67,
      min: 0,
      max: 50,
      step: 1,
      initialValue: (currentdB / 270) * 90,
      valueColor: "#39FF14",
      arcBgFractionColor: "rgba(0, 0, 0, 0.3)",
      backgroundAngle: 90,
      arcFractionSpacingRatio: 0.7,
      arcFractionLength: 1,
      arcFractionThickness: 5,
    },
    // Max
    {
      backgroundAngle: 270,
      radius: 60,
      min: 0,
      max: 30,
      step: 1,
      initialValue: currentdB,
      handleFillColor: "#faed27",
      strokeColor: "rgba(0, 0, 0, 0.2)",
      strokeThickness: 1,
      arcBgFractionColor: "",
    },
  ];

  const calculateSpacing = (circumference, length, ratio) => {
    const num = Math.floor((circumference / length) * ratio);
    const total = circumference - num * length;
    return total / num;
  };

  const polarToCartesian = (cx, cy, r, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(" ");
  };

  const addGlowFilter = (svg) => {
    if (svg.querySelector("#glow")) return;
    const ns = "http://www.w3.org/2000/svg";
    const defs = document.createElementNS(ns, "defs");
    const filter = document.createElementNS(ns, "filter");
    filter.setAttribute("id", "glow");
    filter.setAttribute("x", "-50%");
    filter.setAttribute("y", "-50%");
    filter.setAttribute("width", "200%");
    filter.setAttribute("height", "200%");
    filter.setAttribute("filterUnits", "userSpaceOnUse");

    const blur = document.createElementNS(ns, "feGaussianBlur");
    blur.setAttribute("stdDeviation", "2");
    blur.setAttribute("result", "blur");

    const colorMatrix = document.createElementNS(ns, "feColorMatrix");
    colorMatrix.setAttribute("in", "blur");
    colorMatrix.setAttribute("type", "matrix");
    colorMatrix.setAttribute(
      "values",
      `1 0 0 0 0
       0 1 0 0 0
       0 0 1 0 0
       0 0 0 1.3 0`
    );
    colorMatrix.setAttribute("result", "coloredBlur");

    const merge = document.createElementNS(ns, "feMerge");
    const node1 = document.createElementNS(ns, "feMergeNode");
    node1.setAttribute("in", "coloredBlur");
    const node2 = document.createElementNS(ns, "feMergeNode");
    node2.setAttribute("in", "SourceGraphic");

    merge.appendChild(node1);
    merge.appendChild(node2);
    filter.appendChild(blur);
    filter.appendChild(colorMatrix);
    filter.appendChild(merge);
    defs.appendChild(filter);
    svg.appendChild(defs);
  };

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  container.appendChild(svg);
  addGlowFilter(svg);

  sliders.forEach((slider, i) => {
    const {
      radius = 50,
      min = 0,
      max = 30,
      initialValue = 0,
      valueColor = "",
      backgroundAngle = 270,
      arcFractionSpacingRatio,
      arcFractionLength,
      arcFractionThickness,
      arcBgFractionColor,
    } = slider;

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute(
      "transform",
      `rotate(${i === 1 ? -100 : -135},${cx},${cy})`
    );
    svg.appendChild(group);

    const drawArc = (
      parent,
      radius,
      angle,
      color,
      spacingRatio,
      length,
      thickness,
      glow = false
    ) => {
      const spacing = calculateSpacing(radius * tau, length, spacingRatio);
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("d", describeArc(cx, cy, radius, 0, angle));
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", color);
      path.setAttribute("stroke-width", thickness);
      path.setAttribute("stroke-dasharray", `${length} ${spacing}`);
      if (glow) path.setAttribute("filter", "url(#glow)");
      parent.appendChild(path);
    };

    const drawHandle = (
      parent,
      radius,
      angle,
      fillColor,
      strokeColor = "#ffffff",
      strokeWidth = 1
    ) => {
      const rad = (angle * tau) / 360;
      const x1 = cx + radius * Math.cos(rad - tau / 4);
      const y1 = cy + radius * Math.sin(rad - tau / 4);

      const size = 6;
      const angleOffset = (2 * Math.PI) / 3;
      const points = [...Array(3)].map((_, i) => {
        const a = rad + i * angleOffset;
        const px = x1 + size * Math.cos(a);
        const py = y1 + size * Math.sin(a);
        return `${px},${py}`;
      });

      const triangle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
      );
      triangle.setAttribute("points", points.join(" "));
      triangle.setAttribute("fill", fillColor);
      triangle.setAttribute("stroke", strokeColor);
      triangle.setAttribute("stroke-width", strokeWidth);
      triangle.setAttribute("transform", `rotate(-30,${x1},${y1})`);
      triangle.setAttribute("filter", "url(#glow)");
      parent.appendChild(triangle);
    };

    const angle = Math.floor((initialValue / (max - min)) * 270);

    drawArc(
      group,
      radius,
      backgroundAngle,
      arcBgFractionColor,
      arcFractionSpacingRatio,
      arcFractionLength,
      arcFractionThickness,
      false
    );

    drawArc(
      group,
      radius,
      angle,
      valueColor,
      arcFractionSpacingRatio,
      arcFractionLength,
      arcFractionThickness,
      true
    );

    if (i === 2) {
      drawHandle(
        group,
        radius,
        angle,
        slider.handleFillColor,
        slider.strokeColor,
        slider.strokeThickness
      );
    }
  });
}

// ✅ 사용 예시 (HTML 내에서):
{
  /* <div id="myGauge"></div>
<script>
  ArcSlider({ container: document.getElementById("myGauge"), width: 200, height: 200, currentdB: 18 });
</script> */
}
