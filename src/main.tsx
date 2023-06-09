import React from "react";
import ReactDOM from "react-dom/client";
import Navbar from "./components/Navbar";
import { App, Hello, Server, Client } from "./pages";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { WalletProvider } from "@suiet/wallet-kit";

const Root = () => {
  return (
    <React.StrictMode>
      <WalletProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/hello" element={<Hello />} />
            <Route path="/server" element={<Server />} />
            <Route path="/client" element={<Client />} />
          </Routes>
        </BrowserRouter>
      </WalletProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Root />
);
