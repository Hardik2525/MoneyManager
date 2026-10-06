import moment from "moment";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
});

export const formatCurrency = (value) => currencyFormatter.format(Number(value) || 0);

export const formatDate = (date) => (date ? moment(date).format("Do MMM YYYY") : "");

export const today = () => moment().format("YYYY-MM-DD");

export const groupByDate = (transactions) => {
    const totals = {};
    transactions.forEach((t) => {
        const key = t.date;
        totals[key] = (totals[key] || 0) + Number(t.amount || 0);
    });
    return Object.keys(totals)
        .sort()
        .map((date) => ({
            date,
            label: moment(date).format("Do MMM"),
            amount: totals[date],
        }));
};
