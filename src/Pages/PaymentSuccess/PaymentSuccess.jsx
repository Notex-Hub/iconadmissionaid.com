import  { useEffect, useRef } from "react";
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

    const status_code = searchParams.get("status_code");
    const issuer_payment_ref = searchParams.get("issuer_payment_ref");
    const paymentID = searchParams.get("paymentID");
    const status = searchParams.get("status");
    const token = searchParams.get("token");

    async function verifyPayment() {
      const getLastOrder = () => {
        try {
          const lastOrderStr = localStorage.getItem("lastOrder");
          return lastOrderStr ? JSON.parse(lastOrderStr) : null;
        } catch (e) {
          console.error("Failed to parse lastOrder from localStorage", e);
          return null;
        }
      };

      if (status === "success" && paymentID) {
        try {
          const processedKey = `bkash_processed_${paymentID}`;
          if (sessionStorage.getItem(processedKey)) {
            // already handled
            navigate("/dashboard/my-courses", { replace: true });
            return;
          }

          const response = await executeBkash({ paymentID, token }).unwrap();

          const trxID = response?.data?.trxID || response?.trxID || null;

          if (!trxID) {
            toast.error("Payment verification failed: no transaction id returned.");
            navigate("/", { replace: true });
            return;
          }

          const lastOrder = getLastOrder();
          if (!lastOrder) {
            toast.error("Order data not found. Please contact support.");
            navigate("/", { replace: true });
            return;
          }

          const orderPayload = {
            ...lastOrder,
            paymentStatus: "Paid",
            paymentInfo: {
              transactionId: trxID,
              method: "Bkash",
              accountNumber: response?.data?.payerAccount || response?.payerAccount || null,
            },
          };

          await createPurchase(orderPayload).unwrap();

          sessionStorage.setItem(processedKey, "1");
          localStorage.removeItem("lastOrder");

          toast.success("Payment verified and purchase completed!");

          if (orderPayload.navigate) {
            navigate(orderPayload.navigate, { replace: true });
            return;
          }

          navigate("/dashboard/my-courses", { replace: true });
        } catch (error) {
          console.error("Bkash verification error:", error);
          toast.error("Payment verification failed!");
          navigate("/", { replace: true });
        }

        return;
      }

      if (status_code === "00_0000_000" && issuer_payment_ref) {
        try {
          const processedKey = `bkash_processed_${issuer_payment_ref}`; 
          if (sessionStorage.getItem(processedKey)) {
            navigate("/dashboard/my-courses", { replace: true });
            return;
          }

          const lastOrder = getLastOrder();
          if (!lastOrder) {
            toast.error("Order data not found. Please contact support.");
            navigate("/", { replace: true });
            return;
          }

          const orderPayload = {
            ...lastOrder,
            paymentStatus: "Paid",
            paymentInfo: {
              transactionId: issuer_payment_ref,
              method: "Nagad",
            },
          };

          await createPurchase(orderPayload).unwrap();

          sessionStorage.setItem(processedKey, "1");
          localStorage.removeItem("lastOrder");

          toast.success("Payment verified and purchase completed!");

          if (orderPayload.navigate) {
            navigate(orderPayload.navigate, { replace: true });
            return;
          }

          navigate("/dashboard/my-courses", { replace: true });
        } catch (error) {
          console.error("Issuer/Nagad verification error:", error);
          toast.error("Payment verification failed!");
          navigate("/", { replace: true });
        }

        return;
      }

      toast.error("Payment canceled or failed!");
      navigate("/", { replace: true });
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
