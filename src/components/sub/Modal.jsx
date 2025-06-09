export default function Modal({ modalOpen, children }) {
  if (!modalOpen) return null;

  return <div className="modal-overlay">{children}</div>;
}
