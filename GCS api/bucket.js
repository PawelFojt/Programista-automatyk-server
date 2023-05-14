import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";

dotenv.config();

const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
});
export const bucket = storage.bucket(process.env.BUCKET_NAME);
