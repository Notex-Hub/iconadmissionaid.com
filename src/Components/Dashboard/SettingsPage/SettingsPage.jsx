/* src/pages/Settings/SettingsPage.jsx */
import  { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function SettingsPage() {
  const { userInfo } = useSelector((s) => s.auth || {});
  const phoneFromProfile = userInfo?.phone || "";
  const [activeTab, setActiveTab] = useState("change"); // "change" | "forgot"

  const [loading, setLoading] = useState(false);

  // common states
  const [phone, setPhone] = useState(phoneFromProfile);

  // for change password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function resetFields() {
    setPhone(phoneFromProfile);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (!phone) return toast.error("ফোন নম্বর দিতে হবে।");
    if (!oldPassword) return toast.error("পুরনো পাসওয়ার্ড দিন।");
    if (newPassword.length < 6) return toast.error("নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে।");
    if (newPassword !== confirmPassword) return toast.error("পাসওয়ার্ড মিলছে না।");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, oldPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) toast.error(data?.message || "Password change failed.");
      else toast.success(data?.message || "Password changed successfully!");
    } catch {
      toast.error("Network error!");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    if (!phone) return toast.error("ফোন নম্বর দিতে হবে।");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) toast.error(data?.message || "SMS পাঠানো যায়নি!");
      else toast.success(data?.message || "SMS পাঠানো হয়েছে! নতুন পাসওয়ার্ডটি SMS এ দেখুন।");
    } catch {
      toast.error("Network error!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className=" bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4">
      <div className=" w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-2">
            পাসওয়ার্ড পরিবর্তন করুন অথবা পাসওয়ার্ড ভুলে গেলে SMS-এর মাধ্যমে নতুনটি পান।
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => {
              setActiveTab("change");
              resetFields();
            }}
            className={`px-4 py-2  rounded-xl text-sm font-medium ${
              activeTab === "change"
                ? "bg-green-600 text-white shadow"
                : "bg-gray-100 cursor-pointer text-gray-700 hover:bg-gray-200"
            }`}
          >
            Change Password
          </button>

          <button
            onClick={() => {
              setActiveTab("forgot");
              resetFields();
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${
              activeTab === "forgot"
                ? "bg-green-600 text-white shadow"
                : "bg-gray-100 cursor-pointer text-gray-700 hover:bg-gray-200"
            }`}
          >
            Forgot Password
          </button>
        </div>

        {/* Form area */}
        {activeTab === "change" ? (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="text-xs text-gray-600">Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017xxxxxxxx"
                className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200"
              />
            </div>

            <div>
              <label className="text-xs text-gray-600">Old password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter old password"
                className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600">New password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Confirm password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-medium ${
                loading ? "bg-green-300" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Saving..." : "Change Password"}
            </button>

            <div className="text-xs text-gray-400">
              * পুরনো পাসওয়ার্ড দিয়ে পরিবর্তন করা যাবে।
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-5">
            <div>
              <label className="text-xs text-gray-600">Phone number</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017xxxxxxxx"
                className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200"
              />
            </div>

            <div className="p-3 rounded-xl bg-green-50 text-sm text-green-800">
              পাসওয়ার্ড ভুলে গেছো? কোনো সমস্যা নেই!  
              ফোন নম্বর দিলে ঐ নাম্বারে নতুন পাসওয়ার্ড SMS এ পাঠানো হবে।  
              সেটি দিয়েই লগইন করতে পারবে।
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-medium ${
                loading ? "bg-green-300" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Sending..." : "Send Reset SMS"}
            </button>

            <div className="text-xs text-gray-400 text-center">
              SMS এ নতুন পাসওয়ার্ড পেলে সেটি দিয়েই লগইন করো।
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
