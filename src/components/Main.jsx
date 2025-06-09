import { useEffect, useState } from "react";
import Scope from "./main/Scope";
import PopupGuide from "./main/PopupGuide";
import Gauge from "./main/Gauge";
import FrequencyRange from "./main/FrequencyRange";
import CameraMode from "./main/CameraMode";
import WarningOutline from "./main/WarningOutline";
import ValueList from "./main/ValueList";

export default function Main() {
  const [currentdB, setCurrentdB] = useState(10);
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
    <div className="main">
      {popupOpen && <PopupGuide setPopupOpen={setPopupOpen} />}
      <Scope />
      <Gauge currentdB={currentdB} />
      <WarningOutline currentdB={currentdB} />
      <FrequencyRange />
      <CameraMode />
      <ValueList />
    </div>
  );
}
