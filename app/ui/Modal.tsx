import { PropsWithChildren, createRef, useEffect } from "react";
import { cn } from "../utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  className?: string;
}

export default function Modal({
  children,
  onClose,
  open,
  className,
}: PropsWithChildren<ModalProps>) {
  const modalRootRef = createRef<HTMLDivElement>();
  const modalContentRef = createRef<HTMLDivElement>();

  // useEffect(() => {
  //   const root = modalRootRef.current;
  //   const content = modalContentRef.current;
  //   let lastY = 0;

  //   const handleScroll = () => {
  //     if (root && content) {
  //       root.style.transform = `translate(0px, ${window.scrollY}px)`;
  //       content.style.transform = `translate(0px, ${
  //         (window.scrollY - lastY) * -16
  //       }px)`;
  //     }

  //     lastY = window.scrollY;
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  useEffect(() => {
    const html = document.getElementsByTagName("html")[0];

    if (html) {
      if (open) {
        html.style.overflowY = "hidden";
      } else {
        html.style.overflowY = "auto";
      }
    }
  }, [open]);

  return (
    <div
      onClick={onClose}
      ref={modalRootRef}
      className={cn(
        "fixed top-0 left-0 bottom-0 right-0 py-20 px-40 flex z-10 overflow-y-scroll justify-center items-center transition",
        open
          ? "pointer-events-auto backdrop-blur"
          : "pointer-events-none backdrop-blur-none"
      )}
    >
      <div
        ref={modalContentRef}
        onClick={(e) => e.stopPropagation()}
        className={cn(className, open ? "block" : "hidden")}
      >
        {children}
      </div>
    </div>
  );
}
