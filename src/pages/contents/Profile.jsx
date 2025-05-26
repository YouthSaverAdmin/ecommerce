import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaStore, FaCheckCircle } from "react-icons/fa";
import Sell from "./Sell"; // Import Sell modal component

const Profile = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [createStoreModal, setCreateStoreModal] = useState(false);
  const [sellModal, setSellModal] = useState(false);

  const [storeName, setStoreName] = useState("");
  const [userStore, setUserStore] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingStore, setLoadingStore] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoadingProfile(true);
      try {
        const profileRes = await fetch("/api/auth/check", {
          credentials: "include",
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setName(profileData.name);
        } else {
          setName("Guest");
        }

        const storeRes = await fetch("/api/check_store/", {
          credentials: "include",
        });
        if (storeRes.ok) {
          const storeData = await storeRes.json();
          setUserStore(storeData.has_store ? storeData : null);
        } else {
          setUserStore(null);
        }
      } catch {
        setName("Guest");
        setUserStore(null);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserData();
  }, []);

  const handleCreateStore = async () => {
    if (!storeName.trim()) {
      setError("Store name cannot be empty.");
      return;
    }

    setLoadingStore(true);
    try {
      const res = await fetch("/api/create_store/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ store_name: storeName }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Store created!");
        setUserStore({ has_store: true, store_name: storeName });
        setTimeout(() => setCreateStoreModal(false), 1000);
      } else {
        setError(data.error || "Failed to create store.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoadingStore(false);
    }
  };

  const handleBack = () => navigate("/dashboard");

  if (loadingProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-10">
        <p className="text-orange-500 text-xl animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md flex flex-col p-6 space-y-6 sticky top-0 h-screen">
        <h2 className="text-2xl font-bold text-orange-500 mb-6">My Account</h2>
        <div className="flex items-center gap-3 text-orange-600 font-semibold">
          <FaUser size={20} /> Profile
        </div>

        {userStore ? (
          <>
            <div className="flex items-center gap-3 text-green-600 font-semibold">
              <FaCheckCircle size={20} /> Store:{" "}
              <span className="font-normal text-gray-700">{userStore.store_name}</span>
            </div>

            <button
              onClick={() => setSellModal(true)}
              className="mt-3 text-sm text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md transition"
            >
              Sell Item
            </button>
          </>
        ) : (
          <button
            onClick={() => setCreateStoreModal(true)}
            className="flex items-center gap-3 text-orange-600 hover:text-orange-700"
          >
            <FaStore size={20} /> Create Store
          </button>
        )}

        <button
          onClick={handleBack}
          className="flex items-center gap-3 text-gray-600 hover:text-orange-500 mt-10"
        >
          ← Back
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-10 flex flex-col justify-center">
        <div className="bg-white rounded-xl shadow-lg p-10 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold mb-4 text-orange-500">
            Welcome, {name}!
          </h1>
          <p className="text-gray-700 text-lg">This is your profile page.</p>
          {userStore && (
            <p className="mt-4 text-green-600 font-semibold text-lg">
              You own the store <span className="italic">{userStore.store_name}</span>.
            </p>
          )}
        </div>
      </div>

      {/* Create Store Modal */}
      {createStoreModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
          onClick={() => setCreateStoreModal(false)}
        >
          <div
            className="bg-white rounded-lg p-8 w-96 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-6 text-orange-500">
              Create Store
            </h2>
            <input
              type="text"
              placeholder="Store Name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 mb-4"
            />
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
            {success && <p className="text-green-600 text-sm mb-2">{success}</p>}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCreateStoreModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateStore}
                disabled={loadingStore}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                {loadingStore ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sell Modal */}
      {sellModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
          onClick={() => setSellModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Sell closeModal={() => setSellModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
