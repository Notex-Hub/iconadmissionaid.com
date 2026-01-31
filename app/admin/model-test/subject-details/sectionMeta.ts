export type SectionKey = "MCQ" | "CQ" | "FillInTheGaps" | "Passage";

export const SECTION_META: Record<
  SectionKey,
  {
    name: string;
    desc: string;
    createPath: (subjectSlug: string) => string;
    viewPath: (subjectSlug: string) => string;
  }
> = {
  MCQ: {
    name: "MCQ",
    desc: "Multiple choice questions — single best answer. Great for quick assessment.",
    createPath: (subjectSlug: string) =>
      `/admin/subject/${subjectSlug}/create-mcq`,
    viewPath: (subjectSlug: string) => `/admin/subject/${subjectSlug}/mcq`,
  },
  CQ: {
    name: "CQ",
    desc: "Creative / descriptive questions (long answers).",
    createPath: (subjectSlug: string) =>
      `/admin/subject/${subjectSlug}/create-cq`,
    viewPath: (subjectSlug: string) => `/admin/subject/${subjectSlug}/cq`,
  },
  FillInTheGaps: {
    name: "FillInTheGaps",
    desc: "Gap-filling / cloze type questions — useful for vocabulary & grammar.",
    createPath: (subjectSlug: string) =>
      `/admin/subject/${subjectSlug}/create-gaps`,
    viewPath: (subjectSlug: string) => `/admin/subject/${subjectSlug}/gaps`,
  },
  Passage: {
    name: "Passage",
    desc: "Passage with multiple MCQs (passage compression). Create a passage and attach MCQs.",
    createPath: (subjectSlug: string) =>
      `/admin/subject/${subjectSlug}/create-passage`,
    viewPath: (subjectSlug: string) => `/admin/subject/${subjectSlug}/passage`,
  },
};
