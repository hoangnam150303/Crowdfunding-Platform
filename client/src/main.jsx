import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import App from "./App.jsx";
import "./index.css"; // Ensure you import your Tailwind CSS styles
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThirdwebProvider desiredChainId={ChainId.Hardhat}>
    <Router>
     <App/>
    </Router>
  </ThirdwebProvider>
);
