import { useState } from "react";

import Input from "./Input";
import Modal from "./Modal";
import { GPTLogo } from "../assets/icons";

interface PromptBoxModalProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  open: boolean;
}

export default function PromptBoxModal({
  value,
  onChange,
  onClose,
  open,
}: PromptBoxModalProps) {
  const [editedContent, setEditedContent] = useState(value);

  const close = () => {
    onClose();
    setEditedContent(value);
  };

  return (
    <Modal
      onClose={onClose}
      open={open}
      className="max-w-[900px] w-[90%] max-h-[600px] relative rounded bg-[#ebebeb] transition-transform"
    >
      <div className="overflow-auto w-full h-full max-w-[900px] max-h-[600px] pb-12 rounded">
        <Input onChange={setEditedContent} value={editedContent} />
        <GPTLogo className="w-10 h-10 text-element z-[1] p-1 absolute top-1 right-1" />
        <section className="absolute left-2 bottom-2 flex gap-2 mt-3 z-20">
          <button
            className="outline-none border-none py-1 h-fit px-2 text-xs rounded bg-accentOrange hover:bg-hoverOrange"
            onClick={close}
          >
            CANCEL
          </button>
          <button
            className="outline-none border-none py-1 h-fit px-2 text-xs rounded bg-accentGreen hover:bg-hoverGreen"
            onClick={() => {
              onChange(editedContent);
            }}
          >
            SAVE
          </button>
        </section>
      </div>
    </Modal>
  );
}
