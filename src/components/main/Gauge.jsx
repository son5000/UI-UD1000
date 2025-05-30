import Arc from "./Arc";

export default function Gauge({ currentdB }) {
  return (
    <div className="gauge">
      {/* <HalfDonutGauge percent={currentdB} /> */}
      <strong
        className={
          currentdB > 19
            ? "neon3 font-digital7"
            : currentdB > 9
            ? "neon2 font-digital7 "
            : "neon1 font-digital7"
        }
        // className="neon4"
      >
        {currentdB}
        <span className="font-rajdhani">dB</span>
      </strong>
      {/* <b>
                      0<span>dB</span>
                    </b> */}
      <Arc currentdB={currentdB} />
    </div>
  );
}
