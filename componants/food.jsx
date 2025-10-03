import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import "../styles/food.css";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import QRCode from "qrcode.react";
import { LogOut, Edit, Trash2 } from "lucide-react";

// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDG1HDiAHG5TB3vqDed_MVTN8xxny1q7QE",
  authDomain: "menumanage-4ea99.firebaseapp.com",
  databaseURL: "https://menumanage-4ea99-default-rtdb.firebaseio.com",
  projectId: "menumanage-4ea99",
  storageBucket: "menumanage-4ea99.appspot.com",
  messagingSenderId: "1089709348043",
  appId: "1:1089709348043:web:c9be5fd07223216198f74e",
  measurementId: "G-PMKF7PWGCZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function FoodAdmin() {
  const [user, setUser] = useState(null);
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch logged in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchFoods(currentUser.uid); // pass uid
      } else {
        window.location.href = "/login";
      }
    });
    return () => unsubscribe();
  }, []);

  // ✅ Fetch food items from Firestore
  const fetchFoods = async (uid) => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "foods"));
      const foodList = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((food) => food.userId === uid); // Only current user's foods
      setFoods(foodList);
    } catch (error) {
      console.error("Error fetching foods:", error);
    }
    setLoading(false);
  };

  // ✅ Add new food
  const addFood = async () => {
    const name = prompt("Enter food name:");
    const category = prompt("Enter category:");
    const price = prompt("Enter price:");
    const description = prompt("Enter description:");
    const imageUrl = prompt("Enter image URL:");
    if (name && category && price && description && imageUrl && user) {
      await addDoc(collection(db, "foods"), {
        name,
        category,
        price,
        description,
        imageUrl,
        userId: user.uid, // save user id
      });
      fetchFoods(user.uid);
    }
  };

  // ✅ Edit food
  const editFood = async (food) => {
    const newName = prompt("Edit food name:", food.name);
    const newCategory = prompt("Edit category:", food.category);
    const newPrice = prompt("Edit price:", food.price);
    const newDescription = prompt("Edit description:", food.description);
    const newImageUrl = prompt("Edit image URL:", food.imageUrl);
    if (
      newName &&
      newCategory &&
      newPrice &&
      newDescription &&
      newImageUrl
    ) {
      const foodRef = doc(db, "foods", food.id);
      await updateDoc(foodRef, {
        name: newName,
        category: newCategory,
        price: newPrice,
        description: newDescription,
        imageUrl: newImageUrl,
      });
      fetchFoods(user.uid);
    }
  };

  // ✅ Delete food
  const deleteFood = async (id) => {
    if (window.confirm("Delete this food?")) {
      await deleteDoc(doc(db, "foods", id));
      fetchFoods(user.uid);
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    signOut(auth).then(() => (window.location.href = "/login"));
  };

  // ✅ Filter + Search
  const filteredFoods = foods.filter((food) => {
    const matchCategory =
      filterCategory === "all" || food.category === filterCategory;
    const matchSearch = (food.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-red-500">🍴 DineTap Admin</h1>
        <div className="flex items-center gap-4">
          {user && <span className="text-gray-700">{user.email}</span>}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      {/* QR Code */}
      <div className="flex justify-center my-4">
        {user && (
          <QRCode
            value={`${window.location.origin}/restaurant-menu?restaurant=${user.uid}`}
            size={128}
          />
        )}
      </div>

      {/* Controls */}
      <div className="max-w-4xl mx-auto flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All Categories</option>
          <option value="veg">Veg</option>
          <option value="non-veg">Non-Veg</option>
          <option value="drinks">Drinks</option>
        </select>
        <button
          onClick={addFood}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          + Add Food
        </button>
      </div>

      {/* Food List */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-4">
        {loading ? (
          <p className="text-center">Loading foods...</p>
        ) : filteredFoods.length === 0 ? (
          <p className="text-center text-gray-500">No foods found</p>
        ) : (
          <ul className="divide-y">
            {filteredFoods.map((food) => (
              <li
                key={food.id}
                className="flex justify-between items-center p-3 hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">{food.name || "Unnamed Food"}</p>
                  <p className="text-sm text-gray-500">
                    {food.category || "Uncategorized"} | ₹ {food.price || "-"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {food.description || "No description"}
                  </p>
                  {food.imageUrl && (
                    <img
                      src={food.imageUrl}
                      alt={food.name}
                      className="mt-1 w-36 h-24 object-cover rounded"
                    />
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => editFood(food)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => deleteFood(food.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
