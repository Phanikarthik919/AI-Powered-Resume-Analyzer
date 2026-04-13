import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
