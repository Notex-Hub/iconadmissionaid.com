import { SECTION_META, SectionKey } from "../sectionMeta";

export function SectionCard({
  section,
  subjectSlug,
  counts,
  onCreateOpen,
  subject,
}: {
  section: SectionKey;
  subjectSlug: string;
  counts?: number | null;
  onCreateOpen: (section: SectionKey) => void;
  subject: any;
}) {
  const meta = SECTION_META[section];
  const isEnglish = subject?.title?.trim().toLowerCase() === "english";

  if (!isEnglish && meta.name !== "MCQ") {
    return null;
  }

  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-900">{meta.name}</h4>
          <div className="text-xs text-gray-500">
            {counts != null ? `${counts}` : "—"}
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-600">{meta.desc}</p>
      </div>

      <div className="mt-4 flex gap-2">
        {meta.name === "MCQ" && (
          <a
            href={`/admin/model-test/subject-details/mcq?slug=${subjectSlug}`}
            className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs rounded border border-gray-200 hover:bg-gray-50"
          >
            View MCQ
          </a>
        )}
        {meta.name === "CQ" && isEnglish && (
          <a
            href={`/admin/model-test/subject-details/cq?slug=${subjectSlug}`}
            className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs rounded border border-gray-200 hover:bg-gray-50"
          >
            View CQ
          </a>
        )}
        {meta.name === "FillInTheGaps" && isEnglish && (
          <a
            href={`/admin/model-test/subject-details/fill-in-the-gaps?slug=${subjectSlug}`}
            className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs rounded border border-gray-200 hover:bg-gray-50"
          >
            View Fill In the Gaps
          </a>
        )}
        {meta.name === "Passage" && isEnglish && (
          <a
            href={`/admin/model-test/subject-details/passages?slug=${subjectSlug}`}
            className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs rounded border border-gray-200 hover:bg-gray-50"
          >
            View Passage
          </a>
        )}
      </div>
    </div>
  );
}
