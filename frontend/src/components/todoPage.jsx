import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  getTodos,
  createTodo,
  updateTodoApi,
  deleteTodoApi,
  nextPage,
  prevPage,
} from "./App/todoSlice";
import "../index.css";

export default function TodoPage() {
  const [newTodo, setNewTodo] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("LoginInUser")) || {
    _id: "",
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
          <h1 className="text-4xl font-bold text-blue-800 text-center mb-6">
            TODO APP
          </h1>

          <div className="bg-white rounded-lg shadow-md p-6 mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-medium">My Tasks</h1>
              <p className="text-gray-600">Welcome, {user.name}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/profile")}
                className="px-4 py-2 bg-blue-100 rounded"
              >
                Profile
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
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
  const { todos, page, limit, totalPages, loading } = useSelector(
    (state) => state.todos
  );
  const dispatch = useDispatch();

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStatus, setEditStatus] = useState("pending");

  useEffect(() => {
    dispatch(getTodos({ page, limit }));
  }, [page, limit, dispatch]);

  const startEdit = (todo) => {
    setEditId(todo._id);
    setEditTitle(todo.title);
    setEditDesc(todo.description);
    setEditStatus(todo.status);
  };

  const saveEdit = (id) => {
    if (!editTitle.trim()) return toast.error("Title cannot be empty");

    dispatch(
      updateTodoApi({
        id,
        title: editTitle,
        description: editDesc,
        status: editStatus,
      })
    );

    toast.success("Updated");
    setEditId(null);
  };

  const handleDelete = (id) => {
    dispatch(deleteTodoApi(id));
    toast.success("Deleted");
  };

  const activeTodos = todos.filter((t) => t.status !== "completed").length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex gap-6 mb-4">
        <div>
          <p className="text-gray-600">Total</p>
          <p className="text-blue-600">{todos.length}</p>
        </div>
        <div>
          <p className="text-gray-600">Active</p>
          <p className="text-orange-600">{activeTodos}</p>
        </div>
        <div>
          <p className="text-gray-600">Completed</p>
          <p className="text-green-600">
            {todos.length - activeTodos}
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : todos.length === 0 ? (
        <p className="text-center text-gray-400 py-8">No tasks found</p>
      ) : (
        todos.map((todo) => (
          <div
            key={todo._id}
            className="border p-3 rounded-lg flex justify-between group hover:bg-gray-50 mb-2"
          >
            {editId === todo._id ? (
              <div className="flex-1">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="border px-3 py-1 rounded w-full mb-2"
                />
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="border px-3 py-1 rounded w-full mb-2"
                />
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="border px-3 py-1 rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>

                <button
                  onClick={() => saveEdit(todo._id)}
                  className="mt-2 px-4 py-1 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex-1">
                <p className="font-semibold">{todo.title}</p>
                <p className="text-gray-600">{todo.description}</p>
                <span className="text-sm px-2 py-1 rounded bg-gray-200 inline-block mt-1">
                  {todo.status}
                </span>
              </div>
            )}

            <div className="flex gap-2">
              {editId !== todo._id && (
                <button
                  onClick={() => startEdit(todo)}
                  className="px-3 py-1 bg-gray-600 text-white rounded opacity-0 group-hover:opacity-100"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleDelete(todo._id)}
                className="px-3 py-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      <div className="flex justify-between mt-6 items-center">
        <button
          disabled={page === 1}
          onClick={() => dispatch(prevPage())}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <p className="font-semibold">
          Page {page} / {totalPages}
        </p>

        <button
          disabled={page === totalPages}
          onClick={() => dispatch(nextPage())}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function AddTodoForm({ newTodo, setNewTodo, newDesc, setNewDesc, userId }) {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("pending");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return toast.error("Title missing");

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
    toast.success("Added");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <form
        onSubmit={handleAdd}
        className="grid grid-cols-1 md:grid-cols-4 gap-3"
      >
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Title"
          className="border px-4 py-2 rounded"
        />

        <input
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          placeholder="Description"
          className="border px-4 py-2 rounded"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          Add Task
        </button>
      </form>
    </div>
  );
}
