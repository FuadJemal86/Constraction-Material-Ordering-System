
import axios, { CanceledError } from "axios";

const api = axios.create({
    baseURL: "http://localhost:3032",
    withCredentials: true,
});

const nPoint = "http://localhost:3032";

export default api;
export { CanceledError, nPoint };