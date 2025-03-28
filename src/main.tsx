import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SocketProvider } from "./context/SocketContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketProvider url="ws://localhost:8000/ws">
      <App />
    </SocketProvider>
  </StrictMode>
);
