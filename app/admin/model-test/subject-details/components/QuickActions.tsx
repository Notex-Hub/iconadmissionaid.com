import Link from "next/link";
import { SectionKey } from "../sectionMeta";

export function QuickActions({
  slug,
  onCreate,
  subject,
}: {
  slug: string;
  onCreate: (section: SectionKey) => void;
  subject: any;
}) {
  const isEnglish = subject?.title?.trim().toLowerCase() === "english";

  return (
    <div className="space-y-4">
      {/* Box 1 */}
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-900">About this subject</h3>

        <div className="mt-4 flex gap-2">
          {/* MCQ always visible */}
          <Link
            href={`/admin/model-test/subject-details/mcq?slug=${slug}`}
            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Create MCQ
          </Link>

        
        </div>
      </div>

      {/* Box 2 */}
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h4 className="text-sm font-medium text-gray-900">Quick actions</h4>

        <div className="mt-3 grid grid-cols-1 gap-2">
          {/* MCQ always visible */}
          <a
            className="px-3 py-2 border rounded text-sm hover:bg-gray-50"
            href={`/admin/model-test/subject-details/mcq?slug=${slug}`}
          >
            Manage MCQs
          </a>

          {/* Only for English */}
          {isEnglish && (
            <>
              <a
                className="px-3 py-2 border rounded text-sm hover:bg-gray-50"
                href={`/admin/model-test/subject-details/cq?slug=${slug}`}
              >
                Manage CQs
              </a>

              <a
                className="px-3 py-2 border rounded text-sm hover:bg-gray-50"
                href={`/admin/model-test/subject-details/fill-in-the-gaps?slug=${slug}`}
              >
                Manage Gaps
              </a>

              <a
                className="px-3 py-2 border rounded text-sm hover:bg-gray-50"
                href={`/admin/model-test/subject-details/passages?slug=${slug}`}
              >
                Manage Passages
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
