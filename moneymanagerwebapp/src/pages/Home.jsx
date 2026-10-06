import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Coins, Receipt, Wallet, WalletCards } from "lucide-react";
import toast from "react-hot-toast";
import Dashboard from "../components/DashBoard";
import Card from "../components/Card";
import StatCard from "../components/StatCard";
import TransactionItem from "../components/TransactionItem";
import EmptyState from "../components/EmptyState";
import DonutChart from "../components/charts/DonutChart";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { formatCurrency } from "../util/format";
import { useUser } from "../hooks/useUser";

const SeeAll = ({ to }) => {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(to)}
            className="flex items-center gap-1 text-sm font-medium text-purple-700 dark:text-purple-300 hover:underline cursor-pointer"
        >
            See all <ArrowRight size={15} />
        </button>
    );
};

const TransactionList = ({ items, type, emptyText }) =>
    items?.length ? (
        <div className="space-y-1">
            {items.map((t) => (
                <TransactionItem
                    key={`${type || t.type}-${t.id}`}
                    title={t.name}
                    icon={t.icon}
                    date={t.date}
                    amount={t.amount}
                    type={type || t.type}
                    hideDelete
                />
            ))}
        </div>
    ) : (
        <EmptyState icon={Receipt} title={emptyText} />
    );

const Home = () => {
    const { user } = useUser();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setIsLoading(true);
                const response = await axiosConfig.get(API_ENDPOINTS.DASHBOARD_DATA);
                setData(response.data);
            } catch (error) {
                console.error("Failed to load dashboard", error);
                toast.error(error.response?.data?.message || "Failed to load dashboard");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const totalIncome = Number(data?.totalIncome || 0);
    const totalExpense = Number(data?.totalExpense || 0);
    const totalBalance = Number(data?.totalBalance || 0);

    const overview = [
        { name: "Balance", amount: Math.max(totalBalance, 0), color: "#7c3aed" },
        { name: "Income", amount: totalIncome, color: "#16a34a" },
        { name: "Expense", amount: totalExpense, color: "#dc2626" },
    ];

    return (
        <Dashboard activeMenu="Dashboard">
            <div className="max-w-6xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100">
                        Welcome back{user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""} 👋
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Here's a snapshot of your money today.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <StatCard icon={WalletCards} label="Total Balance" value={formatCurrency(totalBalance)} color="bg-purple-700" />
                    <StatCard icon={Wallet} label="Total Income" value={formatCurrency(totalIncome)} color="bg-green-600" />
                    <StatCard icon={Coins} label="Total Expense" value={formatCurrency(totalExpense)} color="bg-red-600" />
                </div>

                {isLoading && !data ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Loading your dashboard...</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Recent Transactions" action={<SeeAll to="/filter" />}>
                                <TransactionList
                                    items={data?.recentTransactions}
                                    emptyText="No transactions yet"
                                />
                            </Card>
                            <Card title="Financial Overview">
                                {totalIncome === 0 && totalExpense === 0 ? (
                                    <EmptyState
                                        icon={WalletCards}
                                        title="Nothing to chart yet"
                                        message="Add income and expenses to see your overview."
                                    />
                                ) : (
                                    <DonutChart
                                        data={overview}
                                        centerLabel="Total Balance"
                                        centerValue={formatCurrency(totalBalance)}
                                    />
                                )}
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title="Recent Income" action={<SeeAll to="/income" />}>
                                <TransactionList
                                    items={data?.recent5Incomes}
                                    type="income"
                                    emptyText="No income added yet"
                                />
                            </Card>
                            <Card title="Recent Expenses" action={<SeeAll to="/expense" />}>
                                <TransactionList
                                    items={data?.recent5Expenses}
                                    type="expense"
                                    emptyText="No expenses added yet"
                                />
                            </Card>
                        </div>
                    </>
                )}
            </div>
        </Dashboard>
    );
};

export default Home;
