/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllCourseQuery } from "../../../redux/Features/Api/Course/CourseApi";
import Footer from "../../Layout/Footer";
import Navbar from "../../Components/Home/Navbar/Navbar";
import CheckoutForm from "./CheckoutForm";
import PaymentOptions from "./PaymentOptions";

export default function BuyCourse() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { data: courseResp, isLoading, isError } = useGetAllCourseQuery();

  const courses = courseResp?.data ?? [];
  const course = courses.find((c) => c.slug === slug) ?? null;

  const [buyer, setBuyer] = useState({
    name: userInfo?.name || "",
    phone: userInfo?.phone || "",
  });

  useEffect(() => {
    setBuyer({
      name: userInfo?.name || "",
      phone: userInfo?.phone || "",
    });
  }, [userInfo]);

  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [loading, setLoading] = useState(false);

  function handleBuyerChange(next) {
    setBuyer((s) => ({ ...s, ...next }));
  }

  function validate() {
    if (!buyer.name || !buyer.phone) return false;
    if (!/^\+?\d{8,15}$/.test(buyer.phone)) return false;
    return true;
  }

  async function handlePlaceOrder(note = "") {
    if (!validate()) {
      alert("Enter valid name and phone (phone digits only).");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const payable = (course?.offerPrice && course.offerPrice > 0) ? course.offerPrice : course?.price ?? 0;
    const orderPayload = {
      id: `ORD-${Date.now()}`,
      course: {
        id: course?._id || slug,
        title: course?.course_title || course?.title || "Unknown Course",
        price: payable,
      },
      buyer,
      paymentMethod,
      note,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("lastOrder", JSON.stringify(orderPayload));
    setLoading(false);
    navigate(`/order-confirmation/${orderPayload.id}`, { state: { order: orderPayload } });
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center py-24">
          <div className="animate-pulse space-y-4 w-full max-w-5xl">
            <div className="h-80 bg-gray-200 rounded-2xl shadow-md" />
            <div className="h-6 bg-gray-200 rounded-md w-3/4 mx-auto" />
            <div className="h-4 bg-gray-200 rounded-md w-1/2 mx-auto" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center py-24 text-red-600 text-lg">
          অনুরোধ নিয়ে সমস্যা হয়েছে — পরে চেক করো।
        </div>
        <Footer />
      </>
    );
  }

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center py-24 text-gray-500 text-lg">
          Course not found!
        </div>
        <Footer />
      </>
    );
  }

  const cover = course.cover_photo || "/course-thumb.jpg";
  const courseTitle = course.course_title || course.course_title;
  const payable = (course.offerPrice && course.offerPrice > 0) ? course.offerPrice : course.price ?? 0;

  return (
    <>
      <Navbar />
      <main className="bg-gray-50 min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 ">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow">
                <div className="flex flex-col md:flex-row items-start gap-4">
                  <img src={cover} alt={courseTitle} className="w-full md:w-56 h-36 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">{courseTitle}</h1>
                    <p className="text-sm text-gray-500 mt-1">{course.category?.title || course.category?.title || ""}</p>
                   
                  </div>
                </div>
              </div>

              <CheckoutForm buyer={buyer} onChange={handleBuyerChange} />

              <div className="bg-white rounded-2xl p-6 shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment method</h3>
                <PaymentOptions value={paymentMethod} onChange={(v) => setPaymentMethod(v)} />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  <div>Payable amount</div>
                  <div className="text-2xl font-bold text-gray-900">৳{payable}</div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handlePlaceOrder("Quick order")}
                    disabled={loading}
                    className="bg-green-600 text-white px-5 py-2.5 rounded-xl shadow hover:bg-green-700 transition disabled:opacity-60"
                  >
                    {loading ? "Processing..." : "Place Order"}
                  </button>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="bg-white rounded-2xl p-5 shadow">
                <div className="flex items-center gap-3">
                  <img src={cover} alt="" className="w-16 h-12 object-cover rounded-md" />
                  <div>
                    <div className="text-sm text-gray-500">Selected Course</div>
                    <div className="font-semibold text-gray-900">{courseTitle}</div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div>Price</div>
                    <div>৳{course.price ?? 0}</div>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-sm font-semibold text-gray-900">
                    <div>Total</div>
                    <div>৳{payable}</div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  After placing the order, follow the payment instructions for Bkash/Nagad to complete the payment.
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow text-sm text-gray-700">
                <div className="font-semibold mb-2">Need help?</div>
                <div className="text-gray-500">Contact support: support@iconaid.com</div>
                <div className="mt-2 text-gray-500">Phone: +8801799-056414</div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
