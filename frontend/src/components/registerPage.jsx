import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "../index.css"
import { api } from "../Services/api";

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    console.log({
      name : name,
      password : password,
      email : email,
      role : role,
    });
  }, [name,email,password,role]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    const newUser = { name, email, password, role };
    try {
      const res = await api.post("/register", newUser);
      if (res.data.success) {
        toast.success("Registration successful!");
        setName("");
        setEmail("");
        setPassword("");
        setRole("user");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        toast.error(res.data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error: failed to register");
    }
  };
  const handleLogin = () => navigate("/login");
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-green-600 p-3 rounded-full">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-center mb-2">Create Account</h1>
          <p className="text-center text-gray-600 mb-8">Sign up to get started</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-gray-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                placeholder="Enter your email"
              />
            </div>
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
            <div>
              <label className="block mb-2 text-gray-700 ">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Sign Up
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button onClick={handleLogin} className="text-green-600 hover:underline">
                Sign in
              </button>
            </p>
          </div>
        </div>``
      </div>
    </div>
  );
}
