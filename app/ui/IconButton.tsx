/* eslint-disable react/display-name */
import { HTMLAttributes, ReactNode, forwardRef } from "react";
import { cn } from "../utils";

interface IconButtonProps extends HTMLAttributes<HTMLDivElement> {
  icon: ReactNode;
  className?: string;
  disabled?: boolean;
}

const IconButton = forwardRef<HTMLDivElement, IconButtonProps>((props, ref) => (
  <button
    {...(({ icon, ...a }: any) => a)(props)}
    ref={ref}
    className={cn(
      "flex outline-none border-none justify-center items-center w-7 h-7",
      props.className
    )}
  >
    {props.icon}
  </button>
));

export default IconButton;
