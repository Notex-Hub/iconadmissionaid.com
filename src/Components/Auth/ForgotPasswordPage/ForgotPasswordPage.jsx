/* src/pages/Auth/ForgotPasswordPage.jsx */
import  { useState } from "react";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  function isValidPhone(p) {
    const s = String(p || "").trim();
    // simple bangladesh-style validation (10-11 digits)
    return /^[0-9]{10,13}$/.test(s);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerMessage("");
    if (!isValidPhone(phone)) {
      toast.error("ভুল ফোন নম্বর — সঠিক ফোন নম্বর লিখুন।");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: String(phone).trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data?.message || "রিসেট করা যায়নি — পরে চেষ্টা করুন।";
        toast.error(msg);
      } else {
        setDone(true);
        setServerMessage(data?.message || "A new password has been sent via SMS.");
        toast.success(data?.message || "একটি SMS পাঠানো হয়েছে।");
      }
    } catch (err) {
      console.error(err);
      toast.error("নেটওয়ার্ক সমস্যা — আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-.7.4-1 1-1h.01M12 19v-6" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Password reset</h1>
              <p className="text-sm text-gray-500 mt-1">ফোন নম্বর দিন — আমরা SMS-এ একটি নতুন পাসওয়ার্ড পাঠিয়ে দিচ্ছি।</p>
            </div>
          </div>

          {!done ? (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-xs text-gray-600">Phone number</label>
                <div className="mt-2">
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017xxxxxxxx"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200 text-gray-800"
                    aria-label="phone"
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1">SMS-এ পাঠানো পাসওয়ার্ড দিয়ে লগইন করতে হবে।</div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full px-4 py-3 rounded-xl text-white font-medium ${loading ? "bg-green-300" : "bg-green-600 hover:bg-green-700"}`}
                >
                  {loading ? "Sending..." : "Send reset SMS"}
                </button>
              </div>

              <div className="text-center text-xs text-gray-400">
                যদি ঠিকানা না পায়, সেবা প্রদানকারীর সাথে যোগাযোগ করুন।
              </div>
            </form>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-lg bg-green-50">
                <div className="text-sm text-green-800 font-medium">SMS sent</div>
                <div className="text-sm text-gray-700 mt-1">{serverMessage || "আপনার ফোনে একটি SMS পাঠানো হয়েছে — সেটাতে থাকা পাসওয়ার্ড দিয়ে লগইন করুন।"}</div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-gray-500">কীভাবে ব্যবহার করবে</div>
                <ol className="text-sm text-gray-700 list-decimal list-inside space-y-1">
                  <li>SMS-এ যেটা পাবেন, সেটা নতুন পাসওয়ার্ড হবে।</li>
                  <li>লগইন করার পরে Account → Change Password থেকে পাসওয়ার্ড পরিবর্তন করুন।</li>
                </ol>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => { setDone(false); setPhone(""); setServerMessage(""); }}
                  className="w-full px-4 py-3 rounded-xl bg-white shadow text-sm text-gray-700"
                >
                  Reset another number
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          OTP নয় — এই ফ্লোতে সার্ভার সরাসরি SMS এ নতুন পাসওয়ার্ড পাঠায়। যদি তোমার backend আলাদা ফ্লো করে (OTP), সে অনুযায়ী UI বদলাতে হবে।
        </div>
      </div>
    </div>
  );
}
