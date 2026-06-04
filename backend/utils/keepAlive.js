import cron from "node-cron";
import axios from "axios";

cron.schedule("*/5 * * * *", async () => {
  try {
    await axios.get(process.env.BACKEND_URL);
    console.log("Pinged successfully");
  } catch (error) {
    console.error("Ping failed:", error.message);
  }
});