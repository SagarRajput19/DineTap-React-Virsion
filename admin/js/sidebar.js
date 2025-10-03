// 🔹 Firebase config and initialization (inner Firebase)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
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
const auth = getAuth(app);
const db = getFirestore(app);

// Select the sidebar and food list container
const categoryListContainer = document.getElementById('categoryList');
const foodListContainer = document.getElementById('foodListContainer');
const searchInput = document.getElementById('searchInput');  // Search bar element

// Ensure we are logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Logged in user UID:", user.uid);

        // Fetch and display the food items related to this user
        fetchAndDisplayFood(user.uid);
    } else {
        console.log("No user logged in.");
        categoryListContainer.innerHTML = "<p>Please log in to view food items.</p>";
    }
});

// Fetch and display food items based on the authenticated user's UID
async function fetchAndDisplayFood(userId) {
    const foodQuery = query(collection(db, 'foods'), where('userId', '==', userId));

    try {
        const snapshot = await getDocs(foodQuery);
        const foodItems = snapshot.docs.map(doc => doc.data());

        console.log("Food Items:", foodItems);

        if (foodItems.length === 0) {
            categoryListContainer.innerHTML = "<p>No food items found for this user.</p>";
            return;
        }

        // Sort food items alphabetically by food name
        foodItems.sort((a, b) => a.foodName.toLowerCase().localeCompare(b.foodName.toLowerCase()));

        // Group food items by category
        const categories = {};
        foodItems.forEach(item => {
            if (item.foodName && item.category && item.price && item.description) {
                if (categories[item.category]) {
                    categories[item.category].push(item);
                } else {
                    categories[item.category] = [item];
                }
            }
        });

        console.log("Categories:", categories);

        // Display categories in the sidebar with item count
        Object.keys(categories).forEach(category => {
            const li = document.createElement('li');
            li.classList.add('category-item');  // Add class for styling
            li.innerHTML = `${category} <span class="item-count">${categories[category].length}</span>`;
            li.onclick = () => displayFoodItems(categories[category]);
            categoryListContainer.appendChild(li);
        });

        // Display all food items initially
        displayFoodItems(foodItems);

        // Search functionality
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredItems = foodItems.filter(item => 
                item.foodName.toLowerCase().includes(searchTerm)
            );
            displayFoodItems(filteredItems);
        });

    } catch (error) {
        console.error('Error fetching food items:', error);
    }
}

// Display food items in the main container
function displayFoodItems(items) {
    foodListContainer.innerHTML = ''; // Clear previous food items
    items.forEach(item => {
        const foodDiv = document.createElement('div');
        foodDiv.classList.add('food-item');
        foodDiv.innerHTML = `
            <h4>${item.foodName}</h4>
            <p>Category: ${item.category}</p>
            <p>Price: ₹${item.price}</p>
            <p>${item.description}</p>
        `;
        foodListContainer.appendChild(foodDiv);
    });
}

// User dropdown menu toggle
document.getElementById('userIcon').addEventListener('click', function() {
    const dropdownMenu = document.getElementById('dropdownMenu');
    dropdownMenu.style.display = (dropdownMenu.style.display === "block") ? "none" : "block";
});

// Close dropdown if clicked outside
window.addEventListener('click', function(event) {
    const dropdownMenu = document.getElementById('dropdownMenu');
    if (!dropdownMenu.contains(event.target) && !document.getElementById('userIcon').contains(event.target)) {
        dropdownMenu.style.display = "none";
    }
});
