import Image from "next/image";
import { FileIcon } from "@/app/ui/icons";
// import styles from "../../qna-mod.module.scss";
import { cn } from "../../utils";

interface AttachmentProps {
  url: string;
  className?: string;
}

const isImage = (url: string): boolean => {
  return url.match(/\.(jpg|jpeg|png|gif)(?:\?|$)/i) !== null;
};

const getFileName = (url: string): string => {
  const m = /.*\/(.+?)\.([a-zA-Z]+?)(?:\?.+?$|$)/gm.exec(url);

  if (m === null) {
    return "Unknown";
  }

  return m[1] + "." + m[2];
};

export default function Attachment({ url }: { url: string }) {
  return (
    <div className="w-[400px] h-[250px] px-2 relative ">
      {isImage(url) ? (
        <Image
          className="rounded object-contain"
          src={url}
          alt="discord attachment"
          fill={true}
        />
      ) : (
        <section className="rounded  flex items-center m-2 bg-element">
          <FileIcon />
          <a className="ml-2" href={url} target="_blank">
            {getFileName(url)}
          </a>
        </section>
      )}
    </div>
  );
}
