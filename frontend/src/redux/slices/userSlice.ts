import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUsers, updateUser } from "../../api/users";

interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  return await getUsers();
});

export const editUser = createAsyncThunk(
  "users/editUser",
  async ({ id, user }: { id: string; user: Partial<User> }) => {
    return await updateUser(id, user);
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.users = payload;
      })
      .addCase(fetchUsers.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || "Failed to fetch users";
      })
      .addCase(editUser.fulfilled, (state, { payload }) => {
        const index = state.users.findIndex((user) => user.id === payload.id);
        if (index !== -1) {
          state.users[index] = payload;
        }
      });
  },
});

export default userSlice.reducer;
