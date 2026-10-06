import { useEffect, useMemo, useState } from "react";
import { Plus, Receipt, Mail, Download } from "lucide-react";
import toast from "react-hot-toast";
import Dashboard from "./DashBoard";
import Card from "./Card";
import Modal from "./Modal";
import TransactionItem from "./TransactionItem";
import TransactionForm from "./TransactionForm";
import DeleteAlert from "./DeleteAlert";
import EmptyState from "./EmptyState";
import TrendChart from "./charts/TrendChart";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { formatCurrency, groupByDate } from "../util/format";

const CONFIG = {
    income: {
        label: "Income",
        sources: "Income Sources",
        menu: "Income",
        color: "#16a34a",
        list: API_ENDPOINTS.GET_ALL_INCOMES,
        add: API_ENDPOINTS.ADD_INCOME,
        remove: API_ENDPOINTS.DELETE_INCOME,
        download: API_ENDPOINTS.DOWNLOAD_INCOME,
        email: API_ENDPOINTS.EMAIL_INCOME,
        fileName: "income.xlsx",
        subtitle: "Track your earnings over time and analyze your income trends.",
    },
    expense: {
        label: "Expense",
        sources: "Expense Sources",
        menu: "Expense",
        color: "#dc2626",
        list: API_ENDPOINTS.GET_ALL_EXPENSES,
        add: API_ENDPOINTS.ADD_EXPENSE,
        remove: API_ENDPOINTS.DELETE_EXPENSE,
        download: API_ENDPOINTS.DOWNLOAD_EXPENSE,
        email: API_ENDPOINTS.EMAIL_EXPENSE,
        fileName: "expense.xlsx",
        subtitle: "Track your spending over time and find where your money goes.",
    },
};

const TransactionsPage = ({ type }) => {
    const config = CONFIG[type];
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isEmailing, setIsEmailing] = useState(false);

    const fetchTransactions = async () => {
        try {
            setIsLoading(true);
            const response = await axiosConfig.get(config.list);
            setTransactions(response.data || []);
        } catch (error) {
            console.error(`Failed to load ${type} records`, error);
            toast.error(error.response?.data?.message || `Failed to load ${type} records`);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE(type));
            setCategories(response.data || []);
        } catch (error) {
            console.error("Failed to load categories", error);
        }
    };

    useEffect(() => {
        fetchTransactions();
        fetchCategories();
    }, [type]);

    const chartData = useMemo(() => groupByDate(transactions), [transactions]);
    const total = useMemo(
        () => transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0),
        [transactions]
    );
    const sorted = useMemo(
        () => [...transactions].sort((a, b) => (a.date < b.date ? 1 : -1)),
        [transactions]
    );

    const handleAdd = async (form) => {
        if (!form.name.trim()) {
            toast.error(`Please enter a name for this ${type}`);
            return;
        }
        if (!form.amount || Number(form.amount) <= 0) {
            toast.error("Amount should be greater than 0");
            return;
        }
        if (!form.date) {
            toast.error("Please pick a date");
            return;
        }
        if (!form.categoryId) {
            toast.error("Please choose a category");
            return;
        }

        try {
            setIsSaving(true);
            await axiosConfig.post(config.add, {
                ...form,
                amount: Number(form.amount),
                categoryId: Number(form.categoryId),
            });
            toast.success(`${config.label} added`);
            setOpenAddModal(false);
            fetchTransactions();
        } catch (error) {
            console.error(`Failed to add ${type}`, error);
            toast.error(error.response?.data?.message || `Failed to add ${type}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleEmail = async () => {
        if (transactions.length === 0) {
            toast.error(`No ${type} records to email`);
            return;
        }
        try {
            setIsEmailing(true);
            await axiosConfig.get(config.email);
            toast.success(`${config.label} report sent to your email`);
        } catch (error) {
            console.error(`Failed to email ${type} report`, error);
            toast.error(error.response?.data?.message || "Failed to send email");
        } finally {
            setIsEmailing(false);
        }
    };

    const handleDownload = async () => {
        if (transactions.length === 0) {
            toast.error(`No ${type} records to download`);
            return;
        }
        try {
            setIsDownloading(true);
            const response = await axiosConfig.get(config.download, { responseType: "blob" });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.download = config.fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(`Failed to download ${type} report`, error);
            toast.error("Failed to download the report");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            setIsDeleting(true);
            await axiosConfig.delete(config.remove(deleteTarget.id));
            toast.success(`${config.label} deleted`);
            setDeleteTarget(null);
            fetchTransactions();
        } catch (error) {
            console.error(`Failed to delete ${type}`, error);
            toast.error(error.response?.data?.message || `Failed to delete ${type}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const addButton = (
        <button
            onClick={() => setOpenAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-sm font-medium cursor-pointer"
        >
            <Plus size={16} />
            Add {config.label}
        </button>
    );

    return (
        <Dashboard activeMenu={config.menu}>
            <div className="max-w-6xl mx-auto space-y-6">
                <Card
                    title={`${config.label} Overview`}
                    action={addButton}
                >
                    <p className="text-sm text-gray-500 dark:text-gray-400 -mt-3 mb-5">{config.subtitle}</p>
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">This month</span>
                        <span className="text-2xl font-semibold" style={{ color: config.color }}>
                            {formatCurrency(total)}
                        </span>
                    </div>
                    {chartData.length > 0 ? (
                        <TrendChart data={chartData} color={config.color} />
                    ) : (
                        <EmptyState
                            icon={Receipt}
                            title={`No ${type} this month`}
                            message={`Add your first ${type} to see your trend here.`}
                        />
                    )}
                </Card>

                <Card
                    title={config.sources}
                    action={
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleEmail}
                                disabled={isEmailing}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer disabled:opacity-60"
                            >
                                <Mail size={16} />
                                {isEmailing ? "Sending..." : "Email"}
                            </button>
                            <button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer disabled:opacity-60"
                            >
                                <Download size={16} />
                                {isDownloading ? "Downloading..." : "Download"}
                            </button>
                        </div>
                    }
                >
                    {isLoading ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
                    ) : sorted.length === 0 ? (
                        <EmptyState
                            icon={Receipt}
                            title={`No ${type} records yet`}
                            message="Records you add this month will show up here."
                            action={addButton}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                            {sorted.map((t) => (
                                <TransactionItem
                                    key={t.id}
                                    title={t.name}
                                    icon={t.icon}
                                    date={t.date}
                                    amount={t.amount}
                                    type={type}
                                    categoryName={t.categoryName}
                                    onDelete={() => setDeleteTarget(t)}
                                />
                            ))}
                        </div>
                    )}
                </Card>
            </div>

            <Modal
                isOpen={openAddModal}
                onClose={() => setOpenAddModal(false)}
                title={`Add ${config.label}`}
            >
                <TransactionForm
                    key={openAddModal ? "open" : "closed"}
                    type={type}
                    categories={categories}
                    onSubmit={handleAdd}
                    isSaving={isSaving}
                />
            </Modal>

            <Modal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                title={`Delete ${config.label}`}
            >
                <DeleteAlert
                    content={`Are you sure you want to delete "${deleteTarget?.name}"? This can't be undone.`}
                    onDelete={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                    isDeleting={isDeleting}
                />
            </Modal>
        </Dashboard>
    );
};

export default TransactionsPage;
