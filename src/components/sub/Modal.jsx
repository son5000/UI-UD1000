export default function Modal({ openFileList, children }) {
  if (!openFileList) return null;

  return <div className="modal-overlay">{children}</div>;
}
