import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api'; 

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000 
});

export default axiosInstance;
