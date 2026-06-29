import { Link } from "react-router-dom";
import "./homepage.css";
import logo from "../assets/Hello_Bubbles_Logo.png";
import LandingPage from "../components/LandingPage";

export default function HomePage() {
  return (
    <>
    <LandingPage/>
    </>
    // <div className="home-container">
    //   <div className="floating-bubble bubble1"></div>
    //   <div className="floating-bubble bubble2"></div>
    //   <div className="floating-bubble bubble3"></div>
    //   <div className="floating-bubble bubble4"></div>

    //   <div className="content">
    //     <img
    //       src={logo}
    //       alt="Hello Bubbles"
    //       className="logo"
    //     />

    //     <h1>Welcome to Hello Bubbles</h1>

    //     <h2>🚧 Our Website is Under Construction 🚧</h2>

    //     <p>
    //       Thanks for being with Hello Bubbles.
    //       <br />
    //       We are working hard to bring you an amazing experience.
    //     </p>

    //     <p className="coming-soon">
    //       Thank you for your patience.
    //       <br />
    //       <strong>We are coming shortly!</strong>
    //     </p>

    //     <div className="action-box">
    //       <p>
    //         To view our QR menu, click the button below or scan the QR code.
    //       </p>

    //       <Link to="/qr" className="qr-btn">
    //         View QR
    //       </Link>
    //     </div>
    //   </div>
    // </div>
  );
}