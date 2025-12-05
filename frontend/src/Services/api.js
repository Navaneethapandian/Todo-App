import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api/user",
  headers: {
    "Content-Type": "application/json",
  },
});

export const TODO_API = "/todo";