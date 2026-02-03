import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, auth } from "../Services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";

export default function ProfilePage() {
  const navigate = useNavigate();
  const User = JSON.parse(localStorage.getItem("LoginInUser"));

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await api.get(`/get/${User._id}`, auth());
      const u = res.data.user;
      setUser(u);
      setName(u.name);
      setEmail(u.email);
    } catch (err) {
      toast.error("Unable to fetch profile");
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!User?._id) {
      navigate("/login");
      return;
    }
    fetchUser();
  }, []);

  const updateUser = async () => {
    try {
      const payload = { name, email };
      if (password.trim()) payload.password = password;

      const res = await api.put(`/update/${User._id}`, payload, auth());
      const updatedUser = res.data.user;

      setUser(updatedUser);
      localStorage.setItem("LoginInUser", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully");
      setEditMode(false);
      setPassword("");
      setShowPassword(false);
    } catch {
      toast.error("Profile update failed");
    }
  };

  const deleteUser = async () => {
    const confirmDelete = window.confirm(
      "This will permanently delete your account"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/delete/${User._id}`, auth());
      localStorage.clear();
      toast.success("Account deleted");
      setTimeout(() => navigate("/register"), 1200);
    } catch {
      toast.error("Delete failed");
    }
  };

  if (!user) {
    return (
      <>
        <ToastContainer />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg font-semibold">Loading profile...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <ToastContainer autoClose={1200} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>

          {!editMode ? (
            <>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Name</span>
                  <span>{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Email</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Role</span>
                  <span className="capitalize">{user.role}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditMode(true)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold"
                >
                  Edit Profile
                </button>
                <button
                  onClick={deleteUser}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold"
                >
                  Delete Account
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-3 mb-5">
                <input
                  className="w-full border rounded-lg px-3 py-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                />

                <input
                  className="w-full border rounded-lg px-3 py-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />

                {/* 🔹 PASSWORD WITH EYE ICON */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full border rounded-lg px-3 py-2 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New Password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={updateUser}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setName(user.name);
                    setEmail(user.email);
                    setPassword("");
                    setShowPassword(false);
                  }}
                  className="flex-1 bg-gray-400 text-white py-2 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </>
          )}

          <button
            onClick={() => navigate("/todo")}
            className="mt-6 w-full text-blue-600 font-medium"
          >
            Back to Todo App
          </button>
        </div>
      </div>
    </>
  );
}
