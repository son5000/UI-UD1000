// React의 useEffect, useRef 훅 가져오기
import { useEffect, useRef } from "react";

// ArcSlider 컴포넌트 정의
export default function ArcSlider({
  sliders,
  width = 250,
  height = 250,
  currentdb,
}) {
  const containerRef = useRef(null); // SVG를 렌더링할 DOM 참조를 위한 ref 생성

  useEffect(() => {
    if (!containerRef.current) return; // ref가 유효하지 않으면 중단
    containerRef.current.innerHTML = ""; // 이전 렌더링된 내용을 비움

    const cx = width / 2; // 중심 X 좌표
    const cy = height / 2; // 중심 Y 좌표
    const tau = 2 * Math.PI; // 원 둘레(2π), 360도 표현용

    // 기본 arc 스타일 값들 정의
    const defaultArcFractionSpacingRatio = 0.9; // arc 간격 비율 기본값
    const defaultArcFractionLength = 1.8; // arc 조각 길이 기본값
    const defaultArcFractionThickness = 15; // arc 두께 기본값
    const defaultArcBgFractionColor = "#ffdd33"; // 배경 arc 색상 기본값

    // arc 간격 계산 함수
    const calculateSpacing = (circumference, length, ratio) => {
      const num = Math.floor((circumference / length) * ratio); // 몇 개의 arc 조각이 들어갈지 계산
      const total = circumference - num * length; // 남는 공간 계산
      return total / num; // arc 조각 사이 간격 반환
    };

    // 각도를 x, y 좌표로 변환하는 함수
    const polarToCartesian = (cx, cy, r, angleInDegrees) => {
      const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0; // 각도를 라디안으로 변환
      return {
        x: cx + r * Math.cos(angleInRadians), // x 좌표 계산
        y: cy + r * Math.sin(angleInRadians), // y 좌표 계산
      };
    };

    // arc path를 SVG path 문자열로 생성
    const describeArc = (x, y, radius, startAngle, endAngle) => {
      const start = polarToCartesian(x, y, radius, endAngle); // 시작점 좌표
      const end = polarToCartesian(x, y, radius, startAngle); // 끝점 좌표
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"; // 반원이 넘는지 여부 플래그

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
      ].join(" "); // SVG path 명령 문자열로 반환
    };

    // 전체 SVG 요소 생성
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width); // SVG 너비 설정
    svg.setAttribute("height", height); // SVG 높이 설정
    containerRef.current.appendChild(svg); // container에 SVG 삽입

    // 각 슬라이더 데이터 순회하며 렌더링
    sliders.forEach((slider, i) => {
      // 슬라이더 속성 분해 및 기본값 지정
      const {
        radius = 50,
        min = 0,
        max = 30,
        step = 50,
        initialValue = 0,
        color = "",
        backgroundAngle = 270,
        valueAngle = 270,
        arcFractionSpacingRatio,
        arcFractionLength,
        arcFractionThickness,
        arcBgFractionColor,
      } = slider;
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

        const gaussianBlur = document.createElementNS(ns, "feGaussianBlur");
        gaussianBlur.setAttribute("stdDeviation", "1.8"); // 블러가 퍼지는 정도
        gaussianBlur.setAttribute("result", "blur");

        const colorMatrix = document.createElementNS(ns, "feColorMatrix");
        colorMatrix.setAttribute("in", "blur");
        colorMatrix.setAttribute("type", "matrix");
        colorMatrix.setAttribute(
          "values",
          `1 0 0 0 0
     0 1 0 0 0
     0 0 1 0 0
     0 0 0 1.4 0` // 블러 강도 조절
        );
        colorMatrix.setAttribute("result", "coloredBlur");

        const merge = document.createElementNS(ns, "feMerge");
        const mergeNode1 = document.createElementNS(ns, "feMergeNode");
        mergeNode1.setAttribute("in", "coloredBlur"); // 강조된 blur
        const mergeNode2 = document.createElementNS(ns, "feMergeNode");
        mergeNode2.setAttribute("in", "coloredBlur"); // 중복 강조
        const mergeNode3 = document.createElementNS(ns, "feMergeNode");
        mergeNode3.setAttribute("in", "SourceGraphic"); // 원본 그래픽

        merge.appendChild(mergeNode1);
        merge.appendChild(mergeNode2);
        merge.appendChild(mergeNode3);

        filter.appendChild(gaussianBlur);
        filter.appendChild(colorMatrix);
        filter.appendChild(merge);
        defs.appendChild(filter);
        svg.appendChild(defs);
      };

      addGlowFilter(svg); // 반드시 drawArc, drawHandle 전에!

      // arc를 실제 SVG에 그리는 함수
      const drawArc = (
        svg,
        radius,
        angle,
        color,
        spacingRatio = defaultArcFractionSpacingRatio,
        length = defaultArcFractionLength,
        thickness = defaultArcFractionThickness,
        isActive = false
      ) => {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        const spacing = calculateSpacing(radius * tau, length, spacingRatio);

        path.setAttribute("d", describeArc(cx, cy, radius, 0, angle));
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", color);
        path.setAttribute("stroke-width", thickness);
        path.setAttribute("stroke-dasharray", `${length} ${spacing}`);

        if (!isActive) {
          path.setAttribute("filter", "url(#glow)");
        }

        path.classList.add(
          isActive ? "sliderSinglePathActive" : "sliderSinglePath"
        );
        svg.appendChild(path);
      };

      const drawHandle = (
        svg,
        radius,
        angle,
        handleColor,
        strokeColor = "#ffffff",
        strokeThickness = 1,
        type = "line" // "line", "dot", "triangle"
      ) => {
        addGlowFilter(svg);
        const rad = (angle * tau) / 360;
        const x1 = cx + radius * Math.cos(rad - tau / 4);
        const y1 = cy + radius * Math.sin(rad - tau / 4);

        if (type === "triangle") {
          const size = 6; // 삼각형 크기
          const angleOffset = (2 * Math.PI) / 3; // 120도 간격

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
          triangle.setAttribute("fill", handleColor);
          triangle.setAttribute("stroke", strokeColor);
          triangle.setAttribute("stroke-width", strokeThickness);
          triangle.setAttribute("transform", `rotate(-30,${x1},${y1})`);
          // triangle.setAttribute("filter", "url(#glow)");
          svg.appendChild(triangle);
        } else {
          const lineLength = 20;
          const x2 = cx + (radius + lineLength) * Math.cos(rad - tau / 4);
          const y2 = cy + (radius + lineLength) * Math.sin(rad - tau / 4);

          const strokeLine = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
          );
          strokeLine.setAttribute("x1", x1);
          strokeLine.setAttribute("y1", y1);
          strokeLine.setAttribute("x2", x2);
          strokeLine.setAttribute("y2", y2);
          strokeLine.setAttribute("stroke", strokeColor);
          strokeLine.setAttribute("stroke-linecap", "round");
          strokeLine.setAttribute("stroke-width", 5 + strokeThickness * 2);

          svg.appendChild(strokeLine);

          const line = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
          );
          line.setAttribute("x1", x1);
          line.setAttribute("y1", y1);
          line.setAttribute("x2", x2);
          line.setAttribute("y2", y2);
          line.setAttribute("stroke", handleColor);
          line.setAttribute("stroke-width", 3);
          // line.setAttribute("filter", "url(#glow)");
          svg.appendChild(line);
        }
      };

      // 슬라이더 초기값을 각도로 변환 (270도 기준)
      const initialAngle = Math.floor((initialValue / (max - min)) * 270);

      // 그룹 요소 생성 (슬라이더 하나의 묶음)
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

      // 그룹 회전 설정 (i에 따라 다름)
      if (i === 2 || i === 6) {
        group.setAttribute("transform", `rotate(-100,${cx},${cy})`);
      } else {
        group.setAttribute("transform", `rotate(-135,${cx},${cy})`);
      }

      svg.appendChild(group); // SVG에 그룹 추가

      // 배경 arc 그리기
      drawArc(
        group,
        radius,
        backgroundAngle,
        i === 0 || i === 2
          ? arcBgFractionColor ?? defaultArcBgFractionColor
          : "transparent",
        arcFractionSpacingRatio,
        arcFractionLength,
        arcFractionThickness,
        i < 4 ? true : false
      );

      // 현재 값 arc 그리기
      drawArc(
        group,
        radius,
        initialAngle,
        color,
        arcFractionSpacingRatio,
        arcFractionLength,
        arcFractionThickness,
        i < 4 ? true : false
      );

      // if (i !== 0 && i !== 2 && i !== 4 && i !== 6) {
      //   const handleType = i === 1 || i === 5 ? "line" : "triangle"; // i==1 → 선, i==3 → 삼각형

      //   drawHandle(
      //     group,
      //     radius,
      //     initialAngle,
      //     slider.handleFillColor,
      //     slider.strokeColor ?? "#ffffff",
      //     slider.strokeThickness,
      //     handleType // <- 새로 추가된 인자
      //   );
      // }
    });
  }, [sliders, width, height]); // 슬라이더나 사이즈가 바뀔 때마다 재실행

  return <div ref={containerRef} />; // SVG가 들어갈 div 반환
}
