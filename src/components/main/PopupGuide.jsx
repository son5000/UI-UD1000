import { useEffect, useState } from "react";

export default function PopupGuide({ setPopupOpen }) {
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
    <div className="popupGuide font-rajdhani">
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
