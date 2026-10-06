import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = ({ label, value, onChange, placeholder, type }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
        <div className="mb-4">
            <label className="text-[13px] text-slate-800 dark:text-slate-200 block mb-1">
                {label}
            </label>
            <div className="relative">
                <input
                    className="w-full bg-transparent outline-none border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 pr-10 text-gray-700 dark:text-gray-100 leading-tight focus:outline-none focus:border-purple-700 placeholder:text-gray-400"
                    type={isPassword && showPassword ? "text" : type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e)}
                />
                {isPassword && (
                    <span
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-500"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </span>
                )}
            </div>
        </div>
    );
};

export default Input;
