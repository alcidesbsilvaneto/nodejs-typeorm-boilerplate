import SendGrid from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "production" ? process.env.PWD + "/.env" : process.env.PWD + "/.dev.env",
});

SendGrid.setApiKey(process.env.MAILER_PASSWORD);

export default SendGrid;
