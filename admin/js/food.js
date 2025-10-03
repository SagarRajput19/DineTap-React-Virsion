// 🔹 Firebase Config & Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDG1HDiAHG5TB3vqDed_MVTN8xxny1q7QE",
    authDomain: "menumanage-4ea99.firebaseapp.com",
    databaseURL: "https://menumanage-4ea99-default-rtdb.firebaseio.com",
    projectId: "menumanage-4ea99",
    storageBucket: "menumanage-4ea99.appspot.com",
    messagingSenderId: "1089709348043",
    appId: "1:1089709348043:web:c9be5fd07223216198f74e",
    measurementId: "G-PMKF7PWGCZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Auth check
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Generate QR code
        const restaurantId = user.uid;
        const menuUrl = `${window.location.origin}/restaurant-menu.html?restaurant=${restaurantId}`;
        document.getElementById("qrCode").src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(menuUrl)}`;

        // Load food items
        loadFoodItems();
    } else {
        window.location.href = "login.html"; // Redirect if not logged in
    }
});

// 🔍 Load Food Items (Filtered by Category)
async function loadFoodItems(categoryFilter = "all") {
    const user = auth.currentUser;
    if (!user) return;

    let foodQuery = collection(db, "foods");
    if (categoryFilter !== "all") {
        foodQuery = query(foodQuery, where("category", "==", categoryFilter));
    }

    try {
        const snapshot = await getDocs(foodQuery);
        let categorizedFood = {};

        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.userId === user.uid) {
                if (!categorizedFood[data.category]) categorizedFood[data.category] = [];
                categorizedFood[data.category].push({ id: doc.id, ...data });
            }
        });

        displayFoodItems(categorizedFood);
    } catch (error) {
        alert("Error fetching food items: " + error.message);
    }
}

// 🎯 Display Food Items
function displayFoodItems(categorizedFood) {
    const foodListContainer = document.getElementById("foodList");
    if (!foodListContainer) return;

    foodListContainer.innerHTML = "";

    if (Object.keys(categorizedFood).length === 0) {
        foodListContainer.innerHTML = "<p>No food items found.</p>";
        return;
    }

    for (const category in categorizedFood) {
        const categorySection = document.createElement("div");
        categorySection.classList.add("category-section");

        const categoryTitle = document.createElement("h3");
        categoryTitle.innerText = category;
        categoryTitle.classList.add("category-title");
        categorySection.appendChild(categoryTitle);

        const itemsContainer = document.createElement("div");
        itemsContainer.classList.add("items-container");

        categorizedFood[category].forEach(data => {
            const foodItem = document.createElement("div");
            foodItem.classList.add("food-item");
            foodItem.innerHTML = `
                <img src="${data.imageUrl}" width="150" height="100">
                <p><strong>${data.foodName}</strong></p>
                <p> Price: ₹ ${data.price}</p>
                <p> ${data.description}</p>
            `;
            itemsContainer.appendChild(foodItem);
        });

        categorySection.appendChild(itemsContainer);
        foodListContainer.appendChild(categorySection);
    }
}

// 🔍 Filter Food by Category
const filterCategory = document.getElementById("filterCategory");
if (filterCategory) {
    filterCategory.addEventListener("change", function () {
        loadFoodItems(this.value);
    });
}

// 🚪 Logout
function logout() {
    signOut(auth).then(() => {
        localStorage.removeItem('authToken');
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        // Redirect to React app root
        window.location.href = '/';
    }).catch(error => {
        alert("Error logging out: " + error.message);
    });
}

document.getElementById('logoutButton').addEventListener('click', logout);
window.logout = logout;
