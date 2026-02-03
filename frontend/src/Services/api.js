import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api/user",
});

export const TODO_API = "/todo";

export const auth = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});
