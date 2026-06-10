import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category } from '../services/storage';
import { categoryService } from '../services/categoryService';
import { useAuth } from './AuthContext';

interface CategoryContextType {
    categories: Category[];
    createCategory: (category: Omit<Category, 'id'>) => void;
    updateCategory: (category: Category) => void;
    deleteCategory: (id: string | number) => void;
    refreshCategories: () => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);

    const refreshCategories = () => {
        if (currentUser) {
            setCategories(categoryService.getAllCategories(currentUser.id));
        } else {
            setCategories([]);
        }
    };

    useEffect(() => {
        refreshCategories();
    }, [currentUser]);

    const createCategory = (categoryData: Omit<Category, 'id'>) => {
        if (!currentUser) return;
        categoryService.createCategory(currentUser.id, categoryData);
        refreshCategories();
    };

    const updateCategory = (category: Category) => {
        if (!currentUser) return;
        categoryService.updateCategory(currentUser.id, category);
        refreshCategories();
    };

    const deleteCategory = (id: string | number) => {
        if (!currentUser) return;
        categoryService.deleteCategory(currentUser.id, id);
        refreshCategories();
    };

    return (
        <CategoryContext.Provider value={{ categories, createCategory, updateCategory, deleteCategory, refreshCategories }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategories = () => {
    const context = useContext(CategoryContext);
    if (context === undefined) {
        throw new Error('useCategories must be used within an CategoryProvider');
    }
    return context;
};
