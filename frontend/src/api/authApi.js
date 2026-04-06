import apiClient from "./apiClient";

export const loginStaff = async (payload) => {
  const response = await apiClient.post("/auth/staff/login", payload);
  return response.data;
};

export const getCurrentStaff = async () => {
  const response = await apiClient.get("/auth/staff/me");
  return response.data;
};
