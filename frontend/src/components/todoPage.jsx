import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { getTodos, createTodo, updateTodoApi, deleteTodoApi } from "./App/todoSlice";
import "../index.css";

export default function TodoPage() {
  const [newTodo, setNewTodo] = useState("");
  const [newDesc, setNewDesc] = useState("");
  useEffect(() => {
    console.log({
      todo: newTodo,
      description: newDesc,
    });
  }, [newTodo, newDesc]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("LoginInUser")) || {
    _id: "guest",
    name: "Guest",
  };
  const handleLogout = () => {
    localStorage.removeItem("LoginInUser");
    localStorage.removeItem("token");
    toast.info("Logged out");
    setTimeout(() => navigate("/login"), 800);
  };
  return (
    <>
    <ToastContainer autoClose={900} />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-4xl font-bold text-blue-800 text-center mb-6"> TODO APP </h1>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-medium">My Tasks</h1>
              <p className="text-gray-600">Welcome to Todo App, {user.name}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
          <AddTodoForm
            newTodo={newTodo}
            setNewTodo={setNewTodo}
            newDesc={newDesc}
            setNewDesc={setNewDesc}
            userId={user._id}
          />
          <TodoList />
        </div>
      </div>
    </>
  );
}
function TodoList() {
  const { todos } = useSelector((state) => state.todos);
  const dispatch = useDispatch();

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStatus, setEditStatus] = useState("pending");

  useEffect(()=>{
    console.log({
      Title : editTitle,
      Description : editDesc,
      status : editStatus,
    });
  },[editTitle,editDesc,editStatus]);
  
  useEffect(() => {
    dispatch(getTodos());
  }, [dispatch]);

  const startEdit = (todo) => {
    setEditId(todo._id);
    setEditTitle(todo.title);
    setEditDesc(todo.description);
    setEditStatus(todo.status);
  };

  const saveEdit = (id) => {
    if (!editTitle.trim()) 
      return toast.error("Title cannot be empty");
    dispatch(
      updateTodoApi({
        id,
        title: editTitle,
        description: editDesc,
        status: editStatus,
      })
    );
    toast.success("Task updated!");
    setEditId(null);
  };
  const handleDelete = (id) => {
    dispatch(deleteTodoApi(id));
    toast.success("Task deleted!");
  };
  const activeTodos = todos.filter((t) => t.status !== "completed").length;
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex gap-6 mb-4">
        <div>
          <p className="text-gray-600">Total Tasks</p>
          <p className="text-blue-600">{todos.length}</p>
        </div>
        <div>
          <p className="text-gray-600">Active</p>
          <p className="text-orange-600">{activeTodos}</p>
        </div>
        <div>
          <p className="text-gray-600">Completed</p>
          <p className="text-green-600">{todos.length - activeTodos}</p>
        </div>
      </div>
      {todos.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No tasks yet.</div>
      ) : (
        <div className="space-y-2">
          {todos.map((todo) => (
            <div
              key={todo._id}
              className="flex flex-col md:flex-row items-start md:items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition group"
            >
              <div className="flex-1 min-w-0">
                {editId === todo._id ? (
                  <div className="flex flex-col gap-2">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="px-3 py-1 border rounded-lg"
                      placeholder="Title"
                    />
                    <textarea
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      placeholder="Description"
                      className="px-3 py-1 border rounded-lg resize-none"
                    />
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="px-3 py-2 border rounded-lg w-40"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <p
                        className={`font-semibold ${
                          todo.status === "completed"
                        }`}
                      >
                        {todo.title}
                      </p>
                      <p className="text-gray-600 text-sm">{todo.description}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${statusColor(
                        todo.status
                      )}`}
                    >
                      {todo.status === "in-progress"
                        ? "In Progress"
                        : todo.status.charAt(0).toUpperCase() +
                          todo.status.slice(1)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                {editId === todo._id ? (
                  <button
                    onClick={() => saveEdit(todo._id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => startEdit(todo)}
                    className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete(todo._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 opacity-0 group-hover:opacity-100 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function statusColor(status) {
  if (status === "completed") return "bg-green-100 text-green-800";
  if (status === "in-progress") return "bg-yellow-100 text-yellow-800";
  return "bg-gray-200 text-gray-800";
}

function AddTodoForm({ newTodo, setNewTodo, newDesc, setNewDesc, userId }) {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("pending");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return toast.error("Title cannot be empty");
    dispatch(
      createTodo({
        title: newTodo,
        description: newDesc,
        status,
        userId,
      })
    );
    setNewTodo("");
    setNewDesc("");
    setStatus("pending");
    toast.success("Task added!");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-3">
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter Title"
          className="flex-1 px-4 py-2 border rounded-lg"
        />

        <input
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          placeholder="Enter Description"
          className="flex-1 px-4 py-2 border rounded-lg"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Add Task
        </button>
      </form>
    </div>
  );
}
