// import { useIsOverlayActive } from "@edgedb-site/shared/hooks/useOverlayActive";

import Prism from "prismjs";
import { cn } from "@/app/utils";

let isLoaded = false;
function loadGrammars() {
  if (!isLoaded) {
    require("./loadGrammars");
    isLoaded = true;
  }
}
loadGrammars();

export { Prism };

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function highlight(
  code: string,
  prismLang: Prism.Grammar,
  lang: string,
  inline: boolean = false
): string {
  let hl = escapeHtml;
  if (prismLang) {
    hl = (s) => Prism.highlight(s, prismLang, lang);
  }

  if (inline) {
    return hl(code);
  }

  const sections = code;
  const html = [];
  let codec = hl(sections);
  code = `<span class="tokens tokens-${sections}">${code}</span>`;
  html.push(codec);

  return html.join("");
}

export interface CodeProps {
  code: string;
  language: string;
  className?: string;
  inline?: boolean;
}

export function Code({
  code,
  language,
  className,
  inline = false,
}: CodeProps & { [key: string]: any }) {
  const prismLang = Prism.languages[language];
  const prismCls = prismLang ? `code-language-${language}` : undefined;
  const html = highlight(code, prismLang, language, inline);

  if (inline) {
    return (
      <span
        className={cn(
          "relative overflow-y-hidden overflow-x-auto bg-code rounded text-text w-fit inline-flex py-[1px] px-1.5 leading-[19px]",
          prismCls,
          className
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      ></span>
    );
  }

  const content: JSX.Element[] = [];

  content.push(
    <div key="content">
      <pre dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );

  return (
    <div
      className={cn(
        "relative overflow-y-hidden overflow-x-auto bg-code rounded text-text mt-2 mb-1 py-2 px-2",
        prismCls,
        className
      )}
    >
      {content}
    </div>
  );
}
