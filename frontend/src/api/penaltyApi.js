import apiClient from "./apiClient";

export const processOverduePenalties = async () => {
  const response = await apiClient.post("/penalties/process-overdue");
  return response.data;
};

export const getPenaltiesByEmiId = async (emiScheduleId) => {
  const response = await apiClient.get(`/penalties/emi/${emiScheduleId}`);
  return response.data;
};
