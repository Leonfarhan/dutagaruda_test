import axios from 'axios';

const apiClient = axios.create();

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response || error.message);
    const message = error.response?.data?.message || error.message || 'Terjadi kesalahan pada server.';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
