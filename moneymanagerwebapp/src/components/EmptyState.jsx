const EmptyState = ({ icon: Icon, title, message, action }) => (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
        {Icon && (
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 mb-4">
                <Icon size={24} />
            </div>
        )}
        <p className="text-base font-medium text-gray-800 dark:text-gray-100">{title}</p>
        {message && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">{message}</p>}
        {action && <div className="mt-5">{action}</div>}
    </div>
);

export default EmptyState;
