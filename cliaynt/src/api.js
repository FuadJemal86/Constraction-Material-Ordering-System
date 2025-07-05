
import axios, { CanceledError } from "axios";

const isDevelopment = process.env.NODE_ENV === "development";

const api = axios.create({
    baseURL: isDevelopment ? `http://localhost:4000` : 'https://jejan.selamdca.org/',
    withCredentials: true,
});

const nPoint = `http://localhost:4000`;

export default api;
export { CanceledError, nPoint };