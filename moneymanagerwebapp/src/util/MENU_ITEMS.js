import {
    LayoutDashboard,
    Wallet,
    Receipt,
    Tags,
    SlidersHorizontal,
} from "lucide-react";

const MENU_ITEMS = [
    {
        id: 1,
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        id: 2,
        label: "Income",
        path: "/income",
        icon: Wallet,
    },
    {
        id: 3,
        label: "Expense",
        path: "/expense",
        icon: Receipt,
    },
    {
        id: 4,
        label: "Category",
        path: "/category",
        icon: Tags,
    },
    {
        id: 5,
        label: "Filter",
        path: "/filter",
        icon: SlidersHorizontal,
    },
];

export default MENU_ITEMS;
