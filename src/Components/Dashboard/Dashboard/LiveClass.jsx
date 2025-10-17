/* eslint-disable react/prop-types */

export default function LiveClass({ sessions = [], onJoin = () => {} }) {
  return (
    <section className="bg-white rounded-2xl p-4 shadow-sm ">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Live Classes</h3>
          <p className="text-sm text-gray-500">Upcoming & live sessions</p>
        </div>

        
      </div>

      {sessions.length === 0 ? (
        <div className="text-center text-sm text-gray-500 py-8">No live classes scheduled.</div>
      ) : (
        <ul role="list" className="space-y-3">
          {sessions.map((s) => (
            <li
              key={s.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3 rounded-lg hover:shadow transition-shadow bg-white"
              aria-labelledby={`live-title-${s.id}`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                  {/* initials */}
                  {s.title
                    ? s.title
                        .split(" ")
                        .slice(0, 2)
                        .map((t) => t[0])
                        .join("")
                    : "LC"}
                </div>

                <div className="min-w-0">
                  <p id={`live-title-${s.id}`} className="text-sm font-semibold text-gray-800 truncate">
                    {s.title}
                  </p>

                  <div className="mt-1 text-xs text-gray-500 flex flex-wrap gap-2">
                    <span className="truncate">
                      {s.instructor} {s.instructor ? "•" : ""} {s.type}
                    </span>
                    <span className="text-xs text-gray-400">{"\u2022"}</span>
                    <span className="truncate">{s.date} · {s.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 md:ml-4">
                {/* status badge */}
                <span
                  className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${
                    s.status === "Live" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
                  }`}
                  aria-hidden
                >
                  {s.status}
                </span>

                {/* responsive buttons: full-width on small, compact on md+ */}
                <div className="w-full md:w-auto flex ">
                  <button
                    onClick={() => onJoin(s)}
                    className={`flex-1 md:flex-none text-sm px-2 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                      s.status === "Live"
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-none border-none shadow-none text-gray-500 cursor-not-allowed"
                    }`}
                    aria-label={s.status === "Live" ? `Join ${s.title}` : `View details for ${s.title}`}
                  >
                    {s.status === "Live" ? "Join Now" : null}
                  </button>

                  {/* <LinkSmallDetails session={s} /> */}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="text-sm text-gray-500">Showing {sessions.length} class{sessions.length !== 1 ? "es" : ""}</div>
      </div>
    </section>
  );
}
