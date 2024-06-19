"use client";

import { ButtonHTMLAttributes } from "react";
import styles from "../qna-mod.module.scss";
import cn from "@edgedb-site/shared/utils/classNames";
import { ButtonStyle } from "discord-api-types/v10";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonStyle?: ButtonStyle;
}

const buttonStyles: { [key in ButtonStyle]?: string } = {
  [ButtonStyle.Danger]: "#d81212",
  [ButtonStyle.Success]: "#3bb94c",
  [ButtonStyle.Primary]: "#7289da",
  [ButtonStyle.Secondary]: "#7e7f7f",
};

export { ButtonStyle };

export default function Button({
  children,
  buttonStyle,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      style={
        buttonStyle && {
          backgroundColor: buttonStyles[buttonStyle],
        }
      }
      className={cn(styles.forumButton, props.className)}
    >
      {children}
    </button>
  );
}
