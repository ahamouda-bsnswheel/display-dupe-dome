import { createRoot } from "react-dom/client";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import App from "./App.tsx";
import "./index.css";
import { preloadCriticalImages } from "./lib/imagePreloader";

// Configure status bar for native platforms
const configureStatusBar = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      // Set status bar to overlay webview (content goes behind it)
      await StatusBar.setOverlaysWebView({ overlay: false });
      // Set status bar style
      await StatusBar.setStyle({ style: Style.Light });
      // Set background color to match app theme
      await StatusBar.setBackgroundColor({ color: "#f5f5f7" });
    } catch (error) {
      console.error("StatusBar configuration error:", error);
    }
  }
};

// Initialize native configurations
configureStatusBar();

// Preload critical images immediately
preloadCriticalImages();

createRoot(document.getElementById("root")!).render(<App />);