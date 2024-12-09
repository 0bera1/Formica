import axios from "axios";

const API_URL = "http://localhost:3000/users";

export const getUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const updateUser = async (
  id: string,
  user: Partial<{ username: string; email: string }>
) => {
  const response = await axios.put(`${API_URL}/${id}`, user);
  return response.data;
};
