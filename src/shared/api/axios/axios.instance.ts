
import axios from "axios";
import { API_BASE_URL, API_PREFIX } from "@/shared/config/envs/env";

const baseURL = `${API_BASE_URL}${API_PREFIX}`;



export const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});