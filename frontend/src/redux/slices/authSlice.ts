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

// Login Thunk
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await axios.post('http://localhost:3000/auth/login', credentials);
    return response.data.access_token;
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
