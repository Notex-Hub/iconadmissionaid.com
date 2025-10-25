import { useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../../Components/Home/Navbar/Navbar";
import Footer from "../../Layout/Footer";


export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const normalizePhone = (v = "") => v.replace(/[^\d+]/g, "");
  const isValidPhone = (v = "") => /^\+?\d{8,15}$/.test(normalizePhone(v));

  const resetFields = () => {
    setPhone("");
  };

  async function handleForgotPassword(e) {
    e?.preventDefault?.();

    if (!phone || !isValidPhone(phone)) {
      toast.error("সঠিক ফোন নম্বর দিন (country code optional)।");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://sandbox.iconadmissionaid.com/api/v1/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: normalizePhone(phone) }),
        }
      );

      let data = null;
      try {
        data = await res.json();
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        // ignore JSON parse error
      }

      if (!res.ok) {
        const msg = data?.message || data?.error || "SMS পাঠানো যায়নি!";
        toast.error(String(msg));
      } else {
        const successMsg =
          data?.message || "SMS পাঠানো হয়েছে! নতুন পাসওয়ার্ডটি SMS এ দেখুন।";
        toast.success(String(successMsg));
        resetFields();
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Network error! অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করুন।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4 ">
      {/* Toast container */}

      <main className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-white shadow-2xl">
        <header className="mb-6">
          <h1 className="text-2xl font-extrabold">পাসওয়ার্ড রিসেট</h1>
          <p className="mt-1 text-sm text-gray-200">
            তোমার ফোন নম্বর লিখে নতুন পাসওয়ার্ড SMS এ পেয়ে যাবে।
          </p>
        </header>

        <form onSubmit={handleForgotPassword} className="space-y-5" aria-live="polite">
          <div>
            <label className="block text-sm text-gray-200 mb-2" htmlFor="phone">
              ফোন নম্বর
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+8801XXXXXXXXX"
              className="w-full px-4 py-3 rounded-xl bg-white/6 border border-white/8 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/20"
              aria-invalid={phone && !isValidPhone(phone) ? "true" : "false"}
              aria-describedby="phoneHelp"
            />
            <p id="phoneHelp" className="mt-2 text-xs text-gray-300">
              Country code optional — উদাহরণ: <span className="font-medium">+8801XXXXXXXXX</span>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 font-semibold text-white hover:scale-[1.01] transition disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  পাঠানো হচ্ছে...
                </>
              ) : (
                "SMS পাঠাও"
              )}
            </button>

            <button
              type="button"
              onClick={() => setPhone("")}
              className="px-4 cursor-pointer py-3 rounded-xl bg-white/6 border border-white/10 text-white"
            >
              Reset
            </button>
          </div>

          <div className="text-center text-sm text-gray-300 pt-1">
            <p>
              যদি SMS না আসে, ২-৩ মিনিট অপেক্ষা করে আবার চেষ্টা করো। সমস্যার সমাধানের
              জন্য আমাদের সাপোর্টে যোগাযোগ করো।
            </p>
          </div>
        </form>

        <footer className="mt-6 text-center text-sm text-gray-400">
          <p>
            স্মরণ করুন: নিরাপত্তার কারণে নতুন পাসওয়ার্ড SMS-এ পাঠানো হতে পারে — পরে লগইন করে
            অবশ্যই পাসওয়ার্ড বদলে নেবো।
          </p>
        </footer>
      </main>
    </div>
    <Footer/>
    </>
    
  );
}
