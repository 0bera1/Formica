import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createTask, deleteTask, getTasks, updateTask } from "../../api/tasks";

interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  return await getTasks();
});

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (task: { title: string; description: string }) => {
    return await createTask(task);
  }
);
export const editTask = createAsyncThunk(
  "tasks/editTask",
  async (payload: {
    id: string;
    task: { title: string; description: string };
  }) => {
    const { id, task } = payload;
    return await updateTask(id, task);
  }
);

export const removeTask = createAsyncThunk(
  "tasks/removeTask",
  async (id: string) => {
    return await deleteTask(id);
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, { payload }) => {
        state.tasks = payload;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || "Failed to fetch tasks";
      })
      .addCase(addTask.fulfilled, (state, { payload }) => {
        state.tasks.push(payload);
      })
      .addCase(editTask.fulfilled, (state, { payload }) => {
        const index = state.tasks.findIndex((task) => task.id === payload.id);
        if (index !== -1) {
          state.tasks[index] = payload;
        }
      })
      .addCase(removeTask.fulfilled, (state, { payload }) => {
        state.tasks = state.tasks.filter((task) => task.id !== payload.id);
      });
  },
});

export default taskSlice.reducer;
