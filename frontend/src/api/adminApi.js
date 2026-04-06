import apiClient from "./apiClient";

export const getManualReviewLoans = async () => {
  const response = await apiClient.get("/admin/loans/manual-review");
  return response.data;
};

export const approveLoan = async (loanId, payload) => {
  const response = await apiClient.put(`/admin/loans/${loanId}/approve`, payload);
  return response.data;
};

export const rejectLoan = async (loanId, payload) => {
  const response = await apiClient.put(`/admin/loans/${loanId}/reject`, payload);
  return response.data;
};
