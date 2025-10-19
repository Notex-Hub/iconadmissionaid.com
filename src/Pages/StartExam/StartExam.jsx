import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../../redux/Features/Api/Auth/AuthApi";

const StartExam = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [register, { isLoading: apiLoading }] = useRegisterMutation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const loading = apiLoading;
  const validatePhone = (p) => {
    const cleaned = p.replace(/\D/g, "");
    return /^01\d{9}$/.test(cleaned);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!name.trim()) {
      setError("নাম দেয়া আবশ্যক।");
      return;
    }

    if (!validatePhone(phone)) {
      setError("বৈধ একটি মোবাইল নম্বর দিন (যেমন: 01XXXXXXXXX)");
      return;
    }

    try {
      const res = await register({
        name: name.trim(),
        phone: phone.trim(),
        examSlug: slug,
      }).unwrap();

      console.log("Register Response:", res);

      if (res?.status === true || res?.success) {
        setInfo("তোমার নম্বরে একটি পাসওয়ার্ড/OTP পাঠানো হয়েছে। সেটি দিয়ে লগইন করো।");
        setTimeout(() => {
          navigate(`/exam/${slug}`, {
            state: { name: name.trim(), phone: phone.trim() },
          });
        }, 1000);
      } else {
        setError(res?.message || "রেজিস্ট্রেশন সম্পন্ন করা যায়নি।");
      }
    } catch (err) {
      console.error("Register Error:", err);
      setError(err?.data?.message || "সার্ভারে সমস্যা হয়েছে, পরে আবার চেষ্টা করুন।");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">
        <div className="bg-black text-white rounded-lg p-8 shadow-lg border border-gray-800">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="mb-4">
              <img
                src="/path-to-your-logo.png"
                alt="ICON"
                className="h-14 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <h2 className="text-xl font-bold tracking-wide">রেজিস্ট্রেশন / লগ ইন</h2>
          </div>

          {/* Instructions */}
          <div className="mb-4 text-sm text-gray-300 text-center leading-relaxed">
            <p>
              নিচে তোমার <span className="text-[#ff4444] font-medium">নাম</span> ও{" "}
              <span className="text-[#ff4444] font-medium">মোবাইল নম্বর</span> দাও।
              তোমার নম্বরে একটি <strong>পাসওয়ার্ড / OTP</strong> পাঠানো হবে —
              সেটি দিয়ে লগইন করে পরীক্ষায় অংশগ্রহণ করতে পারবে।
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1">নাম</label>
              <input
                type="text"
                placeholder="তোমার নাম লিখুন"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">মোবাইল নম্বর</label>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="01XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none"
                maxLength={14}
              />
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}
            {info && <p className="text-xs text-green-400">{info}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-md font-medium text-white ${
                loading ? "bg-gray-500 cursor-not-allowed" : "bg-[#c21010] hover:bg-[#a50e0e]"
              }`}
            >
              {loading ? "লোড হচ্ছে..." : "রেজিস্টার / শুরু করো"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-gray-500 text-sm">
            <p>
              এই পরীক্ষা:{" "}
              <span className="text-white font-medium">{slug}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartExam;
