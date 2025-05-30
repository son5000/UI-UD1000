export default function WarningOutline({ currentdB }) {
  if (currentdB < 15) return null;

  return <div className="WarningOutlineBox"></div>;
}
