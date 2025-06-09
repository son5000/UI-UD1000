// React의 useEffect, useRef 훅 가져오기
import { useEffect, useRef } from "react";

// ArcSlider 컴포넌트 정의
export default function ArcSlider({ currentdB, width = 150, height = 150 }) {
  const containerRef = useRef(null); // SVG를 렌더링할 DOM 참조를 위한 ref 생성

  const sliders = [
    {
      // ✅ 공통: 값 범위 및 초기값
      radius: 50, // 게이지 반지름
      min: 0, // 최소값
      max: 30, // 최대값
      step: 1, // 값 증가 단위
      initialValue: currentdB, // 초기값 (현재 dB)
      valueColor: "#2dd9fe",
      glowColor: "#00a3d5",
      // valueColor: "#FF53cd",
      // glowColor: "#e10361",
      // valueColor: "#FF5161",
      // glowColor: "#D30302",
      // valueColor: "#9461fd",
      // glowColor: "#4003e6",
      arcBgFractionColor: "rgba(0, 0, 0, 0.2)", // 배경 게이지 색상
      // ✅ 게이지 모양 설정
      backgroundAngle: 270, // 배경 아크 각도
      arcFractionSpacingRatio: 0.45, // 게이지 조각 간 간격 비율
      arcFractionLength: 3, // 조각 가로 길이
      arcFractionThickness: 18, // 조각 세로 길이
      // ✅ 기타
      displayName: "Current value", // 디버깅용 이름
    },
    {
      radius: 67,
      min: 0,
      max: 50,
      step: 1,
      initialValue: (currentdB / 270) * 90,
      valueColor: "#00fe9b",
      glowColor: "#168534",
      arcBgFractionColor: "rgba(0, 0, 0, 0.3)",
      backgroundAngle: 90,
      arcFractionSpacingRatio: 0.7,
      arcFractionLength: 1,
      arcFractionThickness: 5,
      displayName: "sub value",
    },
    {
      backgroundAngle: 270,
      radius: 60,
      min: 0,
      max: 30,
      step: 1,
      initialValue: currentdB - 3,
      handleFillColor: "#ffdb4e", // 핸들 내부 색
      strokeColor: "#b48505", //보더
      strokeThickness: 1,
      arcBgFractionColor: "",
      displayName: "Max",
    },
  ];

  useEffect(() => {
    if (!containerRef.current) return; // ref가 유효하지 않으면 중단
    containerRef.current.innerHTML = ""; // 이전 렌더링된 내용을 비움

    const cx = width / 2; // 중심 X 좌표
    const cy = height / 2; // 중심 Y 좌표
    const tau = 2 * Math.PI; // 원 둘레(2π), 360도 표현용

    // 기본 arc 스타일 값들 정의
    const defaultArcFractionSpacingRatio = 0.45; // arc 간격 비율 기본값
    const defaultArcFractionLength = 3; // arc 조각 길이 기본값
    const defaultArcFractionThickness = 18; // arc 두께 기본값

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

    // const addGlowFilter = (svg) => {
    //   if (svg.querySelector("#glow")) return;
    //   const ns = "http://www.w3.org/2000/svg";
    //   const defs = document.createElementNS(ns, "defs");
    //   const filter = document.createElementNS(ns, "filter");
    //   filter.setAttribute("id", "glow");
    //   filter.setAttribute("x", "-50%");
    //   filter.setAttribute("y", "-50%");
    //   filter.setAttribute("width", "200%");
    //   filter.setAttribute("height", "200%");
    //   filter.setAttribute("filterUnits", "userSpaceOnUse");

    //   const gaussianBlur = document.createElementNS(ns, "feGaussianBlur");
    //   gaussianBlur.setAttribute("stdDeviation", "2"); // 블러가 퍼지는 정도
    //   gaussianBlur.setAttribute("result", "blur");

    //   const colorMatrix = document.createElementNS(ns, "feColorMatrix");
    //   colorMatrix.setAttribute("in", "blur");
    //   colorMatrix.setAttribute("type", "matrix");
    //   colorMatrix.setAttribute(
    //     "values",
    //     `1 0 0 0 0
    //      0 1 0 0 0
    //      0 0 1 0 0
    //      0 0 0 1.3 0` // 블러 강도 조절
    //   );
    //   colorMatrix.setAttribute("result", "coloredBlur");

    //   const merge = document.createElementNS(ns, "feMerge");
    //   const mergeNode1 = document.createElementNS(ns, "feMergeNode");
    //   mergeNode1.setAttribute("in", "coloredBlur"); // 강조된 blur
    //   const mergeNode2 = document.createElementNS(ns, "feMergeNode");
    //   mergeNode2.setAttribute("in", "SourceGraphic"); // 원본 그래픽

    //   merge.appendChild(mergeNode1);
    //   merge.appendChild(mergeNode2);

    //   filter.appendChild(gaussianBlur);
    //   filter.appendChild(colorMatrix);
    //   filter.appendChild(merge);
    //   defs.appendChild(filter);
    //   svg.appendChild(defs);
    // };

    // addGlowFilter(svg); // 반드시 drawArc, drawHandle 전에!

    // arc를 실제 SVG에 그리는 함수

    const addGlowFilter = (
      svg,
      id,
      color = "#0ff",
      alphaStrength = 2,
      blurAmount = 1.5
    ) => {
      if (svg.querySelector(`#${id}`)) return;

      const ns = "http://www.w3.org/2000/svg";
      const defs =
        svg.querySelector("defs") || document.createElementNS(ns, "defs");
      if (!svg.contains(defs)) svg.appendChild(defs);

      const filter = document.createElementNS(ns, "filter");
      filter.setAttribute("id", id);
      filter.setAttribute("x", "-50%");
      filter.setAttribute("y", "-50%");
      filter.setAttribute("width", "200%");
      filter.setAttribute("height", "200%");
      filter.setAttribute("filterUnits", "userSpaceOnUse");

      // 1️⃣ 블러 생성
      const gaussianBlur = document.createElementNS(ns, "feGaussianBlur");
      gaussianBlur.setAttribute("in", "SourceGraphic");
      gaussianBlur.setAttribute("stdDeviation", blurAmount); // ✅ 퍼짐 정도
      gaussianBlur.setAttribute("result", "blur");

      // 2️⃣ 알파 세기를 증폭시키는 colorMatrix
      const colorMatrix = document.createElementNS(ns, "feColorMatrix");
      colorMatrix.setAttribute("in", "blur");
      colorMatrix.setAttribute("type", "matrix");
      colorMatrix.setAttribute(
        "values",
        `1 0 0 0 0
     0 1 0 0 0
     0 0 1 0 0
     0 0 0 ${alphaStrength} 0` // ✅ 알파(세기) 조절
      );
      colorMatrix.setAttribute("result", "strongBlur");

      // 3️⃣ 색상 입히기
      const flood = document.createElementNS(ns, "feFlood");
      flood.setAttribute("flood-color", color);
      flood.setAttribute("flood-opacity", "1");
      flood.setAttribute("result", "flood");

      const composite = document.createElementNS(ns, "feComposite");
      composite.setAttribute("in", "flood");
      composite.setAttribute("in2", "strongBlur");
      composite.setAttribute("operator", "in");
      composite.setAttribute("result", "coloredGlow");

      // 4️⃣ 원본 + glow 병합
      const merge = document.createElementNS(ns, "feMerge");
      const mergeNode1 = document.createElementNS(ns, "feMergeNode");
      mergeNode1.setAttribute("in", "coloredGlow");
      const mergeNode2 = document.createElementNS(ns, "feMergeNode");
      mergeNode2.setAttribute("in", "SourceGraphic");

      merge.appendChild(mergeNode1);
      merge.appendChild(mergeNode2);

      // 필터 구성
      filter.appendChild(gaussianBlur);
      filter.appendChild(colorMatrix);
      filter.appendChild(flood);
      filter.appendChild(composite);
      filter.appendChild(merge);
      defs.appendChild(filter);
    };

    // 각 슬라이더 데이터 순회하며 렌더링
    sliders.forEach((slider, i) => {
      // 슬라이더 속성 분해 및 기본값 지정
      const {
        radius = 50, //게이지 반지름
        min = 0, //최소값
        max = 30, //최대값
        step = 1, // 값 증가 단위
        initialValue = 0, // 값
        valueColor = "", // 값 색상
        backgroundAngle = 270, // 배경아크 각도
        arcFractionSpacingRatio, // 아크 조각 간 간격 비율
        arcFractionLength, // 조각 가로 길이
        arcFractionThickness, // 조각 세로 길이
        arcBgFractionColor, // 아크 배경 색
        glowColor,
      } = slider;

      const drawArc = (
        svg,
        radius,
        angle,
        valueColor,
        spacingRatio = defaultArcFractionSpacingRatio,
        length = defaultArcFractionLength,
        thickness = defaultArcFractionThickness,
        isGlow = true,
        glowColor
      ) => {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        const spacing = calculateSpacing(radius * tau, length, spacingRatio);
        const glowId = `glow-filter-${i}`;
        if (isGlow) {
          addGlowFilter(svg, glowId, glowColor); // 🔧 오류 수정: 함수 직접 호출
          path.setAttribute("filter", `url(#${glowId})`); // ✅ path에 필터 적용
        }

        path.setAttribute("d", describeArc(cx, cy, radius, 0, angle));
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", valueColor);
        path.setAttribute("stroke-width", thickness);
        path.setAttribute("stroke-dasharray", `${length} ${spacing}`);
        svg.appendChild(path);
      };

      const drawHandle = (
        svg,
        radius,
        angle,
        handleColor,
        strokeColor = "#ffffff",
        strokeThickness = 1,
        type = "triangle" // "line", "triangle"
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
          triangle.setAttribute("filter", "url(#glow)");
          svg.appendChild(triangle);
        } else {
          return;
          // 아크위에 라인 모양 서브 값 표현
          // const lineLength = 20;
          // const x2 = cx + (radius + lineLength) * Math.cos(rad - tau / 4);
          // const y2 = cy + (radius + lineLength) * Math.sin(rad - tau / 4);
          // const strokeLine = document.createElementNS(
          //   "http://www.w3.org/2000/svg",
          //   "line"
          // );
          // strokeLine.setAttribute("x1", x1);
          // strokeLine.setAttribute("y1", y1);
          // strokeLine.setAttribute("x2", x2);
          // strokeLine.setAttribute("y2", y2);
          // strokeLine.setAttribute("stroke", strokeColor);
          // strokeLine.setAttribute("stroke-linecap", "round");
          // strokeLine.setAttribute("stroke-width", 5 + strokeThickness * 2);
          // svg.appendChild(strokeLine);
          // const line = document.createElementNS(
          //   "http://www.w3.org/2000/svg",
          //   "line"
          // );
          // line.setAttribute("x1", x1);
          // line.setAttribute("y1", y1);
          // line.setAttribute("x2", x2);
          // line.setAttribute("y2", y2);
          // line.setAttribute("stroke", handleColor);
          // line.setAttribute("stroke-width", 3);
          // line.setAttribute("filter", "url(#glow)");
          // svg.appendChild(line);
        }
      };

      // 슬라이더 초기값을 각도로 변환 (270도 기준)
      const initialAngle = Math.floor((initialValue / (max - min)) * 270);

      // 그룹 요소 생성 (슬라이더 하나의 묶음)
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

      // 그룹 회전 설정 (i에 따라 다름)
      if (i === 1) {
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
        arcBgFractionColor,
        arcFractionSpacingRatio,
        arcFractionLength,
        arcFractionThickness,
        false
      );

      // 현재 값 arc 그리기
      drawArc(
        group,
        radius,
        initialAngle,
        valueColor,
        arcFractionSpacingRatio,
        arcFractionLength,
        arcFractionThickness,
        true,
        glowColor
      );

      // Max 요소만 핸들표시 O
      if (i === 2) {
        const handleType = "triangle"; // max = triangle, avg = line
        drawHandle(
          group,
          radius,
          initialAngle,
          slider.handleFillColor,
          slider.strokeColor ?? "#ffffff",
          slider.strokeThickness,
          handleType // <- 새로 추가된 인자
        );
      }
    });
  }, [sliders, width, height]); // 슬라이더나 사이즈가 바뀔 때마다 재실행

  return <div ref={containerRef} />; // SVG가 들어갈 div 반환
}
