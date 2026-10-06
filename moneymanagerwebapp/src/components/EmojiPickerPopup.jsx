import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { Image, X } from "lucide-react";

const EmojiPickerPopup = ({ icon, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isDark = document.documentElement.classList.contains("dark");

    return (
        <div className="flex flex-col md:flex-row items-start gap-5 mb-2">
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-4 cursor-pointer"
            >
                <div className="w-12 h-12 flex items-center justify-center text-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 rounded-lg">
                    {icon ? icon : <Image size={22} />}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                    {icon ? "Change icon" : "Pick icon"}
                </p>
            </button>

            {isOpen && (
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full absolute -top-2 -right-2 z-10 cursor-pointer"
                    >
                        <X size={14} />
                    </button>
                    <EmojiPicker
                        theme={isDark ? "dark" : "light"}
                        height={380}
                        onEmojiClick={(emoji) => {
                            onSelect(emoji.emoji);
                            setIsOpen(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default EmojiPickerPopup;
