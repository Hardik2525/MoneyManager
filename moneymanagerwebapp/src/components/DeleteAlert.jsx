const DeleteAlert = ({ content, onDelete, onCancel, isDeleting }) => (
    <div>
        <p className="text-sm text-gray-600 dark:text-gray-300">{content}</p>
        <div className="flex justify-end gap-3 mt-6">
            <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            >
                Cancel
            </button>
            <button
                type="button"
                onClick={onDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white cursor-pointer disabled:opacity-70"
            >
                {isDeleting ? "Deleting..." : "Delete"}
            </button>
        </div>
    </div>
);

export default DeleteAlert;
