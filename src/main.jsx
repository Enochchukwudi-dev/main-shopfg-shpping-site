import { createRoot } from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import "./index.css";
import lockImg from "./assets/lock.png";

createRoot(document.getElementById("root")).render(
  <Router>
    <div className="lock-viewport" role="img" aria-label="Website locked">
      <img src={lockImg} alt="Website locked" />
    </div>
  </Router>
);

