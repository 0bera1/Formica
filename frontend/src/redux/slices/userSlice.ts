import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

export interface User {
  _id: string;
  username: string;
  email: string;
}

interface UserState {
  users: User[];
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  user: null,
  loading: false,
  error: null,
};

// Fetch all users
export const fetchUsers = createAsyncThunk("tasks/fetchUsers", async () => {
  const response = await axios.get("http://localhost:3000/users");
  return response.data;
});

export const deleteUser = createAsyncThunk(
  "tasks/deleteUser",
  async (id: string) => {
    const response = await axios.delete(`http://localhost:3000/users/${id}`);
    return response.data;
  }
);

// Fetch single user by ID
export const fetchUserDetail = createAsyncThunk(
  "users/fetchUserDetail",
  async (id: string) => {
    const response = await axios.get(`http://localhost:3000/users/${id}`);
    return response.data;
  }
);

// Update user
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({
    id,
    username,
    email,
  }: {
    id: string;
    username: string;
    email: string;
  }) => {
    const response = await axios.put(`http://localhost:3000/users/${id}`, { username, email });
    return response.data;
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetching users
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "An error occurred";
    });

    // Handle fetching user details
    builder.addCase(fetchUserDetail.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUserDetail.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(fetchUserDetail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "An error occurred";
    });

    // Handle updating user
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload; // Updated user details
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "An error occurred";
    });
  },
});

export default userSlice.reducer;
export const selectUsers = (state: RootState) => state.users.users;
export const selectUser = (state: RootState) => state.users.user;
export const selectLoading = (state: RootState) => state.users.loading;
export const selectError = (state: RootState) => state.users.error;
