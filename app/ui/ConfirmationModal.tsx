import { PropsWithChildren } from "react";
import Modal from "./Modal";

interface ConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  open: boolean;
  className?: string;
}

export default function ConfirmationModal({
  children,
  onConfirm,
  onCancel,
  open,
  className,
}: PropsWithChildren<ConfirmationModalProps>) {
  return (
    <Modal onClose={onCancel} open={open} className={className}>
      <div className="flex flex-col overflow-hidden shadow-lg py-3 px-3.5 rounded bg-element min-h-[350px] w-[90%] max-w-[900px]">
        {children}
        <section className="flex gap-2 pt-3">
          <button
            className="outline-none border-none py-1 px-2 h-fit text-xs rounded bg-accentRed hover:bg-hoverRed text-black"
            onClick={onCancel}
          >
            CANCEL
          </button>
          <button
            className="outline-none border-none py-1 px-2 h-fit text-xs rounded bg-accentGreen hover:bg-hoverGreen text-black"
            onClick={onConfirm}
          >
            CONFIRM
          </button>
        </section>
      </div>
    </Modal>
  );
}
