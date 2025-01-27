/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
};

// Axios interceptor to add token to headers
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Login Thunk
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', credentials);
      localStorage.setItem('token', response.data.access_token); // Token'ı localStorage'a kaydet
      return response.data.access_token;
    } catch (error) {
      return rejectWithValue((error as any).response.data);
    }
  }
);

// Register Thunk
export const register = createAsyncThunk(
  'auth/register',
  async (credentials: { username: string; email: string; password: string }) => {
    const response = await axios.post('http://localhost:3000/auth/register', credentials);
    return response.data.access_token;
  }
);

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      localStorage.removeItem('token'); // Token'ı localStorage'dan sil
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.token = payload;
      })
      .addCase(login.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || 'Login failed!';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.token = payload;
      })
      .addCase(register.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || 'Registration failed!';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
