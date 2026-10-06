import { useEffect, useState } from "react";
import Dashboard from "../components/DashBoard";
import { useUser } from "../hooks/useUser";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import CategoryList from "../components/CategoryList";
import Modal from "../components/Modal";
import Card from "../components/Card";
import EmojiPickerPopup from "../components/EmojiPickerPopup";

const emptyForm = {
    name: "",
    type: "expense",
    icon: "",
};

const CategoryForm = ({ formData, setFormData, onSubmit, isSaving, lockType, submitLabel }) => (
    <form onSubmit={onSubmit} className="space-y-4">
        <EmojiPickerPopup
            icon={formData.icon}
            onSelect={(icon) => setFormData({ ...formData, icon })}
        />
        <div>
            <label className="text-[13px] text-slate-800 dark:text-slate-200 block mb-1">Name</label>
            <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Food, Salary, Rent"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-100 dark:bg-gray-900 outline-none focus:border-purple-700"
            />
        </div>
        <div>
            <label className="text-[13px] text-slate-800 dark:text-slate-200 block mb-1">Type</label>
            <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                disabled={lockType}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-100 dark:bg-gray-900 outline-none focus:border-purple-700 disabled:bg-gray-100 dark:disabled:bg-gray-800"
            >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
            </select>
        </div>
        <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-lg cursor-pointer disabled:opacity-70"
        >
            {isSaving ? "Saving..." : submitLabel}
        </button>
    </form>
);

const Category = () => {
    useUser();
    const [categoryData, setCategoryData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
    const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState(emptyForm);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
            setCategoryData(response.data || []);
        } catch (error) {
            console.error("Failed to load categories", error);
            toast.error(error.response?.data?.message || "Failed to load categories");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const closeModals = () => {
        setOpenAddCategoryModal(false);
        setOpenEditCategoryModal(false);
        setSelectedCategory(null);
        setFormData(emptyForm);
    };

    const handleAddClick = () => {
        setFormData(emptyForm);
        setOpenAddCategoryModal(true);
    };

    const handleEditClick = (category) => {
        setSelectedCategory(category);
        setFormData({
            name: category.name || "",
            type: category.type || "expense",
            icon: category.icon || "",
        });
        setOpenEditCategoryModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error("Please enter a category name");
            return;
        }

        try {
            setIsSaving(true);
            if (openEditCategoryModal && selectedCategory) {
                await axiosConfig.put(
                    API_ENDPOINTS.UPDATE_CATEGORY(selectedCategory.id),
                    formData
                );
                toast.success("Category updated");
            } else {
                await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, formData);
                toast.success("Category added");
            }
            closeModals();
            fetchCategories();
        } catch (error) {
            console.error("Failed to save category", error);
            toast.error(error.response?.data?.message || "Failed to save category");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dashboard activeMenu="Category">
            <div className="max-w-6xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100">
                        Categories
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Group your income and expenses so your reports make sense.
                    </p>
                </div>

                <Card
                    title="All Categories"
                    action={
                        <button
                            onClick={handleAddClick}
                            className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white text-sm font-medium px-4 py-2 rounded-lg cursor-pointer"
                        >
                            <Plus size={16} />
                            Add Category
                        </button>
                    }
                >
                    {isLoading ? (
                        <p className="text-sm text-slate-500">Loading categories...</p>
                    ) : (
                        <CategoryList categories={categoryData} onEditCategory={handleEditClick} />
                    )}
                </Card>

                {/* Adding category modal */}
                <Modal
                    isOpen={openAddCategoryModal}
                    onClose={closeModals}
                    title="Add Category"
                >
                    <CategoryForm
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleSubmit}
                        isSaving={isSaving}
                        submitLabel="Add Category"
                    />
                </Modal>

                {/* Updating category modal */}
                <Modal
                    isOpen={openEditCategoryModal}
                    onClose={closeModals}
                    title="Update Category"
                >
                    <CategoryForm
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleSubmit}
                        isSaving={isSaving}
                        lockType
                        submitLabel="Update Category"
                    />
                </Modal>
            </div>
        </Dashboard>
    );
};

export default Category;
