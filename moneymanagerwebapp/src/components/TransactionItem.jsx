import { Trash2, TrendingDown, TrendingUp, UtensilsCrossed } from "lucide-react";
import { formatCurrency, formatDate } from "../util/format";

const TransactionItem = ({ title, icon, date, amount, type, categoryName, onDelete, hideDelete }) => {
    const isIncome = type === "income";

    return (
        <div className="group flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
            <div className="w-12 h-12 shrink-0 flex items-center justify-center text-xl bg-gray-100 dark:bg-gray-800 rounded-full">
                {icon ? icon : <UtensilsCrossed size={20} className="text-purple-600" />}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                    {formatDate(date)}
                    {categoryName ? ` · ${categoryName}` : ""}
                </p>
            </div>

            <div className="flex items-center gap-2">
                {!hideDelete && onDelete && (
                    <button
                        onClick={onDelete}
                        aria-label={`Delete ${title}`}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition cursor-pointer"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
                <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                        isIncome
                            ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                            : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                    }`}
                >
                    <span>
                        {isIncome ? "+" : "-"} {formatCurrency(amount)}
                    </span>
                    {isIncome ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                </div>
            </div>
        </div>
    );
};

export default TransactionItem;
