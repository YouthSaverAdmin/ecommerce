import React from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ Import Link
import { FaUser, FaBoxOpen, FaCog, FaSignOutAlt } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout-user/", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md flex flex-col p-6 space-y-6">
        <h2 className="text-2xl font-bold text-orange-500">My Account</h2>
        <nav className="flex flex-col gap-4">
          <Link to="/profile" className="flex items-center gap-3 hover:text-orange-500">
            <FaUser /> Profile
          </Link>
          <Link to="/orders" className="flex items-center gap-3 hover:text-orange-500">
            <FaBoxOpen /> My Orders
          </Link>
          <Link to="/settings" className="flex items-center gap-3 hover:text-orange-500">
            <FaCog /> Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-600 hover:text-red-700 mt-6"
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-semibold mb-4 text-orange-500">Welcome Back!</h1>
          <p className="text-gray-700">Manage your orders, profile, and settings here.</p>

          {/* Grid content (example cards) */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-orange-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-orange-600">Pending Orders</h3>
              <p className="text-sm text-gray-700">You have 2 pending items.</p>
            </div>
            <div className="bg-orange-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-orange-600">Vouchers</h3>
              <p className="text-sm text-gray-700">3 available vouchers.</p>
            </div>
            <div className="bg-orange-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-orange-600">Messages</h3>
              <p className="text-sm text-gray-700">No new messages.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
