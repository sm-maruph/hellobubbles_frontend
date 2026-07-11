import { useEffect } from "react";
import { applyTheme } from "../theme/theme";
import { ShopProvider, useShop } from "../store/useShop";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AboutUs from "../components/AboutUs";
import Menu from "../components/Menu";
// import ReservationCTA from "../components/ReservationCTA";
import Reviews from "../components/Reviews";
import Blogs from "../components/Blogs";
import BookTable from "../components/BookTable";
import Footer from "../components/Footer";
import AccountDrawer from "../components/AccountDrawer";
import OrderModal from "../components/OrderModal";
import { landingData } from "../data/landing";
import Contact from "../components/Contact";

const RESTAURANT = {
  name: "Hello Bubbles",
  address: "782 S Westwood Blvd, Los Angeles, CA 90024",
  phone: "+1 (212) 555-1212",
  hours: "Mon–Sat: 9:00 AM – 12:00 PM · Sun: 6:00 AM – 12:00 PM",
};

/* Inner content: lives INSIDE the provider so it can read the store. */
function Site() {
  const { nav, hero, about } = landingData;
  const { draft, closeOrder, placeOrder, restaurant } = useShop();

  return (
    <>
      <Navbar logo={nav.logo} links={nav.links} qrHref="/qr" />
      <main>
        <Hero {...hero} />

        <Menu />
        <AboutUs/>
        {/* <ReservationCTA /> */}
        <Reviews />
        <Blogs />
        <Contact />        {/* ← before the footer */}

        {/* <BookTable onSubmit={(data) => console.log("Booking:", data)} /> */}
      </main>
      <Footer />

      {/* global overlays driven by the store */}
      <AccountDrawer />
      <OrderModal
        open={!!draft}
        items={draft?.items || []}
        restaurant={restaurant}
        onClose={closeOrder}
        onPlaced={placeOrder}
      />
    </>
  );
}

export default function LandingPage({ theme }) {
  useEffect(() => {
    if (theme) applyTheme(theme);
  }, [theme]);

  return (
    <ShopProvider restaurant={RESTAURANT}>
      <Site />
    </ShopProvider>
  );
}
