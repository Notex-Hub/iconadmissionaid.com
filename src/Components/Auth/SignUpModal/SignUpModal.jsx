import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useCreateStudentMutation } from "../../../../redux/Features/Api/Student/StudentApi";
import { useLoginMutation } from "../../../../redux/Features/Api/Auth/AuthApi";

export default function SignUpModal({ open, onClose }) {
  const [createStudent] = useCreateStudentMutation();
  const [loginStudent] = useLoginMutation();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const nameRef = useRef(null);

  useEffect(() => {
    if (open) {
      setStep(1);
      setName("");
      setPhone("");
      setPassword("");
      setError(null);
      setLoading(false);
      setTimeout(() => nameRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  // Simple Bangladeshi phone validation: +8801XXXXXXXXX or 01XXXXXXXXX
  const isValidPhone = (p) => {
    if (!p) return false;
    const normalized = p.trim();
    const bdRegex = /^(?:\+8801|01)[0-9]{9}$/;
    return bdRegex.test(normalized);
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isValidPhone(phone)) {
      setError(
        "Please enter a valid Bangladeshi phone number (e.g. +8801XXXXXXXXX or 01XXXXXXXXX)."
      );
      return;
    }

    try {
      setLoading(true);
      // Send initial create request to trigger SMS with password/OTP
      // The backend is expected to accept { name, phone } to start the flow.
      await createStudent({ name: name.trim(), phone: phone.trim() }).unwrap();
      setStep(2);
    } catch (err) {
      // err may be a FetchBaseQueryError or plain Error depending on RTK Query setup
      setError(
        err?.data?.message ||
          err?.message ||
          "Failed to request verification. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!password.trim()) {
      setError("Please enter the password you received via SMS.");
      return;
    }

    try {
      setLoading(true);
      // Finalize creation by including the password/OTP. Backend should handle create/verify.
      await loginStudent({
        phone: phone.trim(),
        password: password.trim(),
      }).unwrap();

      // success -> close modal (or you could redirect / show success message)
      onClose();
    } catch (err) {
      setError(
        err?.data?.message ||
          err?.message ||
          "Verification failed. Please check the code and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm ${
          loading ? "pointer-events-none" : "cursor-pointer"
        }`}
        onClick={() => {
          if (!loading) onClose();
        }}
        aria-hidden="true"
      ></div>

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-6 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {step === 1 ? "Sign Up" : "Verify Code"}
          </h2>
          <button
            onClick={() => {
              if (!loading) onClose();
            }}
            className="text-white/80 cursor-pointer hover:text-white"
            aria-label="Close sign up modal"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-3 text-sm text-red-300 bg-red-900/30 p-2 rounded">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm" htmlFor="signup-name">
                Full Name
              </label>
              <input
                id="signup-name"
                ref={nameRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 placeholder-white/60 focus:ring-2 focus:ring-red-400 outline-none"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm" htmlFor="signup-phone">
                Phone Number
              </label>
              <input
                id="signup-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+8801XXXXXXXXX"
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 placeholder-white/60 focus:ring-2 focus:ring-red-400 outline-none"
                required
                inputMode="tel"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "bg-[#5D0000] hover:bg-red-700"
              } py-2 rounded-xl font-semibold transition`}
            >
              {loading ? "Sending..." : "Continue"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <p className="text-sm text-gray-200">
              একটি পাসওয়ার্ড আপনার মোবাইলে SMS এর মাধ্যমে পাঠানো হয়েছে।
            </p>
            <div>
              <label className="block mb-1 text-sm" htmlFor="signup-password">
                Enter Password
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password from SMS"
                className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 placeholder-white/60 focus:ring-2 focus:ring-red-400 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "bg-[#5D0000] hover:bg-red-700"
              } py-2 rounded-xl font-semibold transition`}
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>

            <button
              type="button"
              onClick={() => {
                if (!loading) setStep(1);
              }}
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

SignUpModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
