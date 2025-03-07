/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import useOrder from "../../../Hooks/useOrder";
import useProfile from "../../../Hooks/useProfile";
import { FaEye } from "react-icons/fa";
import StudentNavbar from "../StudentNavbar/StudentNavbar";

const MyOrder = () => {
  const [orders, refetch] = useOrder();
  const { profile } = useProfile();

  const [studentOrders, setStudentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filter orders for the current student when data is available
  useEffect(() => {
    if (orders?.data && profile?._id) {
      // Filter orders where the user ID matches the current student's ID
      const filteredOrders = orders.data.filter(
        (order) => order.user && order.user._id === profile._id
      );
      setStudentOrders(filteredOrders);
      setLoading(false);
    }
  }, [orders, profile]);

  // Open order details modal
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  // Format date to readable string
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate total number of items in an order
  const getTotalItems = (order) => {
    return order.selected_meals?.length || 0;
  };

  return (
    <div className="container mx-auto p-4">
      <StudentNavbar />
      <div className="bg-white rounded-lg shadow-md border p-6">
        <h2 className="text-2xl font-bold mb-4">My Orders</h2>
        <p className="text-gray-600 mb-6">
          View your order history and check order statuses
        </p>

        {loading ? (
          <div className="text-center py-8">Loading your orders...</div>
        ) : studentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Items
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order._id
                          .substring(order._id.length - 8)
                          .toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.createdAt
                          ? formatDate(order.createdAt)
                          : "Date not available"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getTotalItems(order)} items
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.selected_meals
                          ?.slice(0, 1)
                          .map((meal) => meal.name)
                          .join(", ")}
                        {order.selected_meals?.length > 1
                          ? ` +${order.selected_meals.length - 1} more`
                          : ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        $
                        {order.total_price
                          ? order.total_price.toFixed(2)
                          : "0.00"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        <FaEye size={14} /> View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <div className="text-gray-500 mb-2">
              You haven&apos;t placed any orders yet.
            </div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              Browse Menu
            </button>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-w-[95%] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Order Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Order ID: {selectedOrder._id}
              </p>
              {selectedOrder.createdAt && (
                <p className="text-sm text-gray-500">
                  Date: {formatDate(selectedOrder.createdAt)}
                </p>
              )}
            </div>

            <div className="mb-4">
              <p className="font-medium">Order Status</p>
              <p>
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    selectedOrder.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : selectedOrder.status === "Cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {selectedOrder.status}
                </span>
              </p>
            </div>

            <div className="mb-4">
              <p className="font-medium">Delivery Address</p>
              <p className="text-sm">
                {selectedOrder.user?.address || "No address specified"}
              </p>
            </div>

            <div className="mb-4">
              <p className="font-medium">Order Items</p>
              <div className="mt-2 border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        Item
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                      >
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedOrder.selected_meals?.map((meal, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm">
                          <div className="font-medium">{meal.name}</div>
                          <div className="text-xs text-gray-500">
                            {meal.category}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-sm capitalize">
                          {meal.type}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          $
                          {typeof meal.price === "number"
                            ? meal.price.toFixed(2)
                            : meal.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td
                        colSpan="2"
                        className="px-4 py-2 text-sm font-medium text-right"
                      >
                        Total:
                      </td>
                      <td className="px-4 py-2 text-sm font-medium">
                        $
                        {selectedOrder.total_price
                          ? selectedOrder.total_price.toFixed(2)
                          : "0.00"}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <p className="font-medium mb-1">Nutritional Information</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Total Calories: </span>
                  {selectedOrder.selected_meals?.reduce(
                    (total, meal) => total + (meal.calories || 0),
                    0
                  )}
                </div>
                <div>
                  <span className="text-gray-500">Total Protein: </span>
                  {selectedOrder.selected_meals?.reduce((total, meal) => {
                    const proteinValue = meal.protein
                      ? parseInt(meal.protein.replace("g", ""))
                      : 0;
                    return total + proteinValue;
                  }, 0)}
                  g
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrder;
