// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "../styles/Home.css";
import Login from "../componants/login";
import Signup from "../componants/Signup";



function App() {
  useEffect(() => {
    // Toggle mobile menu
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    const toggleMenu = () => navLinks.classList.toggle("active");
    menuToggle?.addEventListener("click", toggleMenu);

    // Highlight active nav link on scroll
    const setActiveLink = () => {
      const sections = document.querySelectorAll("section");
      const navItems = document.querySelectorAll(".nav-links a");
      let currentSection = "";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - sectionHeight / 3) {
          currentSection = section.getAttribute("id");
        }
      });

      navItems.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentSection}`) {
          link.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", setActiveLink);
    setActiveLink();

    // Hide demo pointer after 4 sec
    const pointer = document.getElementById("pointer");
    const timer = setTimeout(() => {
      if (pointer) pointer.style.display = "none";
    }, 4000);

    return () => {
      menuToggle?.removeEventListener("click", toggleMenu);
      window.removeEventListener("scroll", setActiveLink);
      clearTimeout(timer);
    };
  }, []);

  // -------- Landing Page ----------
  const HomePage = () => (
    <>
      {/* Navbar */}
      <header>
        <nav className="navbar">
          <div className="logo">
            <Link to="/">
              <img src="src\assets\logo-removebg-preview(1).png" alt="Logo" />
            </Link>
          </div>
          <ul className="nav-links" id="navLinks">
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
            <li>
              <Link className="btn" to="/login">
                Restaurant Login
              </Link>
            </li>
            <li>
               <Link className="btn" to="/signup">
                SignUp
              </Link>
            </li>
          </ul>
          <div className="menu-toggle" id="menuToggle">
            ☰
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="home" id="home">
        <div className="left">
         

          <h1>
            Dine<span>Tap</span>
          </h1>
          <div className="paragraph">
            <p className="intro">
              Our platform allows restaurants to register and create digital
              menus that customers can access by scanning a QR code. Enhance the
              dining experience with a contactless, easy-to-use solution.
            </p>
            <p>
              <span>✔ </span>Print a QR code on any product
            </p>
            <p>
              <span>✔ </span>Update without ever reprinting
            </p>
            <p>
              <span>✔ </span>100% Free – No charges!
            </p>
           
          </div>
        </div>

        <div className="right">
          <video
            src="src/assets/Recording 2025-03-30 134120.mp4"
            autoPlay
            loop
            muted
          ></video>
          <img src="src/assets/image.png" alt="QR Menu" />
        </div>

        {/* Process Flow */}
        <section className="dt-process-wrapper">
          <h2>How DineTap Works</h2>
          <div className="dt-process-flow">
            <div className="dt-step">
              <img
                src="https://img.icons8.com/ios-filled/100/user-plus.png"
                alt="Sign Up"
              />
              <div className="dt-step-title">Sign Up</div>
              <div className="dt-step-desc">
                Restaurants create an account on DineTap.
              </div>
            </div>
            <div className="dt-arrow">➜</div>
            <div className="dt-step">
              <img
                src="https://img.icons8.com/ios-filled/100/menu.png"
                alt="Create Menu"
              />
              <div className="dt-step-title">Create Menu</div>
              <div className="dt-step-desc">
                Add and manage menu items with ease.
              </div>
            </div>
            <div className="dt-arrow">➜</div>
            <div className="dt-step">
              <img
                src="https://img.icons8.com/ios-filled/100/qr-code.png"
                alt="QR Code"
              />
              <div className="dt-step-title">Share QR</div>
              <div className="dt-step-desc">
                Generate and display your QR code.
              </div>
            </div>
            <div className="dt-arrow">➜</div>
            <div className="dt-step">
              <img
                src="https://img.icons8.com/ios-filled/100/scan-qr-code.png"
                alt="Scan QR"
              />
              <div className="dt-step-title">Customer Scans</div>
              <div className="dt-step-desc">
                Customers scan and view instantly.
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* Try Section */}
      <div className="dt-container">
        <div className="dt-image-box">
          <img src="src\assets\code.png" alt="Restaurant menu" />
          <h2>Give it a try!</h2>
          <p className="qr-caption">
            Just point your phone camera at the code.
          </p>
        </div>
        <div className="dt-text-box">
          <h2>Discover the Power of DineTap</h2>
          <p>
            Restaurants continue to use these quick links on menus, flyers,
            tabletop components, sidewalk signs and more. They’re popular not
            only for providing a great mobile experience, but also because
            they’re easy to use and open up a new world of benefits.
          </p>
        </div>
      </div>

      {/* Features */}
      <section className="dt-features">
        <h2>Why Choose DineTap?</h2>
        <div className="dt-feature-grid">
          <div className="dt-feature-card">
            <img
              src="https://img.icons8.com/ios-filled/100/cloud-sync--v1.png"
              alt="Instant Updates"
            />
            <h3>Instant Menu Updates</h3>
            <p>Change menu items in real-time without reprinting anything.</p>
          </div>
          <div className="dt-feature-card">
            <img
              src="https://img.icons8.com/ios-filled/100/time.png"
              alt="Save Time"
            />
            <h3>Save Time & Cost</h3>
            <p>No more printed menus. Cut down costs and improve efficiency.</p>
          </div>
          <div className="dt-feature-card">
            <img
              src="https://img.icons8.com/ios-filled/100/smartphone-tablet.png"
              alt="Mobile Friendly"
            />
            <h3>Mobile Friendly</h3>
            <p>Your menu fits perfectly on any phone or tablet.</p>
          </div>
          <div className="dt-feature-card">
            <img
              src="https://img.icons8.com/ios-filled/100/bar-chart--v1.png"
              alt="Analytics"
            />
            <h3>Customer Insights</h3>
            <p>Track dishes that get the most views.</p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="about" id="about">
        <div className="about-content">
          <h2>
            About{" "}
            <span className="ab">
              Dine<span className="tap">Tap</span>
            </span>
          </h2>
          <p>
            DineTap revolutionizes restaurant dining by offering{" "}
            <b>contactless</b>
            and <b>easy-to-use</b> digital menus. Restaurants can create and
            manage digital menus that customers access via QR codes.
          </p>
          <div className="features">
            <div className="feature-card">
              <i className="fas fa-mobile-alt"></i>
              <h3>Digital Menus</h3>
              <p>
                Restaurants can register and create interactive digital menus.
              </p>
            </div>
            <div className="feature-card">
              <i className="fas fa-qrcode"></i>
              <h3>QR Code Access</h3>
              <p>Customers scan a QR code to instantly access the menu.</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-bolt"></i>
              <h3>Fast & Secure</h3>
              <p>Enhance user experience with a smooth and secure platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="contact" id="contact">
        <div className="container">
          <div className="image-section">
            <img src="src/assets/plan png.png" alt="Team Chat" />
          </div>
          <form
            action="https://formsubmit.co/kumarsagar4977@gmail.com"
            method="POST"
          >
            <div className="contact-form">
              <h2>Contact Us</h2>
              <div className="input-group">
                <i className="fas fa-user"></i>
                <input type="text" placeholder="Your Name" required />
              </div>
              <div className="input-group">
                <i className="fas fa-envelope"></i>
                <input type="email" placeholder="Your Email" required />
              </div>
              <div className="input-group">
                <i className="fas fa-comment"></i>
                <textarea placeholder="Your Message" required></textarea>
              </div>
              <button className="submit-btn">Get in Touch</button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <p>&copy; 2025 DineTap. All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
          
       
    </Routes>
  );
}

export default App;
