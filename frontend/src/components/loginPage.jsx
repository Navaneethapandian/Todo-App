import { LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "../index.css"
import { api } from "../Services/api";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(()=>{
    console.log({
      email : email,
      password : password,
    })
  },[email,password])
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("LoginInUser", JSON.stringify(res.data.user));
      toast.success("Login successful!");
      setTimeout(() => navigate("/todo"), 1000);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed");
    }
  };
  const handleRegister = () => navigate("/");
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">

          <div className="flex items-center justify-center mb-8">
            <div className="bg-blue-600 p-3 rounded-full">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-center text-2xl font-bold mb-2">
            Welcome Back
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Login to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          </form>

          <p className="text-center mt-4 text-gray-600">
            Don’t have an account?{" "}
            <button
              onClick={handleRegister}
              className="text-blue-600 hover:underline"
            >
              Register here
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}
