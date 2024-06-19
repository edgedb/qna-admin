// import { ToastPromiseParams, toast } from "react-toastify";

export interface QNASummary {
  title: string;
  question: string;
  answer: string;
  tags: string[];
}

export const formatQNASummary = (parsed: QNASummary): string => {
  return `**Title**\n${parsed.title}\n\n**Tags**\n${parsed.tags.join(
    ", "
  )}\n\n**Question**\n${parsed.question}\n\n**Answer**\n${parsed.answer}`;
};

const gptParseRegex =
  /\*\*Title\*\*:((?:.|[ \r\n\t\f ])+?)\*\*Tags\*\*:((?:.|[ \r\n\t\f ])+?)\*\*Question\*\*:((?:.|[ \r\n\t\f ])+?)\*\*Answer\*\*:(?:.|[ \r\n\t\f ])((?:.|[ \r\n\t\f ])+)/gm;

export const parseQNASummary = (response: string): QNASummary | undefined => {
  const match = gptParseRegex.exec(response);

  if (!match) {
    return;
  }

  return {
    title: match[1].trim(),
    tags: match[2].split(",").map((x) => x.trim()),
    question: match[3].trim(),
    answer: match[4].trim(),
  };
};

// export const stageUpdate = async <T>(
//   func: Promise<T>,
//   params?: ToastPromiseParams<T, string, string>
// ): Promise<T> => {
//   return await toast.promise(func, {
//     success: "Operation successful",
//     error: "Operation failed",
//     pending: "Executing request...",
//     ...params,
//   });
// };
