const User = require("../models/user");
const Todo = require("../models/todo");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/db");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: role || "user" });
    await user.save();
    res.status(201).json({ success: true, message: "User Registered", user });
  } catch (err) {
    console.error("RegisterUser Error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid Credentials" });
    const token = jwt.sign({ userId: user._id, role: user.role }, config.jwtSecret, { expiresIn: "30d" });
    res.json({ success: true, message: "Login successful", token, user });
  } catch (err) {
    console.error("LoginUser Error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    const todos = await Todo.find({ userId: id }).sort({ createdAt: -1 });
    user.todos = todos;
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("GetProfile Error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (role) user.role = role;
    await user.save();
    res.status(200).json({ success: true, message: "User updated", user });
  } catch (err) {
    console.error("UpdateUser Error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ success: true, message: "User deleted", user });
  } catch (err) {
    console.error("DeleteUser Error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};


const createTodo = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const todo = new Todo({ title, description, status: status || "pending", userId: req.user._id });
    await todo.save();
    res.status(201).json({ success: true, todo });
  } catch (err) {
    console.error("CreateTodo Error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user._id });
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user,todos });
  } catch (err) {
    console.error("GetAllTodos Error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { title, description, status },
      { new: true }
    );
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.status(200).json({ success: true, todo });
  } catch (err) {
    console.error("UpdateTodo Error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.status(200).json({ success: true, message: "Todo deleted" });
  } catch (err) {
    console.error("DeleteTodo Error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateUser,
  deleteUser,
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
};
