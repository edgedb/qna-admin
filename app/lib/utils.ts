import { ToastPromiseParams, toast } from "react-toastify";

export const defaultPrompt = `Summarize the following conversation into a FAQ with 
question, answer, title and tags. Choose tags only from the provided list of 
tags. If no tags make sense return empty array for tags. Include markdown when 
sending code snippets. Make sure to capture the answer within the following 
messages and include that in the summarized version.

Use the following format to summarize:
**Title**
...

**Tags**
...

**Question**
...

**Answer**
...`;

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
  /\*\*Title\*\*\s*:?\s*([\s\S]+?)\s*\*\*Tags\*\*\s*:?\s*([\s\S]+?)\s*\*\*Question\*\*\s*:?\s*([\s\S]+?)\s*\*\*Answer\*\*\s*:?\s*([\s\S]+)/gm;

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

export const dbUpdate = async <T>(
  func: Promise<T>,
  params?: ToastPromiseParams<T, string, string>
): Promise<T> => {
  return await toast.promise(func, {
    success: "Operation successful",
    error: "Operation failed",
    pending: "Executing request...",
    ...params,
  });
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};
