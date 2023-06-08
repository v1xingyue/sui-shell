import React from "react";
import ReactDOM from "react-dom/client";
import { App, Hello } from "./pages";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./index.css";

import { WalletProvider } from "@suiet/wallet-kit";
import { PackageLink } from "./utils";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WalletProvider>
      <BrowserRouter>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/hello">Hello</Link>
            </li>
            <li>
              <Link target="_blank" to={PackageLink()}>
                Contract On Explorer
              </Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/hello" element={<Hello />} />
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  </React.StrictMode>
);
