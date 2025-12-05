import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, TODO_API  } from "../../Services/api";

const auth = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
export const createTodo = createAsyncThunk("todos/createTodo", async ({ title, description, userId, status }) => {
    const res = await api.post( TODO_API, { title, description, status, userId }, auth());
    return res.data.todo;
  }
);

export const getTodos = createAsyncThunk("todos/getTodos", async () => {
  const res = await api.get(TODO_API, auth());
  return res.data.todos;
});

export const updateTodoApi = createAsyncThunk("todos/updateTodo", async ({ id, title, description, status }) => {
    const res = await api.put(`${TODO_API}/${id}`, { title, description, status }, auth());
    return res.data.todo;
  }
);

export const deleteTodoApi = createAsyncThunk("todos/deleteTodo", async (id) => {
  await api.delete(`${TODO_API}/${id}`, auth());
  return id;
});

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    todos: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTodos.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTodos.fulfilled, (state, action) => {
        state.todos = action.payload;
        state.loading = false;
      })
      .addCase(getTodos.rejected, (state ,action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })
      .addCase(updateTodoApi.fulfilled, (state, action) => {
        state.todos = state.todos.map((todo) =>
          todo._id === action.payload._id ? action.payload : todo
        );
      })
      .addCase(deleteTodoApi.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo._id !== action.payload);
      });
  },
});

export default todoSlice.reducer;
