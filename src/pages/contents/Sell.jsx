import React, { useState } from "react";

const Sell = ({ closeModal }) => {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleSell = async () => {
    if (!itemName || !price || !image) {
      setMessage("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("item_name", itemName);
    formData.append("price", price);
    formData.append("image", image);

    try {
      const res = await fetch("/api/sell_item/", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Item listed successfully!");
        setTimeout(() => closeModal(), 1500);
      } else {
        setMessage(data.error || "Failed to list item.");
      }
    } catch (e) {
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 w-96 animate-fadeIn">
      <h2 className="text-2xl font-semibold mb-4 text-orange-500">Sell Item</h2>

      <input
        type="text"
        placeholder="Item Name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        className="w-full mb-3 border border-gray-300 rounded-md p-3"
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full mb-3 border border-gray-300 rounded-md p-3"
      />

      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="w-full mb-4"
      />

      {message && <p className="text-sm text-center mb-3 text-orange-600">{message}</p>}

      <div className="flex justify-end gap-3">
        <button
          onClick={closeModal}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleSell}
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
        >
          Sell
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {opacity: 0; transform: translateY(-10px);}
          to {opacity: 1; transform: translateY(0);}
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default Sell;
