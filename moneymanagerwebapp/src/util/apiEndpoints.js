export const BASE_URL = "https://moneymanager-o3ss.onrender.com/api/v1.0";
export const CLOUDINARY_CLOUD_NAME = "fbsme7rj";
export const CLOUDINARY_UPLOAD_PRESET = "moneymanager";

export const API_ENDPOINTS = {
    LOGIN: "/login",
    REGISTER: "/register",
    STATUS: "/status",
    ACTIVATE: "/activate",
    HEALTH: "/health",
    GET_USER_INFO: "/profile",
    GET_USER_PROFILE: "/profile",
    SIGNUP: "/signup",
    DASHBOARD_DATA: "/dashboard",
    GET_ALL_CATEGORIES: "/categories",
    ADD_CATEGORY: "/categories",
    UPDATE_CATEGORY: (categoryId) => `/categories/${categoryId}`,
    CATEGORY_BY_TYPE: (type) => `/categories/${type}`,
    GET_ALL_INCOMES: "/incomes",
    ADD_INCOME: "/incomes",
    DELETE_INCOME: (incomeId) => `/incomes/${incomeId}`,
    DOWNLOAD_INCOME: "/incomes/excel",
    EMAIL_INCOME: "/incomes/email",
    GET_ALL_EXPENSES: "/expenses",
    ADD_EXPENSE: "/expenses",
    DELETE_EXPENSE: (expenseId) => `/expenses/${expenseId}`,
    DOWNLOAD_EXPENSE: "/expenses/excel",
    EMAIL_EXPENSE: "/expenses/email",
    APPLY_FILTERS: "/filter",
    UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
}
