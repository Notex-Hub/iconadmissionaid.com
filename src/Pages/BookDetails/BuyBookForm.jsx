import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useGetAllBooksQuery } from "../../../redux/Features/Api/books/booksApi";
import { useEffect, useState } from "react";
import Navbar from "../../Components/Home/Navbar/Navbar";
import Footer from "../../Layout/Footer";
import DeliveryOptions from "./DeliveryOptions";
import PaymentOptions from "./PaymentOptions";
import OrderSummary from "./OrderSummary";
import { useCreateBkashMutation } from "../../../redux/Features/Api/Paymentgateway/paymentGatewayApi";

export default function BuyBookForm() {
  const { slug } = useParams();
  const { userInfo } = useSelector((state) => state.auth || {});
  const { data: booksResp, isLoading, isError } = useGetAllBooksQuery();
  const [createBkash] = useCreateBkashMutation();

  const books = booksResp?.data ?? [];
  const book = books.find((b) => b.slug === slug) ?? null;

  const [buyer, setBuyer] = useState({
    name: userInfo?.name || "",
    phone: userInfo?.phone || "",
    address: "",
  });

  useEffect(() => {
    setBuyer({ name: userInfo?.name || "", phone: userInfo?.phone || "", address: "" });
  }, [userInfo]);

  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [deliveryLocation, setDeliveryLocation] = useState("inside");
  const [loading, setLoading] = useState(false);

  const DELIVERY_CHARGES = { inside: 80, outside: 120 };

  function handleBuyerChange(next) {
    setBuyer((s) => ({ ...s, ...next }));
  }

  function validate() {
    if (!buyer.name || !buyer.phone || !buyer.address) return false;
    if (!/^\+?\d{8,15}$/.test(buyer.phone)) return false;
    return true;
  }

  async function handlePlaceOrder() {
    if (!validate()) {
      alert("Enter valid Name, Phone (digits only) and Full Address.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    const bookPrice = (book?.offerPrice && book.offerPrice > 0) ? book.offerPrice : (book?.price ?? 0);
    const deliveryCharge = DELIVERY_CHARGES[deliveryLocation] ?? 0;
    const total = Number(bookPrice) + Number(deliveryCharge);
   const paymentData = await createBkash({ amount: total });
    const orderPayload = {
      name: buyer.name,
      phone: buyer.phone,
      address: buyer.address, 
      subTotal: bookPrice,
      discount: book?.price && bookPrice < book.price ? (book.price - bookPrice) : 0,
      productId: [book?._id],
      userId: userInfo?._id || null,
      charge: 0,
      shiping: deliveryCharge,
      quantity: 1,
      totalAmount: total,
      paidAmount: total,
      path:"/order/create-order",
    };
    localStorage.setItem("lastOrder", JSON.stringify(orderPayload));
    window.location.href = paymentData.data.data?.bkashURL;
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center py-24">
          <div className="animate-pulse space-y-4 w-full max-w-5xl">
            <div className="h-64 bg-gray-200 rounded-2xl shadow-md" />
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

  if (!book) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center py-24 text-gray-500 text-lg">Book not found!</div>
        <Footer />
      </>
    );
  }

  const cover = book.coverPhoto || "/placeholder-book.jpg";
  const payable = (book.offerPrice && book.offerPrice > 0) ? book.offerPrice : (book.price ?? 0);
  const deliveryCharge = DELIVERY_CHARGES[deliveryLocation];
  const grandTotal = Number(payable) + Number(deliveryCharge);

  return (
    <>
      <Navbar />
      <main className="bg-gray-50 min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 ">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow">
                <div className="flex flex-col md:flex-row items-start gap-4">
                  <img src={cover} alt={book.title} className="w-full md:w-48 h-48 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">{book.title}</h1>
                    <p className="text-sm text-gray-500 mt-1">{book.categoryId?.name || "Category"} • {book.bookType || "Type"}</p>
                    <div className="mt-3">
                      <div className="inline-flex items-center gap-3">
                        <span className="text-2xl font-bold text-green-700">৳{payable}</span>
                        {book.offerPrice < book.price && <span className="text-sm text-gray-400 line-through">৳{book.price}</span>}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Seller: {book.createdBy?.name || "-"}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buyer form */}
              <div className="bg-white rounded-2xl p-6 shadow">
                <h3 className="text-lg font-semibold mb-3">Buyer details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Name</label>
                    <input value={buyer.name} onChange={(e) => handleBuyerChange({ name: e.target.value })} className="mt-2 w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-green-400" placeholder="Your full name" />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">Phone</label>
                    <input value={buyer.phone} onChange={(e) => handleBuyerChange({ phone: e.target.value })} className="mt-2 w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-green-400" placeholder="+8801XXXXXXXXX" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-600">Full Address</label>
                    <textarea value={buyer.address} onChange={(e) => handleBuyerChange({ address: e.target.value })} className="mt-2 w-full border border-gray-200 rounded-lg px-4 py-2 h-28 focus:outline-none focus:ring-1 focus:ring-green-400" placeholder="House/Flat, Road, Area, City, Postal Code" />
                  </div>
                </div>
              </div>

              {/* Delivery + Payment sections as separate components */}
              <DeliveryOptions value={deliveryLocation} onChange={setDeliveryLocation} charges={DELIVERY_CHARGES} />

              <div className="bg-white rounded-2xl p-6 shadow">
                <h3 className="text-lg font-semibold mb-3">Payment method</h3>
                <PaymentOptions value={paymentMethod} onChange={setPaymentMethod} />
              </div>

              {/* Place order */}
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  <div>Payable amount</div>
                  <div className="text-2xl font-bold text-gray-900">৳{grandTotal}</div>
                  <div className="text-xs text-gray-500 mt-1">Includes delivery: ৳{deliveryCharge}</div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => handlePlaceOrder("Book purchase")} disabled={loading} className="bg-green-600 cursor-pointer text-white px-5 py-2.5 rounded-xl shadow hover:bg-green-700 transition disabled:opacity-60">{loading ? "Processing..." : "Place Order"}</button>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <OrderSummary cover={cover} title={book.title} payable={payable} deliveryCharge={deliveryCharge} grandTotal={grandTotal} />

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
