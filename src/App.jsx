import { Routes, Route, Navigate } from "react-router-dom";
import QrPage from "./pages/QrPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/qr" element={<QrPage />} />
      <Route path="*" element={<Navigate to="/qr" replace />} />
    </Routes>
  );
}