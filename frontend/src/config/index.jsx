import axios from "axios";

const apiBaseURL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://networx-a-social-media-networking.onrender.com";

export const clientServer = axios.create({
  baseURL: apiBaseURL,
});
