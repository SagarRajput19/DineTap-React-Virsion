// 🔹 Inner Firebase config and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDG1HDiAHG5TB3vqDed_MVTN8xxny1q7QE",
    authDomain: "menumanage-4ea99.firebaseapp.com",
    projectId: "menumanage-4ea99",
    storageBucket: "menumanage-4ea99.appspot.com",
    messagingSenderId: "1089709348043",
    appId: "1:1089709348043:web:c9be5fd07223216198f74e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get restaurant ID from URL
const urlParams = new URLSearchParams(window.location.search);
const restaurantId = urlParams.get("restaurant");

// Selectors
const foodListContainer = document.getElementById("foodList");
const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");

// Store food items globally for filtering
let foodItems = [];

// Fetch food items for this restaurant
async function loadFoodItems() {
    if (!restaurantId) {
        document.body.innerHTML = "<h2>Invalid QR Code</h2>";
        return;
    }

    const foodQuery = query(collection(db, "foods"), where("userId", "==", restaurantId));

    try {
        const snapshot = await getDocs(foodQuery);
        foodItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        displayFoodItems(foodItems);
    } catch (error) {
        alert("Error fetching food items: " + error.message);
    }
}

// Function to display filtered food items
function displayFoodItems(filteredItems) {
    foodListContainer.innerHTML = ""; // Clear previous items

    if (filteredItems.length === 0) {
        foodListContainer.innerHTML = "<p>No food items found.</p>";
        return;
    }

    filteredItems.forEach(data => {
        const foodItem = document.createElement("div");
        foodItem.classList.add("food-item");
        foodItem.innerHTML = `
            <img src="${data.imageUrl}" width="100" height="100">
            <div class="info">
                <div class="name-price"> 
                    <p><strong>${data.foodName}</strong></p>
                    <p class="price">₹${data.price}</p>
                </div>
                <p class="dis">${data.description}</p>          
            </div>            
        `;
        foodListContainer.appendChild(foodItem);
    });
}

// Search & Filter Logic
function filterFoodItems() {
    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = filterCategory.value.toLowerCase();

    const filteredItems = foodItems.filter(item => {
        const matchesSearch = item.foodName.toLowerCase().includes(searchText);
        const matchesCategory = selectedCategory === "all" || item.category.toLowerCase() === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    displayFoodItems(filteredItems);
}

// Attach event listeners
searchInput.addEventListener("input", filterFoodItems);
filterCategory.addEventListener("change", filterFoodItems);

// Load food items on page load
loadFoodItems();
