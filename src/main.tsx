import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { preloadCriticalImages } from "./lib/imagePreloader";

// Preload critical images immediately
preloadCriticalImages();

createRoot(document.getElementById("root")!).render(<App />);
