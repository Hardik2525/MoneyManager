import { Layers2, Pencil } from "lucide-react";
import EmptyState from "./EmptyState";

const CategoryList = ({ categories, onEditCategory }) => {
    if (!categories?.length) {
        return (
            <EmptyState
                icon={Layers2}
                title="No categories yet"
                message="Add categories like Salary, Food or Rent to organise your transactions."
            />
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
                const isIncome = category.type === "income";
                return (
                    <div
                        key={category.id}
                        className="group flex items-center justify-between gap-3 p-4 rounded-xl border border-gray-200/70 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40 hover:shadow-md hover:-translate-y-0.5 transition"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-12 shrink-0 rounded-full bg-white dark:bg-gray-900 shadow-sm flex items-center justify-center text-xl">
                                {category.icon || <Layers2 size={20} className="text-purple-600" />}
                            </div>
                            <div className="min-w-0">
                                <p className="font-medium text-gray-800 dark:text-gray-100 truncate">{category.name}</p>
                                <span
                                    className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                                        isIncome
                                            ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                                            : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                                    }`}
                                >
                                    {category.type}
                                </span>
                            </div>
                        </div>
                        {onEditCategory && (
                            <button
                                onClick={() => onEditCategory(category)}
                                className="p-2 rounded-lg text-gray-400 hover:text-purple-700 hover:bg-white dark:hover:bg-gray-900 sm:opacity-0 sm:group-hover:opacity-100 transition cursor-pointer"
                                aria-label={`Edit ${category.name}`}
                            >
                                <Pencil size={16} />
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default CategoryList;
