import { useEffect } from "react";
import "./ConfirmDialog.css";
import { acquireModalLock, releaseModalLock } from "../../lib/modalLock";

const ConfirmDialog = ({
  open,
  title = "Confirm",
  message,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onClose,
}) => {
  useEffect(() => {
    if (!open) return;
    acquireModalLock();
    return () => releaseModalLock();
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal modal--confirm" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>{title}</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modal__body">
          {children || <p className="confirm__text">{message}</p>}
        </div>

        <div className="modal__footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={danger ? "btn-danger" : "btn-primary"}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
