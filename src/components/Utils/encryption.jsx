import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = import.meta.env.REACT_APP_ENCRYPTION_KEY || "default_key";

export const encryptMessage = (message) => {
  try {
    return CryptoJS.AES.encrypt(message, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
};

export const decryptMessage = (encryptedMessage) => {
  try {
    if (!ENCRYPTION_KEY) {
      throw new Error("Cannot decrypt, key is missing.");
    }
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8) || "Decryption failed";
  } catch (error) {
    console.error("Decryption error:", error.message);
    return "Error: Unable to decrypt message";
  }
};