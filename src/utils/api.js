import axios from "axios";

const api = axios.create({
  baseURL: 'http://10.0.0.100:3005',
});

export default api;