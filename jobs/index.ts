import { handleSprintEnd } from "./handleSprintEnd";
import cron from "node-cron";

export const startCron = async () => {
  console.log("Cron job started");
  cron.schedule("0 0 */12 * * *", handleSprintEnd, {
    name: "Sprint end check",
    recoverMissedExecutions: true,
    runOnInit: true,
    scheduled: true,
    timezone: "America/Los_Angeles",
  });
};
