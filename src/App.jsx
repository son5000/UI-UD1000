import "./App.css";
import { useEffect, useState } from "react";
import Scope from "./components/main/Scope";
import PopupGuide from "./components/main/PopupGuide";
import Gauge from "./components/main/Gauge";
import FrequencyRange from "./components/main/FrequencyRange";
import CameraMode from "./components/main/CameraMode";
import WarningOutline from "./components/main/WarningOutline";
import ValueList from "./components/main/ValueList";

function App() {
  const [currentdB, setCurrentdB] = useState(0);
  const [popupOpen, setPopupOpen] = useState(true);

  useEffect(() => {
    if (!popupOpen) {
      const timer1 = setTimeout(() => {
        setPopupOpen(true);
      }, 10000);
      return () => clearTimeout(timer1);
    }
  }, [popupOpen]);

  useEffect(() => {
    if (currentdB < 31) {
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
          <img src="/images/화면설계 샘플이미지.png" alt="" />
          {popupOpen && <PopupGuide setPopupOpen={setPopupOpen} />}
          <Scope />
          <Gauge currentdB={currentdB} />
          <WarningOutline currentdB={currentdB} />
          <FrequencyRange />
          <CameraMode />
          <ValueList />
        </div>
      </div>
    </div>
  );
}

export default App;
