import { FunctionComponent } from "react";
import IconButton from "./IconButton";
import { CancelIcon } from "@/app/assets/icons";
import { cn } from "../utils";

interface TagProps {
  name: string;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
}

const Tag: FunctionComponent<TagProps> = ({
  name,
  onRemove,
  onClick,
  className,
}) => {
  const removeable = !!onRemove;

  return (
    <div
      onClick={onClick}
      className={cn(
        className,
        "select-none flex items-center w-min relative mr-9 mt-2"
      )}
    >
      <p
        className={cn(
          "text-nowrap font-semibold text-sm",
          removeable ? "mr-0.5" : ""
        )}
      >
        {name}
      </p>
      {removeable && (
        <IconButton
          onClick={onRemove}
          className="text-accentRed hover:text-hoverRed absolute -top-2.5 -right-[26px]"
          icon={<CancelIcon />}
        />
      )}
    </div>
  );
};

export default Tag;
