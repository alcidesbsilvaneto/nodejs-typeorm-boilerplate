import { app } from "./app";
import dotenv from "dotenv";
import logger from "@utils/logger";
import AppDataSource from "@services/Database";

dotenv.config({
  path: process.env.NODE_ENV === "production" ? process.env.PWD + "/.env" : process.env.PWD + "/.dev.env",
});

const start = async () => {
  try {
    await AppDataSource.initialize();
    logger.info(`[APP] | Database successfully connected`);
    await AppDataSource.synchronize();
    logger.info(`[APP] | Database successfully synchronized`);
    app.listen(process.env.PORT || 1337, () => {
      logger.info("[APP] | Server listening on " + process.env.PORT || 1337);
    });
  } catch (error) {
    logger.error({ err: error, stack: error.stack, customMessage: "error initializing database" });
  }
};
 
start();
