import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category, categoryService } from '../services/categoryService';

interface CategoryContextType {
    categories: Category[];
    createCategory: (category: Omit<Category, 'id'>) => void;
    updateCategory: (category: Category) => void;
    deleteCategory: (id: number) => void;
    refreshCategories: () => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
