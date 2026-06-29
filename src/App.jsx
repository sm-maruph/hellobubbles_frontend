import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import QrPage from "./pages/QrPage";
import "./theme/theme.css";   // ← add this, before any other CSS / App import

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/qr" element={<QrPage />} />
    </Routes>
  );
}