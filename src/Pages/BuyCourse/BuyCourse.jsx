/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useGetAllCourseQuery } from "../../../redux/Features/Api/Course/CourseApi";
import Footer from "../../Layout/Footer";
import Navbar from "../../Components/Home/Navbar/Navbar";
import CheckoutForm from "./CheckoutForm";
import PaymentOptions from "./PaymentOptions";
import { useCreateBkashMutation } from "../../../redux/Features/Api/Paymentgateway/paymentGatewayApi";
import { toast } from "react-toastify";

export default function BuyCourse() {
  const { slug } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const [createBkash] = useCreateBkashMutation();
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

  // ---- helpers ----
  const rawPrice = course?.offerPrice ?? course?.price ?? 0;
  const payable =
    course?.offerPrice && Number(course.offerPrice) > 0
      ? Number(course.offerPrice)
      : Number(course?.price ?? 0);

  const isFreeCourse =
    rawPrice === "0" || rawPrice === 0 || Number(rawPrice) === 0;

  async function handlePlaceOrder() {
    if (!userInfo) {
      toast.error("Please login to continue");
      return;
    }

    if (!validate()) {
      toast.error("Enter valid name and phone (phone digits only).");
      return;
    }

    if (!course?._id) {
      toast.error("Course not found!");
      return;
    }

    setLoading(true);
    try {
      // common payload
      const orderPayload = {
        courseId: course?._id,
        price: isFreeCourse ? 0 : payable,
        subtotal: isFreeCourse ? 0 : payable,
        discount: 0,
        charge: 0,
        totalAmount: isFreeCourse ? 0 : payable,
        studentId: userInfo._id,
        name: buyer.name,
        phone: buyer.phone,
        path: "/purchase/create-purchase",
        paymentStatus:"Paid"
      };

      if (isFreeCourse) {
        const res = await fetch(
          "https://sandbox.iconadmissionaid.com/api/v1/purchase/create-purchase",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(userInfo?.token
                ? { Authorization: `Bearer ${userInfo.token}` }
                : {}),
            },
            body: JSON.stringify(orderPayload),
          }
        );

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.message || "Failed to create free purchase");
        }
        const data = await res.json().catch(() => ({}));
        localStorage.setItem("lastOrder", JSON.stringify(orderPayload));
        toast.success("Enrollment completed for free course!");
        window.location.href = "/dashboard/my-courses";
        return;
      }

      await new Promise((r) => setTimeout(r, 900));

      const paymentData = await createBkash({ amount: payable });
      localStorage.setItem("lastOrder", JSON.stringify(orderPayload));
      const bkashURL =
        paymentData?.data?.data?.bkashURL ||
        paymentData?.data?.bkashURL ||
        paymentData?.bkashURL;

      if (!bkashURL) {
        throw new Error("bKash URL not returned from gateway.");
      }

      window.location.href = bkashURL;
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
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

  return (
    <>
      <Navbar />
      <main className="bg-gray-50 min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 ">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow">
                <div className="flex flex-col md:flex-row items-start gap-4">
                  <img
                    src={cover}
                    alt={courseTitle}
                    className="w-full md:w-56 h-36 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {courseTitle}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                      {course.category?.title || ""}
                    </p>
                  </div>
                </div>
              </div>

              <CheckoutForm buyer={buyer} onChange={handleBuyerChange} />

              <div className="bg-white rounded-2xl p-6 shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Payment method
                </h3>
                <PaymentOptions
                  value={paymentMethod}
                  onChange={(v) => setPaymentMethod(v)}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  <div>Payable amount</div>
                  <div className="text-2xl font-bold text-gray-900">
                    ৳{isFreeCourse ? 0 : payable}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handlePlaceOrder("Quick order")}
                    disabled={loading}
                    className="bg-green-600 text-white px-5 py-2.5 rounded-xl shadow hover:bg-green-700 transition disabled:opacity-60"
                  >
                    {loading ? "Processing..." : isFreeCourse ? "Enroll Free" : "Place Order"}
                  </button>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="bg-white rounded-2xl p-5 shadow">
                <div className="flex items-center gap-3">
                  <img
                    src={cover}
                    alt=""
                    className="w-16 h-12 object-cover rounded-md"
                  />
                  <div>
                    <div className="text-sm text-gray-500">Selected Course</div>
                    <div className="font-semibold text-gray-900">
                      {courseTitle}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div>Price</div>
                    <div>৳{Number(rawPrice) || 0}</div>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-sm font-semibold text-gray-900">
                    <div>Total</div>
                    <div>৳{isFreeCourse ? 0 : payable}</div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  {isFreeCourse
                    ? "This is a free enrollment. Click Enroll Free to complete."
                    : "After placing the order, follow the payment instructions for bKash/Nagad to complete the payment."}
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
