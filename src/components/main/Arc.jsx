import ArcSlider from "../../lib/gauge";

export default function Arc({ currentdB }) {
  // const sliders = [
  //   {
  //     // ✅ 공통: 값 범위 및 초기값
  //     radius: 50, // 게이지 반지름
  //     min: 0, // 최소값
  //     max: 30, // 최대값
  //     step: 1, // 값 증가 단위
  //     initialValue: currentdB, // 초기값 (현재 dB)
  //     valueColor:
  //       currentdB > 19
  //         ? "	rgba(255, 0, 55, 0.95)" // 위험 - 빨강
  //         : currentdB > 9
  //         ? "rgba(253, 242, 0, 0.95)" // 주의 - 주황
  //         : "	rgba(57, 255, 20, 0.9)", // 정상 - 하늘색
  //     arcBgFractionColor: "rgba(0, 0, 0, 0.2)", // 배경 게이지 색상
  //     // ✅ 게이지 모양 설정
  //     backgroundAngle: 270, // 배경 아크 각도
  //     arcFractionSpacingRatio: 0.45, // 게이지 조각 간 간격 비율
  //     arcFractionLength: 3, // 조각 가로 길이
  //     arcFractionThickness: 18, // 조각 세로 길이
  //     // ✅ 기타
  //     displayName: "Current value", // 디버깅용 이름
  //   },
  //   {
  //     radius: 67,
  //     min: 0,
  //     max: 50,
  //     step: 1,
  //     initialValue: (currentdB / 270) * 90,
  //     valueColor: "rgba(0, 254, 202, 0.95)",
  //     arcBgFractionColor: "rgba(0, 0, 0, 0.3)",
  //     backgroundAngle: 90,
  //     arcFractionSpacingRatio: 0.7,
  //     arcFractionLength: 1,
  //     arcFractionThickness: 5,
  //     displayName: "sub value",
  //   },
  //   {
  //     backgroundAngle: 270,
  //     radius: 60,
  //     min: 0,
  //     max: 30,
  //     step: 1,
  //     initialValue: currentdB,
  //     handleFillColor: "#ffff", // 핸들 내부 색
  //     strokeColor: "rgba(0, 0, 0, 0.2)", //보더
  //     strokeThickness: 1,
  //     arcBgFractionColor: "",
  //     displayName: "Max",
  //   },
  // ];

  return (
    <div>
      <ArcSlider currentdB={currentdB} />
    </div>
  );
}
