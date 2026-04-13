import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

const Home = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const name = user?.name?.split(" ")[0] || "there";

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      {/* Greeting */}
      <p className="text-2xl text-gray-500 mb-2">
        Welcome back, <span className="font-medium text-gray-800">Mr.{name.toUpperCase()}</span> 👋
      </p>

      {/* Heading */}
      <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">Check how strong your resume really is</h1>

      {/* Subtitle */}
      <p className="text-gray-500 text-lg max-w-lg mb-8">
        Upload your resume and get an instant ATS score, personalized suggestions, and insights to improve your chances of landing your
        dream job.
      </p>

      {/* Button */}
      <button
        onClick={() => navigate("/upload-resume")}
        className="px-6 py-2.5 bg-black text-white rounded-2xl text-md font-medium hover:opacity-90 transition cursor-pointer"
      >
        Upload Resume
      </button>
    </div>
  );
};

export default Home;
