import { KeyboardEvent, ReactNode } from "react";
import { cn } from "../utils";

interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  invalidMessage?: string;
  className?: string;
  floatElement?: ReactNode;
}

export default function TextInput({
  label,
  onChange,
  value,
  placeholder,
  required,
  invalidMessage,
  onSubmit,
  className,
  floatElement,
  ...props
}: TextInputProps) {
  const handleKeypress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit && onSubmit();
    }
  };

  return (
    <div className="relative flex flex-col rounded my-1">
      {(label || required) && (
        <section className="pointer-events-none select-none flex items-center w-fit z-10 px-1 text-xs">
          {label && <label className="">{label}</label>}
        </section>
      )}
      {floatElement && (
        <div className="absolute top-0 right-0 bottom-0 flex justify-center items-center">
          {floatElement}
        </div>
      )}
      <input
        {...props}
        onKeyPress={handleKeypress}
        className={cn(
          className,
          "outline-none px-2.5 py-2 bg-element text-text rounded placeholder:text-placeholder transition-transform",
          invalidMessage && "border-accentRed"
        )}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
      {invalidMessage && (
        <label className="text-xs text-accentRed">{invalidMessage}</label>
      )}
    </div>
  );
}
