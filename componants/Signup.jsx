import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  sendEmailVerification 
} from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import "../styles/signup.css";
import "../styles/slider.css";

// 🔹 Firebase Config
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

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function Signup() {
  const [restaurantName, setRestaurantName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // ✅ Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send verification email
      await sendEmailVerification(user);

      // Save restaurant info in Firestore
      await setDoc(doc(db, "restaurants", user.uid), {
        restaurantName,
        address,
        email,
        uid: user.uid,
      });

      // Show success message
      setAlertMessage("Account created successfully! Please verify your email.");
      setShowAlert(true);

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        setShowAlert(false);
        window.location.href = "/login"; // Adjust path if needed
      }, 3000);

    } catch (error) {
      console.error("Error during signup:", error);

      if (error.code === "auth/email-already-in-use") {
        alert("This email is already in use. Please try with a different email.");
      } else if (error.code === "auth/invalid-email") {
        alert("The email address is not valid. Please check the email format.");
      } else if (error.code === "auth/weak-password") {
        alert("The password is too weak. Please provide a stronger password.");
      } else {
        alert("Signup failed: " + error.message);
      }
    }
  };

  return (
    <div className="signup-page">
      {/* ✅ Custom Alert */}
      {showAlert && (
        <div className="alert">
          <span>{alertMessage}</span>
          <button onClick={() => setShowAlert(false)}>Close</button>
        </div>
      )}

      {/* ✅ Background Slider */}
      <section className="back-img">
        <div className="slider-container">
          <div className="slider">
                      <img src="src\assets\fast-food-7042713.jpg" alt="Image 1" />

          </div>
        </div>
      </section>

      <h2>Restaurant Sign Up</h2>
      <form onSubmit={handleSignup} id="form">
        <input
          type="text"
          placeholder="Restaurant Name"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" id="btns">Sign Up</button>
      </form>

      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}

export default Signup;
