import axios from "axios";

const API_URL = "http://localhost:3000/tasks";

export const getTasks = async (token: string) => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createTask = async (task: {
  title: string;
  description: string;
}) => {
  const response = await axios.post(API_URL, task);
  return response.data;
};

export const updateTask = async (
  id: string,
  task: { title: string; description: string }
) => {
  const response = await axios.put(`${API_URL}/tasks/${id}`, task);
  return response.data;
};

export const deleteTask = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
