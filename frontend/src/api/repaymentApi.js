import apiClient from "./apiClient";

export const createRepayment = async (payload) => {
  const response = await apiClient.post("/repayments", payload);
  return response.data;
};

export const getRepaymentsByEmiId = async (emiScheduleId) => {
  const response = await apiClient.get(`/repayments/emi/${emiScheduleId}`);
  return response.data;
};
