import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function RootLayout() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      {/* The child routes will render here */}
      <Outlet />
    </div>
  );
}

export default RootLayout;