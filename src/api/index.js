import axios from 'axios';

const api = axios.create({
  baseURL: 'https://odontolegal-api.onrender.com'
});

export default api;