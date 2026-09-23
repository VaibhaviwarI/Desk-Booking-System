const app = require("./app");
const connectDB = require("./config/db");
const { PORT } = require("./config/env");
const { initNoShowJob } = require("./jobs/noShow.job");

const startServer = async () => {
  try {
    // Connect to Database
    await connectDB();

    // Initialize background jobs
    initNoShowJob();
    console.log("No-Show cron job initialized.");

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error.message);
    process.exit(1);
  }
};

startServer();
