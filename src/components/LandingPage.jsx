import { useEffect } from "react";
import { applyTheme } from "../theme/theme";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AboutUs from "../components/AboutUs";
import Menu from "../components/Menu";
import ReservationCTA from "../components/ReservationCTA";
import Reviews from "../components/Reviews";
import Blogs from "../components/Blogs";
import BookTable from "../components/BookTable";
import Footer from "../components/Footer";
import { landingData } from "../data/landing";

/**
 * Example composition. Mirror this in your own landing page.
 * Pass a `theme` prop (e.g. fetched from the admin panel) to recolor
 * the whole site; omit it to use the defaults from theme.css.
 */
export default function LandingPage({ theme }) {
  useEffect(() => {
    if (theme) applyTheme(theme);
  }, [theme]);

  const { nav, hero, about } = landingData;

  return (
    <>
      <Navbar logo={nav.logo} links={nav.links} cta={nav.cta} />
      <main>
        <Hero {...hero} />
        <AboutUs />
        <Menu />
        <ReservationCTA />
        <Reviews />
        <Blogs />
        <BookTable onSubmit={(data) => console.log("Booking:", data)} />
      </main>
      <Footer />
    </>
  );
}
