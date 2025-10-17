/* eslint-disable react/prop-types */
import { useLocation, useParams, Link } from "react-router-dom";
import Navbar from "../../Components/Home/Navbar/Navbar";
import Footer from "../../Layout/Footer";

export default function OrderConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const order = location.state?.order || JSON.parse(localStorage.getItem("lastOrder") || "null");

  if (!order || order.id !== id) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center py-24">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800">Order not found</h2>
            <p className="text-gray-500 mt-2">We couldnt find the order. If you just placed it, try again in a moment.</p>
            <div className="mt-4">
              <Link to="/courses" className="text-indigo-600 hover:underline">Back to courses</Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-gray-50 min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-2xl p-8 shadow">
            <h1 className="text-2xl font-bold text-gray-900">Order placed</h1>
            <p className="mt-2 text-gray-600">Your order <span className="font-medium">{order.id}</span> is created. Status: <span className="font-semibold">{order.status}</span></p>

            <div className="mt-6 grid grid-cols-1 gap-4">
              <div className="p-4 rounded-lg bg-green-50">
                <div className="text-sm text-gray-700">Payment method</div>
                <div className="font-semibold">{order.paymentMethod}</div>
              </div>

              <div className="p-4 rounded-lg bg-gray-50">
                <div className="text-sm text-gray-700">Buyer</div>
                <div className="font-semibold">{order.buyer.name} — {order.buyer.phone}</div>
              </div>

              <div className="p-4 rounded-lg bg-white shadow-sm">
                <div className="text-sm text-gray-700">Course</div>
                <div className="font-semibold">{order.course.title}</div>
                <div className="text-sm text-gray-500">Amount: ৳{order.course.price}</div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Link to="/courses" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Browse more courses</Link>
              <button onClick={() => alert("Follow payment instructions sent via SMS/Email (simulated).")} className="px-4 py-2 border rounded-lg">How to pay</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
