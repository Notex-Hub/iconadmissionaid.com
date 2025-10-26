import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useExecuteBkashMutation } from "../../../redux/Features/Api/Paymentgateway/paymentGatewayApi";
import { useCretaePurchaseMutation } from "../../../redux/Features/Api/Purchase/Purchase";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [executeBkash] = useExecuteBkashMutation();
  const [createPurchase] = useCretaePurchaseMutation();

  const didRunRef = useRef(false);

  useEffect(() => {
    if (didRunRef.current) return;
    didRunRef.current = true;

    const paymentID = searchParams.get("paymentID");
    const status = searchParams.get("status");
    const token = searchParams.get("token");

    async function verifyPayment() {
      if (status === "success" && paymentID) {
        try {
          const processedKey = `bkash_processed_${paymentID}`;
          if (sessionStorage.getItem(processedKey)) {
            return; 
          }

          const { data } = await executeBkash({ paymentID, token }).unwrap();

          if (data?.trxID) {
            const lastOrderStr = localStorage.getItem("lastOrder");
            const lastOrder = lastOrderStr ? JSON.parse(lastOrderStr) : null;

            const orderPayload = {
              ...lastOrder,
              paymentStatus: "Paid",
              paymentInfo: {
                transactionId: data.trxID,
                method: "Bkash",
                accountNumber: data?.payerAccount,
              },
            };

            await createPurchase(orderPayload).unwrap();

            sessionStorage.setItem(processedKey, "1");
            localStorage.removeItem("lastOrder");
            toast.success("Payment verified and purchase completed!");
            /* orderPayload */
            if(orderPayload.navigate){
              navigate(orderPayload.navigate, { replace: true });
              return; 
            }
           navigate("/dashboard/my-courses", { replace: true });

          } else {
            toast.error("Payment verification failed!");
          }
        } catch (error) {
          console.error(error);
          toast.error("Payment verification failed!");
        }
      } else {
        toast.error("Payment canceled or failed!");
        navigate("/", { replace: true });

      }
    }

    verifyPayment();
  }, [searchParams, executeBkash, createPurchase, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-lg">
      <h2 className="text-gray-700 font-semibold mb-2">Payment Processing...</h2>
      <p className="text-gray-500">Please wait, verifying your payment.</p>
    </div>
  );
}
