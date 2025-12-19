import axios from "axios";
import { Navigate } from "react-router-dom";

const apiCall = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
//   withCredentials: true, while using cookies
});

apiCall.interceptors.request.use((config) => {
  const raw = localStorage.getItem("sb-qdtmpeyzfzhavqfmmfdb-auth-token");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      const accessToken = parsed?.access_token?.trim();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (err) {
      console.error("Failed to parse Supabase token:", err);
    }
  }
  return config;
});

apiCall.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      console.error("Network error:", error.message);
    } else {
      const { status } = error.response;
      if (status === 401) {
        console.warn("Unauthorized - maybe token expired");
        localStorage.clear();
        window.location.href = '/auth';
      } else if (status === 403) {
        console.warn("Forbidden");
      } else {
        console.error("API error:", error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export async function safeApiCall(promise) {
  try {
    const res = await promise;
    return [res.data, null];
  } catch (err) {
    return [null, err];
  }
}

export default apiCall;
