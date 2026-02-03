const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  updateUser,
  deleteUser,
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} = require("../controllers/userController");
const { authenticateToken, authorizeRole } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get/:id", authenticateToken, getProfile);
router.put("/update/:id", authenticateToken, updateUser);
router.delete("/delete/:id", authenticateToken, deleteUser);
router.post("/todo", authenticateToken,authorizeRole("user"), createTodo);
router.get("/todo", authenticateToken,authorizeRole("user"), getTodos);
router.put("/todo/:id", authenticateToken, updateTodo);

router.delete("/todo/:id", authenticateToken, deleteTodo);

module.exports = router;
