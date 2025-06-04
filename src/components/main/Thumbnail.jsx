export default function Thumbnail({ onClick }) {
  return (
    <div onClick={onClick} className="thumbnail">
      <img src="/images/썸네일.png" alt="" />
    </div>
  );
}
