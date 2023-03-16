import dotenv from "dotenv";

dotenv.config();

export const config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  USER: process.env.USER,
  USER_PASS: process.env.USER_PASS,
  SESSION_SECRET: process.env.SESSION_SECRET,
  PORT: 443,
};
