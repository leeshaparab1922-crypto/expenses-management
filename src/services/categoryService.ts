import { Storage, Category } from './storage';

export const categoryService = {
    getAllCategories: (userId: number): Category[] => {
        return Storage.getCategories(userId);
    },
    
    getCategoryById: (userId: number, id: string | number): Category | undefined => {
        return categoryService.getAllCategories(userId).find(c => c.id === id);
    },
    
    createCategory: (userId: number, category: Omit<Category, 'id'>): Category => {
        const categories = Storage.getCategories(userId);
        const customOnly = categories.filter(c => !c.isDefault);
        const newCategory: Category = { ...category, id: Date.now() };
        customOnly.push(newCategory);
        Storage.saveCustomCategories(userId, customOnly);
        return newCategory;
    },
    
    updateCategory: (userId: number, updatedCategory: Category): void => {
        const categories = Storage.getCategories(userId);
        const customOnly = categories.filter(c => !c.isDefault);
        const updatedCustom = customOnly.map(c => c.id === updatedCategory.id ? updatedCategory : c);
        Storage.saveCustomCategories(userId, updatedCustom);
    },
    
    deleteCategory: (userId: number, id: string | number): void => {
        const categories = Storage.getCategories(userId);
        const customOnly = categories.filter(c => !c.isDefault);
        const filteredCustom = customOnly.filter(c => c.id !== id);
        Storage.saveCustomCategories(userId, filteredCustom);
    }
};
