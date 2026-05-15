import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackgroundDecoration from "./BackgroundDecoration";

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Dynamic Background Decoration */}
      <BackgroundDecoration />
      
      <Navbar />
      
      {/* The main content grows to push footer down */}
      <main className="flex-grow relative z-10">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default RootLayout;