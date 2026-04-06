import apiClient from "./apiClient";

export const createCustomerProfile = async (payload) => {
  const response = await apiClient.post("/customers", payload);
  return response.data;
};

export const getAllCustomerProfiles = async () => {
  const response = await apiClient.get("/customers");
  return response.data;
};

export const getCustomerProfileById = async (customerId) => {
  const response = await apiClient.get(`/customers/${customerId}`);
  return response.data;
};
