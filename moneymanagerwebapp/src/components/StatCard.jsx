const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="flex items-center gap-5 bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800 rounded-2xl shadow-sm p-5 sm:p-6">
        <div className={`w-14 h-14 flex items-center justify-center rounded-full text-white shadow-lg ${color}`}>
            <Icon size={24} />
        </div>
        <div className="min-w-0">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
            <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100 truncate">{value}</p>
        </div>
    </div>
);

export default StatCard;
