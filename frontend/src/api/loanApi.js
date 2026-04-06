import apiClient from "./apiClient";

export const applyForLoan = async (payload) => {
  const response = await apiClient.post("/loans/apply", payload);
  return response.data;
};

export const getLoanById = async (loanId) => {
  const response = await apiClient.get(`/loans/${loanId}`);
  return response.data;
};

export const getAllLoans = async () => {
  const response = await apiClient.get("/loans");
  return response.data;
};
