import { Routes, Route } from "react-router-dom";

import LandingPage from "./components/LandingPage";  // adjust path if different
import QrPage from "./pages/QrPage";                 // adjust path if different

import { AuthProvider } from "./admin/AuthContext";
import ProtectedRoute from "./admin/ProtectedRoute";
import AdminLayout from "./admin/AdminLayout";
import Login from "./admin/Login";
import AdminMenu from "./admin/pages/AdminMenu";
import AdminOrders from "./admin/pages/AdminOrders";
import AdminAbout from "./admin/pages/AdminAbout";
import AdminReviews from "./admin/pages/AdminReviews";

import AdminSettings from "./admin/pages/AdminSettings";
import "./theme/theme.css";   // ← add this, before any other CSS / App import

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* public site */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/qr" element={<QrPage />} />

        {/* admin */}
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOrders />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="menu" element={<AdminMenu />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}