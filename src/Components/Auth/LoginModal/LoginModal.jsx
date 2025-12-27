import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useLoginMutation } from "../../../../redux/Features/Api/Auth/AuthApi";
import { userLoggedIn } from "../../../../redux/Features/Api/Auth/AuthSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";


export default function LoginModal({ open, onClose, onLogin, onOpenSignUp }) {
  const [userLogin] = useLoginMutation();
  const dispatch = useDispatch();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const dialogRef = useRef(null);
  const msgTimeoutRef = useRef(null);

  useEffect(() => {
    if (open) {
      setPhone("");
      setPassword("");
      setMessage(null);
      setLoading(false);
      if (msgTimeoutRef.current) {
        clearTimeout(msgTimeoutRef.current);
        msgTimeoutRef.current = null;
      }
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

  useEffect(() => {
    return () => {
      if (msgTimeoutRef.current) clearTimeout(msgTimeoutRef.current);
    };
  }, []);

  const normalizePhone = (v) => (v || "").replace(/[^\d+]/g, "");

  const showMessage = (type, text, autoHide = true, ms = 4000) => {
    setMessage({ type, text });
    if (msgTimeoutRef.current) {
      clearTimeout(msgTimeoutRef.current);
      msgTimeoutRef.current = null;
    }
    if (autoHide) {
      msgTimeoutRef.current = setTimeout(() => setMessage(null), ms);
    }
  };

  const parseErrorMessage = (err) => {
    try {
      if (!err) return "লগিন হয়নি — সঠিক তথ্য দিন।";

      if (typeof err === "object") {
        if (err.data) {
          const d = err.data;
          if (typeof d === "string" && d.trim()) return d;
          if (d?.message) return d.message;
          if (d?.error) return d.error;
          if (d?.errors) return JSON.stringify(d.errors);
        }

        if (err.message) return err.message;

        const possible =
          err?.data?.message || err?.data?.error || err?.data?.errorMessage;
        if (possible) return String(possible);
        const s = JSON.stringify(err);
        if (s && s !== "{}") return s;
      }

      if (typeof err === "string" && err.trim()) return err;
      return "লগিন হয়নি — সঠিক তথ্য দিন।";
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      return "লগিন হয়নি — সঠিক তথ্য দিন।";
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setMessage(null);

    const p = normalizePhone(phone);
    if (!/^\+?\d{8,15}$/.test(p)) {
      showMessage("error", "সঠিক ফোন নম্বর দিন (country code optional)।");
      return;
    }
    if (!password || password.length < 3) {
      showMessage("error", "পাসওয়ার্ড অন্তত ৩ অক্ষর দিন।");
      return;
    }

    if (typeof onLogin !== "function") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        showMessage("success", "লগইন সফল (সিমুলেশন)।");
        setTimeout(() => onClose?.(), 700);
      }, 700);
      return;
    }

    try {
      setLoading(true);
      showMessage("info", "প্রবেশ করা হচ্ছে...", true, 10000);
      const result = await userLogin({ phone: p, password }).unwrap();
      const token =
        result?.data?.accessToken ?? result?.accessToken ?? result?.token;
      const user =
        result?.data?.user ?? result?.user ?? result?.data ?? undefined;

      if (!token || !user) {
        throw new Error("সার্ভার থেকে প্রত্যাশিত তথ্য পাওয়া যায়নি।");
      }
      dispatch(userLoggedIn({ user, token }));
      showMessage("success", "লগইন সফল।");
      setTimeout(() => onClose?.(), 600);
    } catch (err) {
      const msg = parseErrorMessage(err);
      showMessage("error", msg);
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
              <h3 className="text-2xl font-extrabold text-white">লগইন</h3>
              <p className="text-sm text-gray-200">
                ফোন নম্বর ও পাসওয়ার্ড দিয়ে প্রবেশ করুন
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-gray-200 hover:text-white p-2 rounded-md"
              aria-label="Close login"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-200">ফোন</label>
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
              <label className="text-sm text-gray-200">পাসওয়ার্ড</label>
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
                role={message.type === "error" ? "alert" : "status"}
                aria-live={message.type === "error" ? "assertive" : "polite"}
                className={`py-2 px-3 rounded-md text-sm ${message.type === "error"
                    ? "bg-red-600/20 text-red-200"
                    : message.type === "success"
                      ? "bg-green-600/10 text-green-200"
                      : "bg-white/6 text-gray-200"
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
                {loading ? "Loading..." : "Login"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPhone("");
                  setPassword("");
                  setMessage(null);
                  if (msgTimeoutRef.current) {
                    clearTimeout(msgTimeoutRef.current);
                    msgTimeoutRef.current = null;
                  }
                }}
                className="px-3 py-2 rounded-xl bg-white/6 border border-white/10 text-white"
              >
                Reset
              </button>
            </div>
          </form>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
            <Link to="/forgot-password">
              <button
                type="button"
                className="underline cursor-pointer"
              
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </button>
            </Link>


            <div>
              <span className="text-gray-300 mr-2">নতুন ব্যবহারকারী?</span>
              <button
                type="button"
                onClick={() => {
                  onClose?.();
                  onOpenSignUp?.();
                }}
                className="underline cursor-pointer"
              >
                অ্যাকাউন্ট তৈরি করুন
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
