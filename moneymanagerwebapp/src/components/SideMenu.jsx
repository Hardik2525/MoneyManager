import { NavLink } from "react-router-dom";
import MENU_ITEMS from "../util/MENU_ITEMS";

const linkClass = (isActive) =>
    isActive
        ? "flex items-center gap-3 px-3 py-3 w-full text-sm font-medium text-gray-800 dark:text-gray-100 bg-purple-50 dark:bg-purple-950 border-l-4 border-purple-800 rounded-md"
        : "flex items-center gap-3 px-3 py-3 w-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-100 rounded-md transition-colors";

const SideMenu = ({ sidebarVisible, onNavigate, activeMenu }) => {
    return (
        <>
            {sidebarVisible && (
                <button
                    type="button"
                    aria-label="Close menu"
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={onNavigate}
                />
            )}

            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200/80 dark:border-gray-700
                    flex flex-col pt-6 pb-8 px-4 shrink-0
                    transform transition-transform duration-200 ease-out
                    lg:translate-x-0
                    ${sidebarVisible ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                <h2 className="text-sm font-semibold leading-5 tracking-[-0.02em] uppercase mb-4 ml-3 text-gray-500 dark:text-gray-400">
                    Menu
                </h2>

                <nav className="flex flex-col gap-1">
                    {MENU_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                className={({ isActive }) =>
                                    linkClass(isActive || activeMenu === item.label)
                                }
                                onClick={onNavigate}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                {item.label}
                            </NavLink>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};

export default SideMenu;
