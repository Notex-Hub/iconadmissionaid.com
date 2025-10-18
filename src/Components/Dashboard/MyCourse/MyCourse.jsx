
import { useSelector } from "react-redux";
import { useGetAllPurchaseQuery } from "../../../../redux/Features/Api/Purchase/Purchase";
import { PurchaseCard } from "./PurchaseCard";

const MyCourse = () => {
  const { userInfo } = useSelector((state) => state.auth || {});
  const { data: purchaseDataResp, isLoading: purchaseLoading } = useGetAllPurchaseQuery({
    studentId: userInfo?._id,
  });
  const purchases = purchaseDataResp?.data ?? [];
  if (purchaseLoading) {
    return (
      <>
       <div className="min-h-screen flex items-center justify-center py-24">
          <div className="animate-pulse space-y-4 w-full max-w-4xl">
            <div className="h-6 bg-gray-200 rounded-md" />
            <div className="h-6 bg-gray-200 rounded-md" />
            <div className="h-64 bg-gray-200 rounded-md" />
          </div>
        </div>

      </>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gray-50  ">
        <div className="container mx-auto ">
          <h2 className="text-2xl font-bold mb-4">My Courses</h2>
          <section className="mb-8">
            <h3 className="text-lg font-medium mb-3">Your purchases</h3>
            {purchases.length === 0 ? (
              <div className="text-sm text-gray-500">You haven not purchased anything yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {purchases.map((p) => (
                  <PurchaseCard key={p._id} p={p} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default MyCourse;
