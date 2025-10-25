import  { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../../Components/Home/Navbar/Navbar";
import Footer from "../../Layout/Footer";
import { useGetAllExamQuery } from "../../../redux/Features/Api/Exam/Exam";
import { useCreateBkashMutation } from "../../../redux/Features/Api/Paymentgateway/paymentGatewayApi";

const ExampleCouponDB = {
  ICON10: { type: "percent", value: 10, label: "10% off" },
  SAVE50: { type: "fixed", value: 50, label: "50 TK off" },
};

const ExamCheckout = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [createBkash] = useCreateBkashMutation();
  const { userInfo } = useSelector((s) => s.auth || {});
  const { data: examData, isLoading, isError } = useGetAllExamQuery();
  const exams = examData?.data ?? [];

  const exam = useMemo(() => {
    if (!slug) return null;
    const s = slug.trim().toLowerCase();
    return (
      exams.find((e) => e?.slug && e.slug.trim().toLowerCase() === s) ?? null
    );
  }, [exams, slug]);

  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const price = Number(exam?.price ?? exam?.amount ?? 0);
  const subtotal = price;
  const discount = useMemo(() => {
    if (!couponApplied) return 0;
    if (couponApplied.type === "percent")
      return Math.round((subtotal * couponApplied.value) / 100);
    if (couponApplied.type === "fixed") return couponApplied.value;
    return 0;
  }, [couponApplied, subtotal]);
  const total = Math.max(subtotal - discount, 0);

  const handleApplyCoupon = () => {
    setCouponError("");
    setCouponApplied(null);
    const code = (coupon || "").trim().toUpperCase();
    if (!code) {
      setCouponError("কুপন কোড দিন।");
      return;
    }
    const found = ExampleCouponDB[code];
    if (!found) {
      setCouponError("অবৈধ কুপন কোড।");
      return;
    }
    setCouponApplied(found);
  };

  const handleCheckout = async () => {
    if (!exam) {
      alert("এক্সাম পাওয়া যায়নি।");
      return;
    }
    if (!userInfo) {
      navigate(`/exam/${slug}/start`, {
        state: { redirectTo: `/checkout/${slug}` },
      });
      return;
    }

    setIsCheckingOut(true);
    try {
      const paymentData =await createBkash({amount: total});
      const payload = {
      name: userInfo?.name || "",
      number: userInfo?.phone || "",
      intersted: `PaidExam`,
      crmStatus:"Pending",
      status:"Processing",
      path:"/free-test/create-free-test",
      navigate:`/exam/${exam?.slug}`
      };
      localStorage.setItem("lastOrder", JSON.stringify(payload));
      window.location.href = paymentData.data.data?.bkashURL;
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed. আবার চেষ্টা করুন।");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        লোড হচ্ছে...
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        এক্সাম লোড করতে সমস্যা হয়েছে।
      </div>
    );

  if (!exam)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        এক্সাম পাওয়া যায়নি।
      </div>
    );

  const image =
    exam.image ?? exam.moduleId?.cover_photo ?? "/public/university/default.png";

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="absolute inset-x-0 top-0 z-50">
        <Navbar />
      </div>

      <main className="container mx-auto px-4 pt-28 pb-20">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 md:p-10 space-y-8">
          {/* Header */}
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Exam Checkout
          </h2>

          {/* Exam Info */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-56 rounded-xl overflow-hidden shadow-sm">
              <img
                src={image}
                alt={exam.examTitle}
                className="w-full h-36 object-cover"
              />
            </div>
            <div className="flex-1 text-center md:text-left space-y-2">
              <h3 className="text-xl font-semibold text-[#7a0000]">
                {exam.examTitle}
              </h3>
              <p className="text-sm text-gray-500">
                {exam.moduleId?.moduleTitle}
              </p>
              <div className="text-lg font-medium text-gray-700">
                <span className="text-gray-600">Price:</span>{" "}
                <span className="text-[#c21010] font-bold">{price} TK</span>
              </div>
            </div>
          </div>

          {/* Coupon */}
          <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Apply Coupon
            </h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Enter Coupon Code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg bg-white border border-gray-200 focus:ring-2 focus:ring-[#c21010] outline-none"
              />
              <button
                onClick={handleApplyCoupon}
                className="px-5 py-3 bg-[#c21010] text-white rounded-lg font-medium hover:bg-[#a50e0e] transition"
              >
                Apply
              </button>
            </div>
            {couponError && (
              <p className="text-sm text-red-500 mt-2">{couponError}</p>
            )}
            {couponApplied && (
              <p className="text-sm text-green-600 mt-2">
                Coupon Applied: {couponApplied.label}
              </p>
            )}
          </div>

          {/* Summary */}
          <div className="bg-gray-50 p-5 rounded-xl shadow-sm space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{subtotal} TK</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>-{discount} TK</span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-gray-900 border-t border-gray-200 pt-3">
              <span>Total</span>
              <span>{total} TK</span>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="text-center">
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className={`w-full md:w-1/2 cursor-pointer py-4 rounded-xl text-white font-semibold shadow-md transition ${
                isCheckingOut
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#c21010] hover:bg-[#a50e0e]"
              }`}
            >
              {isCheckingOut ? "Processing..." : "Checkout"}
            </button>
            <p className="text-sm text-gray-500 mt-3">
              Secure payment. You will be redirected to payment gateway.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ExamCheckout;
