import { SECTION_META, SectionKey } from "../sectionMeta";

export function CreateModal({
  open,
  section,
  subjectSlug,
  onClose,
}: {
  open: boolean;
  section: SectionKey | null;
  subjectSlug: string;
  onClose: () => void;
}) {
  if (!section) return null;
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center px-4`}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-lg font-medium text-gray-900">Create {section}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 px-2"
          >
            ✕
          </button>
        </div>
        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-700">
            You're creating a <strong>{section}</strong> under subject <strong>{subjectSlug}</strong>.
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-3 py-1 border rounded text-sm"
            >
              Cancel
            </button>
            <a
              href={SECTION_META[section].createPath(subjectSlug)}
              className="px-3 py-1 bg-indigo-600 text-white rounded text-sm"
            >
              Open Create Page
            </a>
            <a
              href={SECTION_META[section].viewPath(subjectSlug)}
              className="px-3 py-1 bg-gray-700 text-white rounded text-sm"
            >
              Manage {section}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}