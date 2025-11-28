import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Preload critical images
import competencyPuzzle from "@/assets/competency-puzzle.png";

const preloadImage = (src: string) => {
  const img = new Image();
  img.src = src;
};

preloadImage(competencyPuzzle);

createRoot(document.getElementById("root")!).render(<App />);
