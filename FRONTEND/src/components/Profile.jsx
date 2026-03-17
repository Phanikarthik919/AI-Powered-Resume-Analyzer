function Profile() {
  return (
    <div className="max-w-2xl">

      <div className="bg-white rounded shadow p-6">
        <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold mr-2">My Profile</h2>
                <img
                src="https://i.pravatar.cc/40"
                alt="avatar"
                className="w-8 h-8 rounded-full border"
             />
            </div>
  

        <div className="border-t pt-4">

          <p className="mb-2">
            <span className="font-semibold">Name:</span> John Doe
          </p>

          <p className="mb-6">
            <span className="font-semibold">Email:</span> john.doe@example.com
          </p>

        </div>

        <h3 className="text-blue-700 font-semibold mb-3">
          Change Password
        </h3>

        <input
          type="password"
          placeholder="Current Password"
          className="w-full border rounded px-3 py-2 mb-3 bg-gray-100"
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full border rounded px-3 py-2 mb-3 bg-gray-100"
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          className="w-full border rounded px-3 py-2 mb-4 bg-gray-100"
        />

        <button className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
          Update Password
        </button>

      </div>

    </div>
  );
}

export default Profile;