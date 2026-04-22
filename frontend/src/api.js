import axios from "axios";

const api = axios.create({
  baseURL: "https://tienda-ropa-ia-production.up.railway.app/"
});

export default api;