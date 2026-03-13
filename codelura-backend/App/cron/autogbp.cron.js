import cron from "node-cron";
import { runAutoGBPService } from "../services/autogbp.service.js";

export const startAutoGBP = () => {

  cron.schedule("0 9 * * *", async () => {

    try {

      console.log("Running AutoGBP cron...");

      await runAutoGBPService();

      console.log("AutoGBP Finished");

    } catch (err) {

      console.error(err.message);

    }

  });

};