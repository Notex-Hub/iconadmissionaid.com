import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"
import { useExecuteBkashMutation } from "../../../redux/Features/Api/Paymentgateway/paymentGatewayApi";
import { useCretaePurchaseMutation } from "../../../redux/Features/Api/Purchase/Purchase";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [executeBkash] = useExecuteBkashMutation();
  const [createPurchase] = useCretaePurchaseMutation();

  useEffect(() => {
    const paymentID = searchParams.get("paymentID");
    const status = searchParams.get("status");

    async function verifyPayment() {
      if (status === "success" && paymentID) {
        try {
          const { data } = await executeBkash({ paymentID }).unwrap();
          if (data?.trxID) {
            const lastOrder = JSON.parse(localStorage.getItem("lastOrder"));
            // if (!lastOrder) {
            //   toast.error("No order data found!");
            //   navigate("/");
            //   return;
            // }
            const orderPayload = {
              ...lastOrder,
              paymentStatus:"Paid",
              paymentInfo:{
                transactionId: data.trxID,
                method:"Bkash",
                accountNumber:data?.payerAccount
              }
            };
            await createPurchase(orderPayload).unwrap();
            localStorage.removeItem("lastOrder");

            // toast.success("✅ আপনার পেমেন্ট সফলভাবে সম্পন্ন হয়েছে!");
            // setTimeout(() => navigate("/my-courses"), 2000);
          } else {
            toast.error("Payment verification failed!");
           //navigate("/");
          }
        } catch (error) {
          console.error(error);
          toast.error("Payment verification failed!");
         //navigate("/");
        }
      } else {
        toast.error("Payment canceled or failed!");
       //navigate("/");
      }
    }

    verifyPayment();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-lg">
      <h2 className="text-gray-700 font-semibold mb-2">Payment Processing...</h2>
      <p className="text-gray-500">Please wait, verifying your payment.</p>
    </div>
  );
}
