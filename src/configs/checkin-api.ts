import axios from "axios";
import { env } from "./env";

export default axios.create({
  baseURL: env.CHECKIN_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: env.CHECKIN_API_TOKEN,
  },
});
