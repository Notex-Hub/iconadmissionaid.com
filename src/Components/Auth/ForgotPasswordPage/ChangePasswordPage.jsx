/* src/pages/Auth/ChangePasswordPage.jsx */
import  { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function ChangePasswordPage() {
  const { userInfo } = useSelector((s) => s.auth || {});
  const phoneFromProfile = userInfo?.phone || "";
  const [phone, setPhone] = useState(phoneFromProfile);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    if (!phone) { toast.error("ফোন নম্বর দিতে হবে।"); return false; }
    if (!oldPassword) { toast.error("পুরনো পাসওয়ার্ড দিন।"); return false; }
    if (newPassword.length < 6) { toast.error("নতুন পাসওয়ার্ড কমপক্ষে 6 অক্ষর হওয়া উচিত।"); return false; }
    if (newPassword !== confirmPassword) { toast.error("নতুন পাসওয়ার্ড মিলছে না।"); return false; }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        phone: String(phone).trim(),
        oldPassword,
        newPassword,
        confirmPassword,
      };
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.message || "Password change failed.");
      } else {
        toast.success(data?.message || "Password changed successfully.");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error — try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="bg-white/90 rounded-2xl p-6 sm:p-10 shadow-lg">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Change password</h2>
            <p className="text-sm text-gray-500 mt-1">নিরাপদ রাখতে পুরনো পাসওয়ার্ড দিয়ে নতুন পাসওয়ার্ড সেভ করুন।</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-600">Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200"
                placeholder="017xxxxxxxx"
              />
            </div>

            <div>
              <label className="text-xs text-gray-600">Old password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200"
                placeholder="Enter old password"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600">New password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="At least 6 characters"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Confirm password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="Repeat new password"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full px-4 py-3 rounded-xl text-white font-medium ${loading ? "bg-green-300" : "bg-green-600 hover:bg-green-700"}`}
              >
                {loading ? "Saving..." : "Change password"}
              </button>
            </div>

            <div className="text-xs text-gray-400">
              নোট: এই ফর্মটি পাসওয়ার্ড পরিবর্তনের জন্য — এটি SMS-ভিত্তিক reset ফ্লো নয়।
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
