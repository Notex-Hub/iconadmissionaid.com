import { useEffect, useState } from "react";
import useOrder from "../../../Hooks/useOrder";
import CantenStaffNavbar from "../CantenStaffNavbar/CantenStaffNavbar";
import { axiosPublic } from "../../../Hooks/usePublic";
import { toast } from "react-toastify";
import { FaEdit, FaEye, FaTrashAlt } from "react-icons/fa";

const Order = () => {
  const [orders, refetch] = useOrder();
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewOrderDetails, setViewOrderDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [orderStatus, setOrderStatus] = useState("Pending");

  useEffect(() => {
    if (orders?.data) {
      setLoading(false);
    }
  }, [orders]);

  // Handle order deletion
  const handleDelete = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        setLoading(true);
        await axiosPublic.delete(`/preOrder/${orderId}`);
        toast.success("Order deleted successfully");
        refetch();
      } catch (error) {
        console.error("Error deleting order:", error);
        toast.error(error.response?.data?.message || "Failed to delete order");
      } finally {
        setLoading(false);
      }
    }
  };

  // Open edit modal
  const openEditModal = (order) => {
    setSelectedOrder(order);
    setOrderStatus(order.status);
    setShowEditModal(true);
  };

  // Open view details modal
  const openViewDetailsModal = (order) => {
    setViewOrderDetails(order);
    setShowDetailsModal(true);
  };

  // Update order status
  const updateOrderStatus = async () => {
    try {
      setLoading(true);
      await axiosPublic.patch(`/preOrder/${selectedOrder._id}`, {
        status: orderStatus,
      });
      toast.success("Order status updated successfully");
      refetch();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update order status"
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculate total number of items in an order
  const getTotalItems = (order) => {
    return order.selected_meals?.length || 0;
  };

  return (
    <div className="container mx-auto p-4">
        <CantenStaffNavbar />
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold mb-6">Order Management</h2>

        {loading ? (
          <div className="text-center py-8">Loading orders...</div>
        ) : orders?.data?.length > 0 ? (
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
                    Customer
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
                {orders.data.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order._id.substring(order._id.length - 8)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {order.user?.name || "Guest"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user?.contact || "No contact info"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getTotalItems(order)} items
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openViewDetailsModal(order)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded-full"
                          title="View details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => openEditModal(order)}
                          className="p-1 text-green-600 hover:bg-green-100 rounded-full"
                          title="Edit order status"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                          title="Delete order"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No orders found.</div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && viewOrderDetails && (
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
                Order ID: {viewOrderDetails._id}
              </p>
              <p className="font-medium mt-1">Customer Information</p>
              <p className="text-sm">
                Name: {viewOrderDetails.user?.name || "Guest"}
              </p>
              <p className="text-sm">
                Contact: {viewOrderDetails.user?.contact || "No contact info"}
              </p>
              <p className="text-sm">
                Address:{" "}
                {viewOrderDetails.user?.address || "No address provided"}
              </p>
            </div>

            <div className="mb-4">
              <p className="font-medium">Order Status</p>
              <p>
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    viewOrderDetails.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : viewOrderDetails.status === "Cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {viewOrderDetails.status}
                </span>
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
                    {viewOrderDetails.selected_meals?.map((meal, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm">{meal.name}</td>
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
                        {viewOrderDetails.total_price
                          ? viewOrderDetails.total_price.toFixed(2)
                          : "0.00"}
                      </td>
                    </tr>
                  </tfoot>
                </table>
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

      {/* Edit Order Status Modal */}
      {showEditModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] max-w-[95%]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Update Order Status</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Order ID:{" "}
                {selectedOrder._id.substring(selectedOrder._id.length - 8)}
              </p>
              <p className="text-sm">
                Customer: {selectedOrder.user?.name || "Guest"}
              </p>
              <p className="text-sm mb-4">
                Total: $
                {selectedOrder.total_price
                  ? selectedOrder.total_price.toFixed(2)
                  : "0.00"}
              </p>

              <label className="block text-sm font-medium mb-1">
                Order Status
              </label>
              <select
                className="w-full border p-2 rounded-md"
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={updateOrderStatus}
                className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition-colors"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;