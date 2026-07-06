export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_BASE_URL;

export const USER_API_END_POINT = `${API_BASE_URL}/api/v1/user`;
export const JOB_API_END_POINT = `${API_BASE_URL}/api/v1/job`;
export const APPLICATION_API_END_POINT = `${API_BASE_URL}/api/v1/application`;
export const COMPANY_API_END_POINT = `${API_BASE_URL}/api/v1/company`;
export const MESSAGE_API_END_POINT = `${API_BASE_URL}/api/v1/message`;
export const FRIENDS_API_END_POINT = `${API_BASE_URL}/api/v1/friends`;
export const QUIZ_API_END_POINT = `${API_BASE_URL}/api/quiz`;
export const ML_API_END_POINT = `${API_BASE_URL}/api/ml`;
