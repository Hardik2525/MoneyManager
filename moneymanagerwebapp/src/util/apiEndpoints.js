export const BASE_URL = "https://moneymanager-o3ss.onrender.com/api/v1.0";
export const CLOUDINARY_CLOUD_NAME = "fbsme7rj";
export const CLOUDINARY_UPLOAD_PRESET = "moneymanager";

export const API_ENDPOINTS = {
    LOGIN: "/login",
    REGISTER: "/register",
    STATUS: "/status",
    ACTIVATE: "/activate",
    HEALTH: "/health",
    SIGNUP: "/signup",
    UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
}