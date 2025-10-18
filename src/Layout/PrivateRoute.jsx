/* eslint-disable react/prop-types */

import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function PrivateRoute({ redirectTo = "/login", allowedRoles = null }) {
  const location = useLocation();
  const { userInfo, loading: authLoading } = useSelector((s) => s.auth || {});

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-md p-6 flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-green-600 border-gray-200" />
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-800">Checking access…</div>
            <div className="text-sm text-gray-500 mt-1">Please wait a moment</div>
          </div>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const has = allowedRoles.includes(userInfo?.role);
    if (!has) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-md p-6 text-center">
            <div className="text-2xl font-semibold text-gray-900">Access denied</div>
            <div className="mt-2 text-sm text-gray-500">You dont have permission to view this page.</div>
          </div>
        </div>
      );
    }
  }

  return <Outlet />;
}
