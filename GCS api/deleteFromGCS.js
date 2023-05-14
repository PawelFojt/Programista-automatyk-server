import { bucket } from "./bucket.js";

export const deleteFromGCS = async (fileName) => {
    await bucket.file(fileName).delete();
};
