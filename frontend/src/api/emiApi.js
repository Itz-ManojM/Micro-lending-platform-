import apiClient from "./apiClient";

export const generateEmiSchedule = async (loanId) => {
  const response = await apiClient.post(`/loans/${loanId}/emi-schedule/generate`);
  return response.data;
};

export const getEmiScheduleByLoanId = async (loanId) => {
  const response = await apiClient.get(`/loans/${loanId}/emi-schedule`);
  return response.data;
};
