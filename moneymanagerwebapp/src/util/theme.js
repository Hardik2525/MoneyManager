const THEME_KEY = "darkMode";

export const getSavedDarkMode = () => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === null) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return stored === "true";
};

export const applyDarkMode = (enabled) => {
    document.documentElement.classList.toggle("dark", enabled);
    localStorage.setItem(THEME_KEY, String(enabled));
};

export const toggleDarkMode = () => {
    const next = !document.documentElement.classList.contains("dark");
    applyDarkMode(next);
    return next;
};
