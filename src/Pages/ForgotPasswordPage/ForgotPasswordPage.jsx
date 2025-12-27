/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Home/Navbar/Navbar";
import Footer from "../../Layout/Footer";
import { useLoginMutation } from "../../../redux/Features/Api/Auth/AuthApi";
import { userLoggedIn } from "../../../redux/Features/Api/Auth/AuthSlice";

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState(""); // নতুন পাসওয়ার্ডের জন্য স্টেট
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // ১ মানে ফোন নম্বর, ২ মানে পাসওয়ার্ড ইনপুট

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userLogin] = useLoginMutation();

  const normalizePhone = (v = "") => v.replace(/[^\d+]/g, "");
  const isValidPhone = (v = "") => /^\+?\d{8,15}$/.test(normalizePhone(v));

  // ধাপ ১: রিসেট রিকোয়েস্ট (SMS পাঠানো)
  async function handleForgotPassword(e) {
    e?.preventDefault?.();

    if (!phone || !isValidPhone(phone)) {
      toast.error("সঠিক ফোন নম্বর দিন।");
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
      try { data = await res.json(); } catch (err) { }

      if (!res.ok) {
        toast.error(data?.message || "SMS পাঠানো যায়নি!");
      } else {
        toast.success(data?.message || "SMS পাঠানো হয়েছে!");
        setStep(2); // সফল হলে ২য় ধাপে নিয়ে যাবে
      }
    } catch (err) {
      toast.error("Network error! ইন্টারনেট সংযোগ পরীক্ষা করুন।");
    } finally {
      setLoading(false);
    }
  }

  // ধাপ ২: নতুন পাসওয়ার্ড দিয়ে লগইন
  async function handleLoginWithNewPassword(e) {
    e?.preventDefault?.();
    if (!newPassword || newPassword.length < 4) {
      toast.error("SMS-এ পাওয়া সঠিক পাসওয়ার্ডটি দিন।");
      return;
    }

    setLoading(true);
    try {
      const result = await userLogin({ 
        phone: normalizePhone(phone), 
        password: newPassword 
      }).unwrap();

      const token = result?.data?.accessToken ?? result?.accessToken ?? result?.token;
      const user = result?.data?.user ?? result?.user ?? result?.data;

      if (token && user) {
        dispatch(userLoggedIn({ user, token }));
        toast.success("লগইন সফল হয়েছে!");
        navigate("/"); // হোম পেজে নিয়ে যাবে
      }
    } catch (err) {
      toast.error("লগইন করা যায়নি। সঠিক পাসওয়ার্ড দিন।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4">
        <main className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-white shadow-2xl">
          
          <header className="mb-6">
            <h1 className="text-2xl font-extrabold">
              {step === 1 ? "পাসওয়ার্ড রিসেট" : "লগইন করুন"}
            </h1>
            <p className="mt-1 text-sm text-gray-300">
              {step === 1 
                ? "ফোন নম্বর লিখে নতুন পাসওয়ার্ড SMS এ পেয়ে যাবে।" 
                : "আপনার ফোনে পাঠানো পাসওয়ার্ডটি নিচে লিখে প্রবেশ করুন।"}
            </p>
          </header>

          {step === 1 ? (
            /* STEP 1: ফোন নম্বর ইনপুট */
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-200 mb-2">ফোন নম্বর</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+8801XXXXXXXXX"
                  className="w-full px-4 py-3 rounded-xl bg-white/6 border border-white/8 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 font-semibold hover:scale-[1.01] transition disabled:opacity-60 cursor-pointer"
                >
                  {loading ? "পাঠানো হচ্ছে..." : "Next (SMS পাঠান)"}
                </button>
              </div>
            </form>
          ) : (
            /* STEP 2: পাসওয়ার্ড ইনপুট ও লগইন */
            <form onSubmit={handleLoginWithNewPassword} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-200 mb-2">SMS পাসওয়ার্ড</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="পাসওয়ার্ড দিন"
                  className="w-full px-4 py-3 rounded-xl bg-white/6 border border-white/8 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 font-semibold hover:scale-[1.01] transition disabled:opacity-60 cursor-pointer"
                >
                  {loading ? "লগইন হচ্ছে..." : "Login"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-gray-400 hover:text-white underline"
                >
                  ফোন নম্বর ভুল? আবার লিখুন
                </button>
              </div>
            </form>
          )}

          <div className="text-center text-xs text-gray-400 mt-8 border-t border-white/10 pt-4">
            <p>সহযোগিতার জন্য আমাদের সাপোর্টে যোগাযোগ করুন।</p>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}