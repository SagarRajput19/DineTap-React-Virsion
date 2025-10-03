import React, { useState } from "react";
import { auth } from "../src/firebase-config";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login button clicked"); // Debug

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      const user = userCredential.user;

      console.log("Firebase login success:", user);

      if (!user.emailVerified) {
        alert("Please verify your email before logging in.");
        return;
      }

      // ✅ Redirect to admin page
      window.location.href = "admin/htm/admin.html";

    } catch (error) {
      console.error(error.code, error.message);
      alert("Invalid credentials or user not found!");
    }
  };

  // 🔹 Handle Forgot Password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email to reset your password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
      alert("Password reset email sent! Please check your inbox.");
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="login-page">
      {/* Background Slider */}
      <section className="back-img">
        <div className="slider-container">
          <div className="slider">
            <img src="src\assets\fast-food-7042713.jpg" alt="Image 1" />
          </div>
        </div>
      </section>

     

      {/* Login Form */}
      <h2>Restaurant Login</h2>
      <form onSubmit={handleLogin} id="form">
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


        <button type="submit" id="btns">Login</button>
        <br />
        
        <button type="button" className="forgot-link" onClick={handleForgotPassword} id="btns">
          Forgot Password?
        </button>
        <a href="/">⬅ Go Back</a>
      </form>

      <p>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
}

export default Login;
