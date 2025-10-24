/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

function useOutsideClick(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler(e);
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

const ICONS = {
  Dashboard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h7v7H3zM14 3h7v4h-7zM14 10h7v11h-7zM3 11h7v7H3z" />
    </svg>
  ),
  Courses: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5 12.083 12.083 0 015.84 10.578L12 14z" />
    </svg>
  ),
  Products: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7L9 18l-5-5" />
    </svg>
  ),
  Rewards: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4 0 2.21 1.79 4 4 4s4-1.79 4-4c0-2.21-1.79-4-4-4z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
  Referrals: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 10-8 0v4" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11h8l-1.5 9h-5L8 11z" />
    </svg>
  ),
  Orders: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M7 17h10" />
    </svg>
  ),
  Settings: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09c.65 0 1.2-.39 1.51-1A1.65 1.65 0 005.33 6.6l-.06-.06A2 2 0 017.8 3.7l.06.06c.45.45 1.06.7 1.7.7h.2c.35 0 .68-.1.98-.29L12 3" />
    </svg>
  ),
};

export default function Sidebar() {
  const { userInfo } = useSelector((state) => state.auth);
  const ref = useRef();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("edu_sidebar_collapsed");
      if (saved) setCollapsed(JSON.parse(saved));
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("edu_sidebar_collapsed", JSON.stringify(collapsed));
    // eslint-disable-next-line no-empty
    } catch (e) {}
  }, [collapsed]);
  useOutsideClick(ref, () => {
    if (open) setOpen(false);
  });

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const sections = [
    { title: "Main", items: [{ name: "Dashboard", path: "/dashboard" }] },
    {
      title: "Learning",
      items: [
        { name: "My Courses", path: "/dashboard/my-courses" },
        { name: "My Profile", path: "/dashboard/my-profile" },
        { name: "Live Classes", path: "/dashboard/live-classes" },
      ],
    },
    {
      title: "Explore",
      items: [
        { name: "Rewards", path: "/dashboard/rewards" },
        { name: "Referrals", path: "/dashboard/referrals" },
        { name: "Orders", path: "/dashboard/orders" },
      ],
    },
    { title: "Settings", items: [{ name: "Settings", path: "/dashboard/settings" }] },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
        className="fixed bottom-6 left-6 z-50 lg:hidden bg-red-600 text-white p-3 rounded-full shadow-xl hover:scale-105 transform transition"
        title="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 lg:hidden transition-opacity duration-200 ${open ? "opacity-60 pointer-events-auto bg-black" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!open}
      />

      <aside
        ref={ref}
        role="navigation"
        aria-label="Main sidebar"
        className={`fixed top-0 left-0  bottom-0 z-40 flex flex-col bg-white  transition-transform duration-300 ease-in-out
          ${open ? "w-64 translate-x-0" : "w-64 -translate-x-full"} 
          lg:translate-x-0 lg:static ${collapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        {/* header */}
        <div className="h-16 flex items-center px-4  gap-3">
       
          <button
            onClick={() => setOpen(false)}
            className="ml-auto lg:hidden p-2 rounded hover:bg-gray-100"
            aria-label="Close sidebar"
            title="Close"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* scrollable nav */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {sections.map((sec) => (
              <div key={sec.title}>
                {!collapsed && <div className="text-xs font-semibold text-gray-400 uppercase mb-2 px-1">{sec.title}</div>}
                <div className="space-y-1">
                  {sec.items.map((item) => {
                    const active = location.pathname === item.path;
                    const icon = ICONS[item.name] || ICONS.Dashboard;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-150 ${
                          active ? "bg-red-50 text-red-600" : "text-gray-700 hover:bg-gray-100"
                        }`}
                        title={collapsed ? item.name : undefined}
                        aria-current={active ? "page" : undefined}
                      >
                        <div className={`flex items-center justify-center w-8 h-8 rounded ${active ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"}`}>
                          {icon}
                        </div>
                        {!collapsed && <span className="truncate">{item.name}</span>}
                        {/* optional badge for special items */}
                        {item.name === "Rewards" && !collapsed && <span className="ml-auto text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">New</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* footer area */}
        <div className="p-4 border-t border-gray-300 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">U</div>
          {!collapsed && (
            <div className="flex-1">
              <div className="text-sm font-medium">{userInfo?.name}</div>
              <div className="text-xs text-gray-500">Member since: {userInfo?.createdAt}</div>
            </div>
          )}
          {/* {!collapsed && (
            <button className="p-2 rounded hover:bg-gray-100" title="Logout">
              <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8v8" />
              </svg>
            </button>
          )} */}
        </div>
      </aside>
    </>
  );
}
