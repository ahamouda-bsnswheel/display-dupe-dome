import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const img = new Image();
img.src = "/images/competency-puzzle.png";

createRoot(document.getElementById("root")!).render(<App />);
