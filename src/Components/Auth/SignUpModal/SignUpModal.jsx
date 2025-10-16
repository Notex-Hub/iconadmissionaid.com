/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

export default function SignUpModal({ open, onClose }) {
  console.log("open", open)
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (open) {
      setStep(1);
      setName("");
      setPhone("");
      setPassword("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-6 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {step === 1 ? "Sign Up" : "Verify Code"}
          </h2>
          <button onClick={onClose} className="text-white/80 cursor-pointer hover:text-white">
            ✕
          </button>
        </div>

        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(2);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block mb-1 text-sm">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 placeholder-white/60 focus:ring-2 focus:ring-red-400 outline-none"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+8801XXXXXXXXX"
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 placeholder-white/60 focus:ring-2 focus:ring-red-400 outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#5D0000] hover:bg-red-700 py-2 rounded-xl font-semibold transition"
            >
              Continue
            </button>
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Password verification will be handled by backend.");
              onClose();
            }}
            className="space-y-4"
          >
            <p className="text-sm text-gray-200">
              একটি পাসওয়ার্ড আপনার মোবাইলে SMS এর মাধ্যমে পাঠানো হয়েছে।
            </p>
            <div>
              <label className="block mb-1 text-sm">Enter Password</label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password from SMS"
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 placeholder-white/60 focus:ring-2 focus:ring-red-400 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#5D0000] hover:bg-red-700 py-2 rounded-xl font-semibold transition"
            >
              Verify & Continue
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full py-2 text-sm text-gray-300 hover:underline"
            >
              Change Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
