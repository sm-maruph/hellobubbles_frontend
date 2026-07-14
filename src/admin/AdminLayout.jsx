import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./admin.css";

export default function AdminLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <div className="admin__brand">Hello Bubbles</div>
        <nav className="admin__nav">
          <NavLink to="/admin/orders" className="admin__link">Orders</NavLink>
          <NavLink to="/admin/menu" className="admin__link">Menu</NavLink>
          <NavLink to="/admin/about" className="admin__link">About images</NavLink>
          <NavLink to="/admin/reviews" className="admin__link">Reviews</NavLink>
          <NavLink to="/admin/qr-gallery" className="admin__link">QR Gallery</NavLink>
          <NavLink to="/admin/offer" className="admin__link">Offer</NavLink>
          <NavLink to="/admin/settings" className="admin__link">Settings</NavLink>

        </nav>
        <div className="admin__sidebar-foot">
          <a href="/" className="admin__link" target="_blank" rel="noreferrer">
            View site ↗
          </a>
          <button className="admin__logout" onClick={logout}>Sign out</button>
        </div>
      </aside>

      <main className="admin__main">
        <Outlet />
      </main>
    </div>
  );
}
