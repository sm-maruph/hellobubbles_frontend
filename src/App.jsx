import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import QrPage from "./pages/QrPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/qr" element={<QrPage />} />
    </Routes>
  );
}