function Navbar() {
  return (
    <div className="h-16 bg-blue-600 flex items-center justify-end px-6 text-white shadow">

      <div className="flex items-center gap-6">

        <span className="text-lg">🔔</span>
        <span className="text-lg">⚙️</span>

        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src="https://i.pravatar.cc/40"
            alt="avatar"
            className="w-8 h-8 rounded-full border"
          />
        </div>

      </div>

    </div>
  );
}

export default Navbar;