import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Task {
  id: string;
  title: string;
  description: string;
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

// Get Tasks
export const getTasks = createAsyncThunk(
  'tasks/getTasks',
  async (token: string) => {
    const response = await axios.get('http://localhost:3000/tasks', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

// Add Task
export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (task: { title: string; description: string }, { getState }) => {
    interface RootState {
      auth: {
        token: string;
      };
    }

    const { token } = (getState() as RootState).auth; // Get token from state
    const response = await axios.post(
      'http://localhost:3000/tasks',
      task,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
);

// Task Slice
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTasks.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tasks = payload;
      })
      .addCase(getTasks.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || 'Failed to fetch tasks';
      })
      .addCase(addTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTask.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tasks.push(payload);
      })
      .addCase(addTask.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || 'Failed to add task';
      });
  },
});

export default taskSlice.reducer;
