export function SubjectHeader({
  subject,
  modelTest,
  slug,
  router,
  onRefresh,
}: {
  subject: any;
  modelTest: any;
  slug: string;
  router: any;
  onRefresh: () => void;
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="w-28 h-20 rounded overflow-hidden bg-gray-100 border">
          <img
            src={modelTest?.image ?? subject?.modelTest?.image ?? "/placeholder-rect.png"}
            alt={modelTest?.title ?? subject?.title ?? "Subject"}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{subject?.title ?? "Subject Details"}</h1>
          <p className="text-sm text-gray-600 mt-1">
            {modelTest ? `${modelTest.title} — ${modelTest.university}` : "Model test not found"}
          </p>
          <div className="text-xs text-gray-500 mt-2">
            <div>Subject slug: <span className="font-mono">{subject?.slug ?? "—"}</span></div>
            <div className="mt-1">Model Test slug: <span className="font-mono">{modelTest?.slug ?? "—"}</span></div>
            <div className="mt-1">Departments: <span className="text-gray-700">{modelTest?.departments?.join(", ") ?? "—"}</span></div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => router.back()} className="px-3 py-1 text-sm border rounded hover:bg-gray-100">← Back</button>
        <button onClick={onRefresh} className="px-3 py-1 text-sm border rounded hover:bg-gray-100">Refresh</button>
        <a href={`/admin/model-test/model-test-details?slug=${modelTest?.slug ?? ""}`} className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">Open Model Test</a>
      </div>
    </div>
  );
}