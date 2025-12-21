/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useGetAllCourseQuery } from "../../../redux/Features/Api/Course/CourseApi";
import Footer from "../../Layout/Footer";
import Navbar from "../../Components/Home/Navbar/Navbar";
import CheckoutForm from "./CheckoutForm";
import PaymentOptions from "./PaymentOptions";
import { useCreatePaymentMethodMutation } from "../../../redux/Features/Api/Paymentgateway/paymentGatewayApi";
import { toast } from "react-toastify";

export default function BuyCourse() {
  const { slug } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const [createPaymentMethod] = useCreatePaymentMethodMutation();
  const { data: courseResp, isLoading, isError } = useGetAllCourseQuery();

  const courses = courseResp?.data ?? [];
  const course = courses.find((c) => c.slug === slug) ?? null;

  // Initializing buyer state with userInfo if available
  const [buyer, setBuyer] = useState({
    name: userInfo?.name || "",
    phone: userInfo?.phone || "",
  });

  useEffect(() => {
    if (userInfo) {
      setBuyer({
        name: userInfo?.name || "",
        phone: userInfo?.phone || "",
      });
    }
  }, [userInfo]);

  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [loading, setLoading] = useState(false);

  function handleBuyerChange(next) {
    setBuyer((s) => ({ ...s, ...next }));
  }

  // Validation before purchase
  function validate() {
    if (!buyer.name || buyer.name.trim() === "") {
      toast.error("আপনার পুরো নাম প্রদান করুন।");
      return false;
    }
    if (!buyer.phone || !/^\+?\d{10,15}$/.test(buyer.phone)) {
      toast.error("সঠিক মোবাইল নম্বর প্রদান করুন।");
      return false;
    }
    return true;
  }

  // Price Calculation
  const rawPrice = course?.offerPrice ?? course?.price ?? 0;
  const payable =
    course?.offerPrice && Number(course.offerPrice) > 0
      ? Number(course.offerPrice)
      : Number(course?.price ?? 0);

  const isFreeCourse = Number(rawPrice) === 0;

  async function handlePlaceOrder() {
    if (!validate()) return;
    if (!course?._id) {
      toast.error("কোর্সটি খুঁজে পাওয়া যায়নি!");
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        courseId: course?._id,
        price: isFreeCourse ? 0 : payable,
        subtotal: isFreeCourse ? 0 : payable,
        discount: 0,
        charge: 0,
        totalAmount: isFreeCourse ? 0 : payable,
        studentId: userInfo?._id || undefined, // Guest হলে undefined যাবে, ব্যাকএন্ড ফোন দিয়ে ইউজার হ্যান্ডেল করবে
        name: buyer.name.trim(),
        phone: buyer.phone.trim(),
        navigate: "/dashboard/my-courses",
        path: "/purchase/create-purchase",
        paymentStatus: isFreeCourse ? "Paid" : "Pending",
      };

      // --- Scenario 1: Free Course Enrollment ---
      if (isFreeCourse) {
        const res = await fetch(
          "https://sandbox.iconadmissionaid.com/api/v1/purchase/create-purchase",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {}),
            },
            body: JSON.stringify(orderPayload),
          }
        );

        const result = await res.json();
        if (!res.ok) {
          throw new Error(result?.message || "এনরোলমেন্ট সম্পন্ন করা সম্ভব হয়নি।");
        }

        toast.success("অভিনন্দন! আপনি সফলভাবে ফ্রি কোর্সে এনরোল করেছেন।");
        // লগইন থাকলে ড্যাশবোর্ডে, না থাকলে লগইন পেজে
        setTimeout(() => {
          window.location.href = userInfo ? "/dashboard/my-courses" : "/login";
        }, 1500);
        return;
      }

      // --- Scenario 2: Paid Course (Payment Gateway) ---
      localStorage.setItem("lastOrder", JSON.stringify(orderPayload));

      const paymentData = await createPaymentMethod({ 
        amount: payable, 
        path: paymentMethod 
      });

      const bkashURL = 
        paymentData?.data?.data?.bkashURL || 
        paymentData?.data?.bkashURL || 
        paymentData?.bkashURL;

      if (!bkashURL) {
        throw new Error("পেমেন্ট গেটওয়ে রেসপন্স করছে না। আবার চেষ্টা করুন।");
      }

      // Redirect user to bKash gateway
      window.location.href = bkashURL;

    } catch (err) {
      console.error(err);
      toast.error(err?.message || "অর্ডার প্রসেস করার সময় ত্রুটি হয়েছে।");
    } finally {
      setLoading(false);
    }
  }

  // --- Render Sections ---
  if (isLoading) return <LoadingSkeleton />;
  if (isError || !course) return <ErrorView message={isError ? "Error loading course" : "Course not found"} />;

  const cover = course.cover_photo || "/course-thumb.jpg";

  return (
    <>
      <Navbar />
      <main className="bg-gray-50 min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Form and Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <img src={cover} alt={course.course_title} className="w-full md:w-56 h-32 object-cover rounded-xl" />
                  <div className="text-center md:text-left">
                    <h1 className="text-2xl font-bold text-gray-900">{course.course_title}</h1>
                    <p className="text-sm text-[#8B0000] font-semibold mt-1 uppercase tracking-wider">
                      {course.category?.title}
                    </p>
                  </div>
                </div>
              </div>

              <CheckoutForm buyer={buyer} onChange={handleBuyerChange} />

              {!isFreeCourse && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-2 h-6 bg-[#8B0000] rounded-full"></span>
                    Payment Method
                  </h3>
                  <PaymentOptions value={paymentMethod} onChange={(v) => setPaymentMethod(v)} />
                </div>
              )}

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-50 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Payable Amount</p>
                  <p className="text-3xl font-black text-gray-900">৳{isFreeCourse ? 0 : payable}</p>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="bg-[#8B0000] text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-red-100 hover:bg-red-800 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? "Processing..." : isFreeCourse ? "Enroll Now" : "Pay & Complete"}
                </button>
              </div>
            </div>

            {/* Right Column: Summary Card */}
            <aside className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Course Price</span>
                    <span>৳{Number(course.price) || 0}</span>
                  </div>
                  {Number(course.offerPrice) > 0 && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Discount</span>
                      <span>-৳{Number(course.price) - Number(course.offerPrice)}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-dashed flex justify-between font-black text-lg text-gray-900">
                    <span>Total</span>
                    <span>৳{isFreeCourse ? 0 : payable}</span>
                  </div>
                </div>
                
                <div className="mt-6 bg-red-50 p-4 rounded-xl">
                  <p className="text-[11px] text-[#8B0000] leading-relaxed">
                    {isFreeCourse 
                      ? "এটি একটি ফ্রি এনরোলমেন্ট। সাবমিট করার সাথে সাথেই আপনি কোর্সে এক্সেস পাবেন।"
                      : "পেমেন্ট সম্পন্ন হওয়ার পর আপনি আপনার ড্যাশবোর্ডে কোর্সটি দেখতে পাবেন।"}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-2xl p-6 text-white text-center">
                 <p className="text-xs text-gray-400 mb-1">Need help?</p>
                 <p className="font-bold text-sm">+880 1799 056414</p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// --- Internal Helper Components ---

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-[#8B0000] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-400 font-bold tracking-widest text-xs uppercase">Preparing Checkout...</p>
    </div>
  );
}

function ErrorView({ message }) {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <p className="text-red-500 font-medium text-lg">{message}</p>
      <button onClick={() => window.location.reload()} className="px-6 py-2 bg-gray-800 text-white rounded-lg">Retry</button>
    </div>
  );
}