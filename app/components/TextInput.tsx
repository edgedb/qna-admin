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
    <div className={cn(className, "relative flex flex-col rounded m-1")}>
      {(label || required) && (
        <section className="pointer-events-none select-none flex items-center w-fit z-10 px-1 text-xs">
          {label && <label className="">{label}</label>}
          {required && <label className="text-accentRed">*</label>}
        </section>
      )}

      {/* {floatElement && (
        <div className={styles.floatContainer}>{floatElement}</div>
      )} */}
      <input
        {...props}
        onKeyPress={handleKeypress}
        className={cn(
          "bg-transparent rounded overflow-hidden outline-none px-2 border-2 border-activeElement placeholder:text-[#666]",
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
