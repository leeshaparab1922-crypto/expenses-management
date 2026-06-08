import React, { createContext, useContext, useState, useEffect } from 'react';
<<<<<<< HEAD
import { Storage, Category, TransactionType } from '../services/storage';
import { useAuth } from './AuthContext';

interface CategoryContextType {
    categories: Category[];
    addCategory: (category: Omit<Category, 'id' | 'isDefault'>) => void;
    deleteCategory: (id: string) => void;
    getCategoryById: (id: string) => Category | undefined;
=======
import { Category, categoryService } from '../services/categoryService';

interface CategoryContextType {
    categories: Category[];
    createCategory: (category: Omit<Category, 'id'>) => void;
    updateCategory: (category: Category) => void;
    deleteCategory: (id: number) => void;
    refreshCategories: () => void;
>>>>>>> feature/stack-upgrade
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
<<<<<<< HEAD
    const { currentUser } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        if (currentUser) {
            const loaded = Storage.getCategories(currentUser.id);
            setCategories(loaded);
        } else {
            setCategories([]);
        }
    }, [currentUser]);

    const addCategory = (categoryData: Omit<Category, 'id' | 'isDefault'>) => {
        if (!currentUser) return;
        
        const newCategory: Category = {
            ...categoryData,
            id: 'custom_' + Date.now(),
            isDefault: false
        };
        
        const updated = [...categories, newCategory];
        setCategories(updated);
        
        const customOnly = updated.filter(c => !c.isDefault);
        Storage.saveCustomCategories(currentUser.id, customOnly);
    };

    const deleteCategory = (id: string) => {
        if (!currentUser) return;
        
        const category = categories.find(c => c.id === id);
        if (!category || category.isDefault) return;

        const updated = categories.filter(c => c.id !== id);
        setCategories(updated);
        
        const customOnly = updated.filter(c => !c.isDefault);
        Storage.saveCustomCategories(currentUser.id, customOnly);
    };

    const getCategoryById = (id: string) => {
        return categories.find(c => c.id === id);
    };

    return (
        <CategoryContext.Provider value={{ categories, addCategory, deleteCategory, getCategoryById }}>
=======
    const [categories, setCategories] = useState<Category[]>([]);

    const refreshCategories = () => {
        setCategories(categoryService.getAllCategories());
    };

    useEffect(() => {
        refreshCategories();
    }, []);

    const createCategory = (categoryData: Omit<Category, 'id'>) => {
        categoryService.createCategory(categoryData);
        refreshCategories();
    };

    const updateCategory = (category: Category) => {
        categoryService.updateCategory(category);
        refreshCategories();
    };

    const deleteCategory = (id: number) => {
        categoryService.deleteCategory(id);
        refreshCategories();
    };

    return (
        <CategoryContext.Provider value={{ categories, createCategory, updateCategory, deleteCategory, refreshCategories }}>
>>>>>>> feature/stack-upgrade
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategories = () => {
    const context = useContext(CategoryContext);
    if (context === undefined) {
<<<<<<< HEAD
        throw new Error('useCategories must be used within a CategoryProvider');
=======
        throw new Error('useCategories must be used within an CategoryProvider');
>>>>>>> feature/stack-upgrade
    }
    return context;
};
