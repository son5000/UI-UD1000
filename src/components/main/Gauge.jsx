import Arc from "./Arc";

export default function Gauge({ currentdB }) {
  return (
    <div className="gauge">
      <strong className="neon4 font-digital7">
        {currentdB}
        <span className="font-rajdhani">dB</span>
      </strong>
      <Arc currentdB={currentdB} />
    </div>
  );
}
