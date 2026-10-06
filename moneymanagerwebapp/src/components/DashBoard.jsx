import { useState } from "react";
import MenuBar from "./MenuBar";
import SideMenu from "./SideMenu";
import { useUser } from "../hooks/useUser";

const Dashboard = ({ children }) => {
    useUser();
    const [sidebarVisible, setSidebarVisible] = useState(false);

    const closeSidebar = () => setSidebarVisible(false);

    return (
        <div className="min-h-screen flex bg-gray-50">
            <SideMenu sidebarVisible={sidebarVisible} onNavigate={closeSidebar} />

            <div className="flex-1 flex flex-col min-w-0 min-h-screen">
                <MenuBar
                    isOpen={sidebarVisible}
                    setIsOpen={setSidebarVisible}
                />
                <main className="flex-1 p-4 sm:p-6">{children}</main>
            </div>
        </div>
    );
};

export default Dashboard;
