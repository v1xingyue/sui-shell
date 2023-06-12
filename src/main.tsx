import React from "react";
import ReactDOM from "react-dom/client";
import { Navbar } from "./components";
import { App, Hello, Server, Client, Acl } from "./pages";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { WalletProvider } from "@suiet/wallet-kit";

const Root = () => {
  return (
    <React.StrictMode>
      <WalletProvider>
        <BrowserRouter>
          <Navbar />

          <div className="p-2">
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/acl/:tableId/:serverId" element={<Acl />} />
              <Route path="/hello/:id" element={<Hello />} />
              <Route path="/server" element={<Server />} />
              <Route path="/client" element={<Client />} />
            </Routes>
          </div>
        </BrowserRouter>
      </WalletProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Root />
);
