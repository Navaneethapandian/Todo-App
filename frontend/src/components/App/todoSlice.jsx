import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, TODO_API } from "../../Services/api";

const auth = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const createTodo = createAsyncThunk(
  "todos/createTodo",
  async ({ title, description, userId, status }) => {
    const res = await api.post(
      TODO_API,
      { title, description, status, userId },
      auth()
    );
    return res.data.todo;
  }
);

export const getTodos = createAsyncThunk(
  "todos/getTodos",
  async ({ page, limit }) => {
    const res = await api.get(
      `${TODO_API}?page=${page}&limit=${limit}`,
      auth()
    );
    return res.data;
  }
);

export const updateTodoApi = createAsyncThunk(
  "todos/updateTodo",
  async ({ id, title, description, status }) => {
    const res = await api.put(
      `${TODO_API}/${id}`,
      { title, description, status },
      auth()
    );
    return res.data.todo;
  }
);

export const deleteTodoApi = createAsyncThunk(
  "todos/deleteTodo",
  async (id) => {
    await api.delete(`${TODO_API}/${id}`, auth());
    return id;
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    todos: [],
    loading: false,
    page: 1,
    limit: 10,
    totalPages: 1,
    error: null,
  },

  reducers: {
    nextPage: (state) => {
      if (state.page < state.totalPages) {
        state.page += 1;
      }
    },
    prevPage: (state) => {
      if (state.page > 1) {
        state.page -= 1;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getTodos.pending, (state) => {
        state.loading = true;
      })

      .addCase(getTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload.todos;
        state.totalPages = action.payload.totalPages;
      })

      .addCase(getTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(createTodo.fulfilled, (state, action) => {
        state.todos.unshift(action.payload);
      })

      .addCase(updateTodoApi.fulfilled, (state, action) => {
        state.todos = state.todos.map((t) =>
          t._id === action.payload._id ? action.payload : t
        );
      })

      .addCase(deleteTodoApi.fulfilled, (state, action) => {
        state.todos = state.todos.filter((t) => t._id !== action.payload);
      });
  },
});

export const { nextPage, prevPage } = todoSlice.actions;
export default todoSlice.reducer;
