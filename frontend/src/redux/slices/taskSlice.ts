import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Task tiplerini tanımlayalım
export interface Task {
  _id: string;
  title: string;
  description: string;
  assignees: string[];
  createdAt: string;
  updatedAt: string;
}

interface TaskState {
  tasks: Task[];
  task: Task | null;
  loading: boolean;
  error: string | null;
}

// Başlangıç durumu
const initialState: TaskState = {
  tasks: [],
  task: null,
  loading: false,
  error: null,
};

// Getirilecek tüm görevleri fetch etmek için async thunk
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const response = await axios.get("http://localhost:3000/tasks");
  return response.data;
});

// Task detayını almak için async thunk
export const fetchTaskDetail = createAsyncThunk(
  "tasks/fetchTaskDetail",
  async (taskId: string) => {
    const response = await axios.get(`http://localhost:3000/tasks/${taskId}`);
    return response.data;
  }
);

// Yeni bir görev oluşturmak için async thunk
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData: {
    title: string;
    description: string;
    assignees: string[];
  }) => {
    const response = await axios.post("http://localhost:3000/tasks", taskData);
    return response.data;
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (taskData: {
    id: string;
    title: string;
    description: string;
    assignees: string[];
  }) => {
    const updatedTaskData = {
      ...taskData,
      updatedAt: new Date().toISOString() // Güncellenme zamanını ekliyoruz
    };

    const response = await axios.put(
      `http://localhost:3000/tasks/${taskData.id}`,
      updatedTaskData
    );
    return response.data;
  }
);


// Task silme işlemi için async thunk
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: string) => {
    await axios.delete(`http://localhost:3000/tasks/${taskId}`);
    return taskId; // Silinen task'ın ID'sini dönecek
  }
);

// Slice
const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Tüm görevleri getirme işlemi
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tasks = payload;
      })
      .addCase(fetchTasks.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || "Failed to load tasks";
      })

      // Task detayını getirme işlemi
      .addCase(fetchTaskDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskDetail.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.task = payload;
      })
      .addCase(fetchTaskDetail.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || "Failed to load task detail";
      })

      // Yeni görev oluşturma işlemi
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tasks.push(payload); // Yeni görev listeye ekleniyor
      })
      .addCase(createTask.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || "Failed to create task";
      })

      // Task güncelleme işlemi
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
      })
      // .addCase(updateTask.fulfilled, (state, { payload }) => {
      //   state.loading = false;
      //   const index = state.tasks.findIndex(task => task._id === payload._id);
      //   if (index >= 0) {
      //     state.tasks[index] = payload; // Güncellenmiş task, listede yer alacak
      //   }
      // })
      .addCase(updateTask.fulfilled, (state, { payload }) => {
        state.loading = false;
        const updatedTasks = state.tasks.map((task) =>
          task._id === payload.id ? payload : task
        );
        state.tasks = updatedTasks;
        state.task = payload;
      })
      .addCase(updateTask.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || "Failed to update task";
      })

      // Task silme işlemi
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTask.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task._id !== payload); // Silinen task listeden çıkarılıyor
      })
      .addCase(deleteTask.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || "Failed to delete task";
      });
  },
});

export default taskSlice.reducer;
