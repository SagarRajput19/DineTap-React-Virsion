// 🔹 Firebase Config & Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Loading state management
let isSubmitting = false;

// Debounce function
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Enhanced auth state listener with error handling
document.addEventListener("DOMContentLoaded", function () {
    const unsubscribe = onAuthStateChanged(auth, 
        (user) => {
            if (user) {
                document.getElementById("restaurantName").innerText = user.email;
                document.getElementById("loadingState").style.display = "none";
            } else {
                window.location.href = "login.html";
            }
        },
        (error) => {
            console.error("Auth state change error:", error);
            alert("Authentication error occurred. Please refresh the page.");
        }
    );

    // Cleanup listener on page unload
    window.addEventListener('unload', () => unsubscribe());
});

// Enhanced form submission with validation and loading state
const foodForm = document.getElementById("foodForm");
if (foodForm) {
    foodForm.addEventListener("submit", debounce(async function (e) {
        e.preventDefault();
        
        if (isSubmitting) return;
        isSubmitting = true;
        document.getElementById("submitButton").disabled = true;
        
        try {
            const foodName = document.getElementById("foodName").value.trim();
            const imageUrl = document.getElementById("imageUrl").value.trim();
            const category = document.getElementById("category").value.trim();
            const price = parseFloat(document.getElementById("price").value);
            const description = document.getElementById("description").value.trim();

            // Enhanced validation
            if (foodName.length < 2) throw new Error("Food name must be at least 2 characters");
            if (!isValidUrl(imageUrl)) throw new Error("Please enter a valid image URL");
            if (price <= 0) throw new Error("Price must be greater than 0");
            if (description.length < 10) throw new Error("Description must be at least 10 characters");

            const user = auth.currentUser;
            if (!user) throw new Error("User not authenticated");

            await addDoc(collection(db, "foods"), {
                foodName,
                imageUrl,
                category,
                price,
                description,
                userId: user.uid,
                createdAt: new Date().toISOString()
            });

            alert("Food item added successfully!");
            foodForm.reset();
        } catch (error) {
            console.error("Error adding food:", error);
            alert(error.message || "Failed to add food item. Please try again.");
        } finally {
            isSubmitting = false;
            document.getElementById("submitButton").disabled = false;
        }
    }, 500));
}

// Enhanced logout with confirmation
function logout() {
    if (window.confirm("Are you sure you want to logout?")) {
        signOut(auth).then(() => {
            localStorage.clear(); // Clear all local storage
            // Clear all cookies
            document.cookie.split(";").forEach(cookie => {
                document.cookie = cookie
                    .replace(/^ +/, "")
                    .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
            });
            window.location.href = '/';
        }).catch(error => {
            console.error("Logout error:", error);
            alert("Error logging out: " + error.message);
        });
    }
}

// Helper functions
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Event listeners
document.getElementById('logoutButton').addEventListener('click', logout);
window.logout = logout;