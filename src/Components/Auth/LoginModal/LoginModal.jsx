import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

/**
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *  - onLogin: async ({ phone, password }) => void
 *  - onOpenSignUp: () => void   // called when user clicks "Create account"
 */
export default function LoginModal({ open, onClose, onLogin, onOpenSignUp }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open) {
      setPhone("");
      setPassword("");
      setMessage(null);
      setLoading(false);
      setTimeout(() => dialogRef.current?.querySelector("input")?.focus(), 60);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const normalizePhone = (v) => v.replace(/[^\d+]/g, "");

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setMessage(null);

    const p = normalizePhone(phone);
    if (!/^\+?\d{8,15}$/.test(p)) {
      setMessage({ type: "error", text: "সঠিক ফোন নম্বর দিন (country code optional)।" });
      return;
    }
    if (!password || password.length < 3) {
      setMessage({ type: "error", text: "পাসওয়ার্ড অন্তত ৩ অক্ষর দিন।" });
      return;
    }

    if (typeof onLogin !== "function") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setMessage({ type: "success", text: "লগিন সফল (সিমুলেশন)।" });
        setTimeout(() => onClose?.(), 700);
      }, 700);
      return;
    }

    try {
      setLoading(true);
      await onLogin({ phone: p, password });
      setMessage({ type: "success", text: "লগিন সফল।" });
      setTimeout(() => onClose?.(), 600);
    } catch (err) {
      setMessage({ type: "error", text: err?.message ?? "লগিন হয়নি — সঠিক তথ্য দিন।" });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-md rounded-2xl overflow-hidden transform transition-all duration-200"
      >
        <div className="bg-gradient-to-br from-white/6 to-white/4 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-extrabold text-[#5D0000]">Login</h3>
              <p className="text-sm text-gray-200">ফোন নম্বর ও পাসওয়ার্ড দিয়ে প্রবেশ করুন</p>
            </div>

            <button
              onClick={onClose}
              className="text-gray-200 hover:text-white p-2 rounded-md"
              aria-label="Close login"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-200">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+8801XXXXXXXXX"
                inputMode="tel"
                className="mt-2 w-full px-4 py-2 rounded-xl bg-white/6 border border-white/8 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>

            <div>
              <label className="text-sm text-gray-200">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="mt-2 w-full px-4 py-2 rounded-xl bg-white/6 border border-white/8 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>

            {message && (
              <div
                className={`py-2 px-3 rounded-md text-sm ${
                  message.type === "error" ? "bg-red-600/20 text-red-200" : "bg-green-600/10 text-green-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="flex gap-3 items-center">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl px-4 py-2 bg-[#5D0000] hover:bg-red-700 text-white font-semibold transition disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPhone("");
                  setPassword("");
                  setMessage(null);
                }}
                className="px-3 py-2 rounded-xl bg-white/6 border border-white/10 text-white"
              >
                Clear
              </button>
            </div>
          </form>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
            <button
              type="button"
              className="underline"
              onClick={() => alert("Forgot password flow should be implemented by backend.")}
            >
              Forgot password?
            </button>

            <div>
              <span className="text-gray-300 mr-2">নতুন ব্যবহারকারী?</span>
              <button
                type="button"
                onClick={() => {
                  onClose?.();
                  onOpenSignUp?.();
                }}
                className="underline"
              >
                Create account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

LoginModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onLogin: PropTypes.func,
  onOpenSignUp: PropTypes.func,
};
