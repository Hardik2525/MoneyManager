import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu, User, X } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import ThemeToggle from "./ThemeToggle";

const MenuBar = ({ isOpen, setIsOpen }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const { user, clearUser } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showDropdown]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        clearUser();
        setShowDropdown(false);
        navigate("/login");
    };

    return (
        <div className="flex items-center justify-between gap-5 bg-white dark:bg-gray-900 border border-b border-gray-200/50 dark:border-gray-700 backdrop-blur-[2px] py-4 px-4 sm:px-7 sticky top-0 z-30">
            {/* Left side - Menu button and title */}
            <div className="flex items-center gap-5">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="block lg:hidden text-black dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded transition-colors cursor-pointer"
                >
                    {isOpen ? <X className="text-2xl" /> : <Menu className="text-2xl" />}
                </button>

                <div className="flex items-center gap-2">
                    <img src={assets.logo} alt="logo" className="h-10 w-10" />
                    <span className="text-lg font-medium text-black dark:text-gray-100 truncate">Money Manager</span>
                </div>
            </div>

            {/* Right side - Avatar and dropdown */}
            <div className="relative flex items-center gap-3" ref={dropdownRef}>
                <ThemeToggle />
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                    {user?.profileImageUrl ? (
                        <img src={user.profileImageUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                        <User className="text-purple-500" />
                    )}
                </button>

                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full">
                                    <User className="w-4 h-4 text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                                        {user?.fullName}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="py-1">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 cursor-pointer"
                            >
                                <LogOut className="w-4 h-4 text-gray-500" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuBar;
