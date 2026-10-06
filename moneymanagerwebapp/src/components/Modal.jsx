import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full overflow-y-auto bg-black/50 px-4">
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-200 dark:border-gray-700 rounded-t">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <div className="p-4 md:p-5 space-y-4">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
