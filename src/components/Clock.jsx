import { useEffect, useState } from "react";

export default function Clock() {
  const [time, setTime] = useState(getCurrnetTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getCurrnetTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return <div className="clock font-bebas">{time}</div>;
}

export function getCurrnetTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");

  return `${year}.${month}.${date} ${hours}:${minutes}:${seconds}`;
}
