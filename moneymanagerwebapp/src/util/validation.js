export const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password) => {
    return password.length >= 8;
};

export const validateName = (name) => {
    return name.length >= 3;
};

export const validateConfirmPassword = (password, confirmPassword) => {
    return password === confirmPassword;
};
