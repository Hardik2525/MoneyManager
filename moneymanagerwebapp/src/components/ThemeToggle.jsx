import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { getSavedDarkMode, toggleDarkMode } from "../util/theme";

const ThemeToggle = ({ className = "" }) => {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        setDark(getSavedDarkMode());
    }, []);

    const handleToggle = () => {
        setDark(toggleDarkMode());
    };

    return (
        <button
            type="button"
            onClick={handleToggle}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 cursor-pointer ${className}`}
        >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
};

export default ThemeToggle;
