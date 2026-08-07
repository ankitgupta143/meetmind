export const EXPORT_FORMATS = [
  { value: "pdf", label: "PDF", extension: "pdf" },
  { value: "docx", label: "DOCX", extension: "docx" },
  { value: "markdown", label: "Markdown", extension: "md" },
  { value: "html", label: "HTML", extension: "html" },
  { value: "text", label: "Plain Text", extension: "txt" },
];

export const EXPORT_SECTIONS = [
  "Summary",
  "Transcript",
  "Action Items",
  "Decisions",
  "Analytics",
];

export const DEFAULT_EXPORT_FILENAME = "Weekly Engineering Sync";

export const DEFAULT_EXPORT_SETTINGS = {
  pageSize: "A4",
  includeTimestamps: true,
  includeBranding: true,
};
