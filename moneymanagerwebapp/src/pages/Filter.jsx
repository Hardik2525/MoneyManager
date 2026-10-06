import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import Dashboard from "../components/DashBoard";
import Card from "../components/Card";
import TransactionItem from "../components/TransactionItem";
import EmptyState from "../components/EmptyState";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { formatCurrency } from "../util/format";

const fieldClass =
    "w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm text-gray-700 dark:text-gray-100 dark:bg-gray-900 outline-none focus:border-purple-700";

const Field = ({ label, children }) => (
    <div>
        <label className="text-[13px] text-slate-800 dark:text-slate-200 block mb-1">{label}</label>
        {children}
    </div>
);

const Filter = () => {
    const [filters, setFilters] = useState({
        type: "income",
        startDate: "",
        endDate: "",
        keyword: "",
        sortField: "date",
        sortOrder: "desc",
    });
    const [results, setResults] = useState([]);
    const [resultType, setResultType] = useState("income");
    const [hasSearched, setHasSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

    const handleSearch = async (e) => {
        e.preventDefault();
        if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) {
            toast.error("Start date must be before end date");
            return;
        }
        try {
            setIsLoading(true);
            const response = await axiosConfig.post(API_ENDPOINTS.APPLY_FILTERS, {
                ...filters,
                startDate: filters.startDate || null,
                endDate: filters.endDate || null,
            });
            setResults(response.data || []);
            setResultType(filters.type);
            setHasSearched(true);
        } catch (error) {
            console.error("Failed to filter transactions", error);
            toast.error(error.response?.data?.message || "Failed to fetch transactions");
        } finally {
            setIsLoading(false);
        }
    };

    const total = results.reduce((sum, t) => sum + Number(t.amount || 0), 0);

    return (
        <Dashboard activeMenu="Filter">
            <div className="max-w-6xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100">
                        Filter Transactions
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Search your income and expenses by date, name, and amount.
                    </p>
                </div>

                <Card title="Select the filters">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                        <Field label="Type">
                            <select value={filters.type} onChange={(e) => update("type", e.target.value)} className={fieldClass}>
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>
                        </Field>
                        <Field label="Start Date">
                            <input type="date" value={filters.startDate} onChange={(e) => update("startDate", e.target.value)} className={fieldClass} />
                        </Field>
                        <Field label="End Date">
                            <input type="date" value={filters.endDate} onChange={(e) => update("endDate", e.target.value)} className={fieldClass} />
                        </Field>
                        <Field label="Sort Field">
                            <select value={filters.sortField} onChange={(e) => update("sortField", e.target.value)} className={fieldClass}>
                                <option value="date">Date</option>
                                <option value="amount">Amount</option>
                                <option value="name">Name</option>
                            </select>
                        </Field>
                        <Field label="Sort Order">
                            <select value={filters.sortOrder} onChange={(e) => update("sortOrder", e.target.value)} className={fieldClass}>
                                <option value="desc">Descending</option>
                                <option value="asc">Ascending</option>
                            </select>
                        </Field>
                        <div className="flex gap-2 sm:col-span-2 lg:col-span-6">
                            <input
                                type="text"
                                value={filters.keyword}
                                onChange={(e) => update("keyword", e.target.value)}
                                placeholder="Search by name..."
                                className={fieldClass}
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center gap-2 shrink-0 px-5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-sm font-medium cursor-pointer disabled:opacity-70"
                            >
                                <Search size={16} />
                                {isLoading ? "Searching..." : "Search"}
                            </button>
                        </div>
                    </form>
                </Card>

                <Card
                    title="Transactions"
                    action={
                        hasSearched && results.length > 0 ? (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {results.length} results · {formatCurrency(total)}
                            </span>
                        ) : null
                    }
                >
                    {!hasSearched ? (
                        <EmptyState
                            icon={SlidersHorizontal}
                            title="Choose your filters"
                            message="Pick a type and date range, then press Search to see matching transactions."
                        />
                    ) : results.length === 0 ? (
                        <EmptyState
                            icon={Search}
                            title="No matching transactions"
                            message="Try a wider date range or a different keyword."
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                            {results.map((t) => (
                                <TransactionItem
                                    key={t.id}
                                    title={t.name}
                                    icon={t.icon}
                                    date={t.date}
                                    amount={t.amount}
                                    type={resultType}
                                    categoryName={t.categoryName}
                                    hideDelete
                                />
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </Dashboard>
    );
};

export default Filter;
