import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [currentdB, setCurrentdB] = useState(10);
  const [popupOpen, setPopupOpen] = useState(true);
  const [warningOutline, setWarningOutline] = useState(null);

  useEffect(() => {
    if (!popupOpen) {
      const timer1 = setTimeout(() => {
        setPopupOpen(true);
      }, 5000);

      return () => clearTimeout(timer1);
    }
  }, [popupOpen]);

  useEffect(() => {
    if (currentdB < 25) {
      const timer2 = setTimeout(() => {
        setCurrentdB((prev) => prev + 1);
      }, 100);

      return () => clearTimeout(timer2);
    } else {
      setCurrentdB(0);
    }
  }, [currentdB]);

  return (
    <div className="App">
      <div className="container">
        <div>
          <img src="/images/화면설계 샘플이미지v.2.png" alt="" />
          {popupOpen && <PopupGuide setPopupOpen={setPopupOpen} />}
          <div className="focus">
            <HalfDonutGauge percent={currentdB} />
            <strong
              className="mainValue
            "
            >
              {currentdB}dB
            </strong>
          </div>
          <WarningOutlineBox currentdB={currentdB} />
          <ValueOverlay />
          <CurrentMode />
        </div>
        <img src="/images/주요변경항목 정리.png" alt="" />
      </div>
    </div>
  );
}

export default App;

export function PopupGuide({ setPopupOpen }) {
  const [count, setCount] = useState(10);

  useEffect(() => {
    if (count === 0) {
      setPopupOpen(false);
      return;
    }

    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, setPopupOpen]);
  return (
    <div className="popupGuide">
      <p>Switch Camera Mode</p>
      <p>Select Frequency Range</p>
      <span>
        "Popup will close automatically in{" "}
        <span className="count10">{count}</span>
        seconds."
      </span>
    </div>
  );
}

const HalfDonutGauge = ({
  size = 100,
  thickness = 10,
  bgColor = "#ddd",
  percent = 50,
}) => {
  const innerRadius = size / 2 - thickness;

  // ✅ 0~20 범위 값을 0~100으로 스케일 변환
  const normalizedPercent = Math.min((percent / 20) * 100, 100);
  const color = interpolateColor(normalizedPercent); // 부드러운 색상 전환

  const style = {
    "--donut-size": `${size}px`,
    "--donut-color": color,
    "--donut-bg": bgColor,
    "--inner-radius": `${innerRadius}px`,
    "--percent": normalizedPercent,
  };

  return <div className="donut" style={style}></div>;
};

const interpolateColor = (p) => {
  // p: 0 ~ 100
  let r, g, b;

  if (p <= 50) {
    // 노랑 → 주황
    const ratio = p / 50;
    r = 255;
    g = 215 + (165 - 215) * ratio; // 215 → 165
    b = 0;
  } else {
    // 주황 → 빨강
    const ratio = (p - 50) / 50;
    r = 255;
    g = 165 * (1 - ratio); // 165 → 0
    b = 0;
  }

  return `rgb(${r}, ${g}, ${b})`;
};

const WarningOutlineBox = ({ currentdB }) => {
  if (currentdB < 15) return null;
  return <div className="WarningOutlineBox"></div>;
};

const ValueOverlay = () => {
  return (
    <ul className="valueOverlay">
      <li>
        <span>Avg</span>
        <strong>9dB</strong>
      </li>
      <li>
        <span>Max</span>
        <p>20.0dB</p>
      </li>
      <li>
        <span>
          <img src="/images/Hz.png" alt="" />
        </span>
        <p>23.31kHz</p>
      </li>
      <li>
        <span>
          <img src="/images/폭.png" alt="" />
        </span>
        <p>3.1m</p>
      </li>
      <li>
        <span>
          <img src="/images/온도.png" alt="" />
        </span>
        <p>21℃</p>
      </li>
    </ul>
  );
};

const CurrentMode = () => {
  return (
    <>
      <img className="currentMode" src="/images/elec.png" alt="" />
    </>
  );
};
