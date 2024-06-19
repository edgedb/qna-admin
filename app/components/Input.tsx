import { ReactElement } from "react";
import { cn } from "../utils";

interface InputProps {
  className?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function Input({ value, onChange, className }: InputProps) {
  return (
    <div className={cn(className, "flex relative justify-center min-h-12")}>
      <div className="box-border px-1.5 py-0.5 w-full text-[15px] whitespace-pre-wrap break-words overflow-y-auto invisible">
        {value}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        className="box-border px-1.5 py-0.5 w-full text-[15px] outline-none border-none z-[1] absolute t-0 left-0 bottom-0 right-0 overflow-y-auto resize-none h-full rounded-sm bg-[#ebebeb]"
      />
    </div>
  );
}
