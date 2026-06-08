export interface Category {
    id: number;
    name: string;
    icon: string;
    color: string;
}

const STORAGE_KEY = 'et_categories';

export const categoryService = {
    getAllCategories: (): Category[] => {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    },
    
    getCategoryById: (id: number): Category | undefined => {
        return categoryService.getAllCategories().find(c => c.id === id);
    },
    
    createCategory: (category: Omit<Category, 'id'>): Category => {
        const categories = categoryService.getAllCategories();
        const newCategory: Category = { ...category, id: Date.now() };
        categories.push(newCategory);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
        return newCategory;
    },
    
    updateCategory: (updatedCategory: Category): void => {
        const categories = categoryService.getAllCategories();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(categories.map(c => c.id === updatedCategory.id ? updatedCategory : c)));
    },
    
    deleteCategory: (id: number): void => {
        const categories = categoryService.getAllCategories();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(categories.filter(c => c.id !== id)));
    }
};
