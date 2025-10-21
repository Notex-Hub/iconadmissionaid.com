import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCreateStudentMutation } from "../../../redux/Features/Api/Student/StudentApi";
import { useLoginMutation } from "../../../redux/Features/Api/Auth/AuthApi";
import { userLoggedIn } from "../../../redux/Features/Api/Auth/AuthSlice";

export default function StartExamPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [createStudent] = useCreateStudentMutation();
  const [loginStudent] = useLoginMutation();

  const intersted = "Free Test";

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const nameRef = useRef(null);

  useEffect(() => {
    setStep(1);
    setName("");
    setPhone("");
    setPassword("");
    setError("");
    setInfo("");
    setLoading(false);
    setTimeout(() => nameRef.current?.focus(), 50);
  }, []);

  const validatePhone = (p) => {
    if (!p) return false;
    const cleaned = p.replace(/\D/g, "");
    return /^01\d{9}$/.test(cleaned) || /^8801\d{9}$/.test(cleaned);
  };

  const postFreeTest = async ({ name: n, number: num, intersted: intr = "" }) => {
    const payload = { name: n, number: num, intersted: intr };
    const res = await fetch(
      "https://sandbox.iconadmissionaid.com/api/v1/free-test/create-free-test",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(data?.message || `Free-test API error (${res.status})`);
    }
    return data;
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!name.trim()) {
      setError("নাম দেয়া আবশ্যক।");
      return;
    }
    if (!validatePhone(phone)) {
      setError("বৈধ একটি মোবাইল নম্বর দিন (যেমন: 01XXXXXXXXX বা +8801XXXXXXXXX)");
      return;
    }
    try {
      setLoading(true);
      await createStudent({ name: name.trim(), phone: phone.trim() }).unwrap();
      setStep(2);
      setInfo("আপনার মোবাইলে একটি পাসওয়ার্ড পাঠানো হয়েছে। দয়া করে তা দিন।");
    } catch (err) {
      setError(err?.data?.message || err?.message || "রেজিস্ট্রেশন অনুরোধ ব্যর্থ হয়েছে। পরে চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!password.trim()) {
      setError("অনুগ্রহ করে SMS থেকে প্রাপ্ত পাসওয়ার্ড দিন।");
      return;
    }
    try {
      setLoading(true);
      const res = await loginStudent({ phone: phone.trim(), password: password.trim() }).unwrap();
      const token =
        res?.data?.data?.accessToken || res?.data?.accessToken || res?.accessToken || res?.token;
      const user =
        res?.data?.data?.user || res?.data?.user || res?.user || res?.data?.data?.student;
      if (!token || !user) {
        throw new Error("সার্ভার থেকে অকার্যকর রেসপন্স পাওয়া গেছে।");
      }
      dispatch(userLoggedIn({ user, token }));
      try {
        await postFreeTest({ name: name.trim(), number: phone.trim(), intersted });
      } catch (freeErr) {
        console.warn("Free-test API failed:", freeErr);
        setInfo("নোট: Free Test রেজিস্ট্রেশন ব্যর্থ হয়েছে (background)।");
      }
      navigate(`/exam/${slug || ""}`, { state: { name: name.trim(), phone: phone.trim(), intersted } });
    } catch (err) {
      setError(err?.data?.message || err?.message || "ভেরিফিকেশন ব্যর্থ হয়েছে। কোডটি পরীক্ষা করুন ও পুনরায় চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">
        <div className="bg-black text-white rounded-lg p-8 shadow-lg border border-gray-800">
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
            <h2 className="text-xl font-bold tracking-wide">{step === 1 ? "রেজিস্ট্রেশন" : "পাসওয়ার্ড যাচাই"}</h2>
          </div>

          <div className="mb-4 text-sm text-gray-300 text-center leading-relaxed">
            <p>
              নিচে তোমার <span className="text-[#ff4444] font-medium">নাম</span> ও{" "}
              <span className="text-[#ff4444] font-medium">মোবাইল নম্বর</span> দাও।{step === 1 ? " রেজিস্ট্রেশনের জন্য তথ্য পূরণ করো।" : " তোমার মোবাইলে পাঠানো পাসওয়ার্ড দিন।"}
            </p>
          </div>

          {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
          {info && <p className="text-xs text-green-400 mb-3">{info}</p>}

          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">নাম</label>
                <input
                  type="text"
                  placeholder="তোমার নাম লিখুন"
                  value={name}
                  ref={nameRef}
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

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-md font-medium text-white ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-[#c21010] hover:bg-[#a50e0e]"}`}
              >
                {loading ? "পাঠানো হচ্ছে..." : "নেক্সট"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">পাসওয়ার্ড</label>
                <input
                  type="password"
                  placeholder="SMS থেকে পাসওয়ার্ড দিন"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-md bg-white text-black placeholder-gray-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-md font-medium text-white ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-[#c21010] hover:bg-[#a50e0e]"}`}
              >
                {loading ? "যাচাই করা হচ্ছে..." : "যাচাই করে শুরু করো"}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!loading) {
                    setStep(1);
                    setPassword("");
                    setError("");
                    setInfo("");
                    setTimeout(() => nameRef.current?.focus(), 50);
                  }
                }}
                className="w-full py-3 rounded-md font-medium text-gray-300 hover:underline"
              >
                নম্বর বদলাও
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-gray-500 text-sm">
            <p>
              এই পরীক্ষা: <span className="text-white font-medium">{slug || intersted}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
