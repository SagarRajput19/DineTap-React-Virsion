// src/components/Admin.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../src/firebase-config";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

function Admin() {
  const [restaurantName, setRestaurantName] = useState("");
  const [foodName, setFoodName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState({});
  const [displayItems, setDisplayItems] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Check login state and fetch food items
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setRestaurantName(user.email);
        await fetchFoodItems(user.uid);
      } else {
        window.location.href = "/login";
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ Fetch food items from Firestore
  const fetchFoodItems = async (userId) => {
    try {
      const foodQuery = query(collection(db, "foods"), where("userId", "==", userId));
      const snapshot = await getDocs(foodQuery);
      const foodItems = snapshot.docs.map(doc => doc.data());

      if (foodItems.length === 0) return;

      const categorized = {};
      foodItems.forEach(item => {
        if (item.category) {
          if (!categorized[item.category]) categorized[item.category] = [];
          categorized[item.category].push(item);
        }
      });

      setCategories(categorized);
      setDisplayItems(foodItems);
    } catch (error) {
      console.error("Error fetching food items:", error);
    }
  };

  // ✅ Handle search
  useEffect(() => {
    if (!searchTerm) {
      const allItems = Object.values(categories).flat();
      setDisplayItems(allItems);
    } else {
      const filtered = Object.values(categories)
        .flat()
        .filter(item => item.foodName.toLowerCase().includes(searchTerm.toLowerCase()));
      setDisplayItems(filtered);
    }
  }, [searchTerm, categories]);

  // ✅ Add new food item
  const handleAddFood = async (e) => {
    e.preventDefault();
    if (!foodName || !imageUrl || !category || !price || !description) {
      alert("Please fill all fields correctly!");
      return;
    }

    const user = auth.currentUser;
    if (user) {
      try {
        await addDoc(collection(db, "foods"), {
          foodName,
          imageUrl,
          category,
          price: parseFloat(price),
          description,
          userId: user.uid,
        });
        alert("Food item added successfully!");
        setFoodName(""); setImageUrl(""); setCategory(""); setPrice(""); setDescription("");
        await fetchFoodItems(user.uid);
      } catch (error) {
        alert("Error adding food: " + error.message);
      }
    }
  };

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      alert("Error logging out: " + error.message);
    }
  };

  // ✅ Filter by category
  const handleCategoryClick = (categoryName) => {
    setDisplayItems(categories[categoryName]);
  };

  return (
    <div className="admin-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">Dine<span>Tap</span></div>
        <ul className="nav-links">
          <a className="btn" href="/food">📋&nbsp; View your restaurant</a>
          <a className="btn" href="/food">⛶&nbsp; Get your QR code</a>
          <li className="user-item" id="userIcon">
            <i className="fa-solid fa-user" style={{ color: "white", fontSize: "25px" }}></i>
            <div className="dropdown-content">
              <p><span>{restaurantName}</span></p>
              <button onClick={handleLogout}><i className="fa-solid fa-sign-out-alt"></i>&nbsp; Logout</button>
            </div>
          </li>
        </ul>
      </nav>

      {/* Floating Images */}
      <div className="floating-images">
        <img src="/assets/pasta.png" alt="pasta" />
        <img src="/assets/fries.png" alt="fries" />
        <img src="/assets/bread.png" alt="bread" />
        <img src="/assets/hotdog.png" alt="hotdog" />
        <img src="/assets/noodel.png" alt="noodel" />
      </div>

      <h1 className="welcome">Welcome To Admin Dashboard</h1>
      <p><span>{restaurantName}</span></p>

      {/* Mainboard */}
      <div className="mainboard">
        <form onSubmit={handleAddFood}>
          <input type="text" placeholder="Food Name" value={foodName} onChange={(e) => setFoodName(e.target.value)} required />
          <input type="text" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
          <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
          <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
          <button type="submit" className="subtn">Add Food</button>
          <a className="subt" href="/food">📄&nbsp; View Food Items</a>
        </form>
      </div>

      {/* Search */}
      <div className="search-container">
        <input type="text" placeholder="Search food..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {/* Sidebar */}
      <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
      <div className={`sidebar ${sidebarOpen ? "show" : ""}`}>
        <h2>Added Items</h2>
        <h3>Categories <span>Types</span></h3>
        <ul>
          {Object.keys(categories).map(cat => (
            <li key={cat} className="category-item" onClick={() => handleCategoryClick(cat)}>
              {cat} <span className="item-count">{categories[cat].length}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Food List */}
      <div className="food-list-container">
        {displayItems.map((item, index) => (
          <div className="food-item" key={index}>
            <h4>{item.foodName}</h4>
            <p>Category: {item.category}</p>
            <p>Price: ₹{item.price}</p>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;
