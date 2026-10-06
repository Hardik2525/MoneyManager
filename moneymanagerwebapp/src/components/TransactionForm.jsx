import { useState } from "react";
import Input from "./Input";
import EmojiPickerPopup from "./EmojiPickerPopup";
import { today } from "../util/format";

const TransactionForm = ({ type, categories, onSubmit, isSaving }) => {
    const [form, setForm] = useState({
        name: "",
        amount: "",
        date: today(),
        icon: "",
        categoryId: categories[0]?.id ?? "",
    });

    const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const categoryId = form.categoryId || categories[0]?.id || "";

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...form, categoryId });
    };

    const label = type === "income" ? "Income" : "Expense";

    return (
        <form onSubmit={handleSubmit}>
            <EmojiPickerPopup icon={form.icon} onSelect={(icon) => update("icon", icon)} />

            <Input
                label={`${label} Source`}
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder={type === "income" ? "Salary, Freelance, Bonus" : "Groceries, Rent, Fuel"}
            />

            <div className="mb-4">
                <label className="text-[13px] text-slate-800 dark:text-slate-200 block mb-1">Category</label>
                {categories.length === 0 ? (
                    <p className="text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 rounded-md p-2">
                        No {type} categories yet. Add one on the Category page first.
                    </p>
                ) : (
                    <select
                        value={categoryId}
                        onChange={(e) => update("categoryId", e.target.value)}
                        className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-100 dark:bg-gray-900 outline-none focus:border-purple-700"
                    >
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.icon ? `${c.icon} ` : ""}{c.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <Input
                    label="Amount"
                    type="number"
                    value={form.amount}
                    onChange={(e) => update("amount", e.target.value)}
                    placeholder="0.00"
                />
                <Input
                    label="Date"
                    type="date"
                    value={form.date}
                    onChange={(e) => update("date", e.target.value)}
                />
            </div>

            <div className="flex justify-end mt-2">
                <button
                    type="submit"
                    disabled={isSaving || categories.length === 0}
                    className="px-5 py-2.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-sm font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isSaving ? "Saving..." : `Add ${label}`}
                </button>
            </div>
        </form>
    );
};

export default TransactionForm;
