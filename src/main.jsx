import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import ScrollToTop from "./components/ScrollToTop";

import { CartProvider } from "./context/CartContext";
import Countdown from "./components/Countdown";

function Root() {
  const [showApp, setShowApp] = useState(false);

  return (
    <Router>
      <ScrollToTop />
      <CartProvider>
        {/* Countdown will show until 7:30 PM local time. When it finishes it calls onFinish and we show the app (routes). */}
        <Countdown onFinish={() => setShowApp(true)} />
        {showApp ? <App /> : null}
      </CartProvider>
  
    </Router>
  );
}

createRoot(document.getElementById("root")).render(<Root />);
