import React, { useState } from 'react';
<<<<<<< HEAD
import MainLayout from '../components/Layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { useCategories } from '../contexts/CategoryContext';
import { TransactionType } from '../services/storage';

const Categories: React.FC = () => {
    const { categories, addCategory, deleteCategory } = useCategories();
    const [search, setSearch] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);

    const [name, setName] = useState('');
    const [type, setType] = useState<TransactionType>('expense');
    const [selectedIcon, setSelectedIcon] = useState('category');

    const icons = ['home', 'payments', 'directions_car', 'shopping_cart', 'medical_services', 'movie', 'restaurant', 'commute', 'school', 'work', 'box', 'pets', 'fitness_center', 'bolt', 'flight'];

    const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    const defaultCategories = filteredCategories.filter(c => c.isDefault);
    const customCategories = filteredCategories.filter(c => !c.isDefault);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;
        addCategory({ name, type, icon: selectedIcon });
        setName('');
        setIsFormVisible(false);
    };

    return (
        <MainLayout>
            <div className="max-w-[1200px] mx-auto pt-8 px-4 md:px-margin-desktop">
                <header className="flex items-center justify-between mb-8">
                    <h1 className="font-headline-md text-headline-md font-bold text-primary">Categories</h1>
                    <div className="relative w-64 hidden md:block">
                        <input 
                            className="w-full h-10 pl-10 pr-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all font-body-sm" 
                            placeholder="Search categories..." 
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-sm">search</span>
                    </div>
                </header>

                <section className="mb-8 md:hidden">
                    <div className="relative w-full">
                        <input 
                            className="w-full h-12 pl-12 pr-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-lg text-body-lg" 
                            placeholder="Search categories..." 
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <span className="material-symbols-outlined absolute left-4 top-3 text-on-surface-variant">search</span>
                    </div>
                </section>

                {/* Default Categories */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-headline-md text-headline-md text-on-surface">Default Categories</h2>
                        <span className="text-label-md font-label-md text-outline uppercase tracking-wider">Locked</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {defaultCategories.map(cat => (
                            <div key={cat.id} className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl flex flex-col items-center justify-center gap-3 hover:shadow-sm transition-shadow">
                                <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                                </div>
                                <span className="font-label-md text-label-md text-on-surface">{cat.name}</span>
                                <span className="material-symbols-outlined text-xs text-outline-variant">lock</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Custom Categories */}
                <section className="mb-12">
                    <h2 className="font-headline-md text-headline-md text-on-surface mb-6">My Custom Categories</h2>
                    <div className="space-y-3 mb-6">
                        {customCategories.map(cat => (
                            <div key={cat.id} className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl flex items-center justify-between group hover:bg-surface-container-low transition-colors duration-150">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                                        <span className="material-symbols-outlined text-on-primary-fixed filled-icon">{cat.icon}</span>
                                    </div>
                                    <div>
                                        <p className="font-body-lg text-body-lg text-on-surface font-semibold">{cat.name}</p>
                                        <span className={`inline-block px-2 py-0.5 rounded-full font-label-md text-[10px] uppercase ${cat.type === 'income' ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-secondary-container text-on-secondary-container'}`}>
                                            {cat.type}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button className="p-2 text-outline hover:text-primary hover:bg-primary-fixed transition-all rounded-full">
                                        <span className="material-symbols-outlined">edit</span>
                                    </button>
                                    <button 
                                        className="p-2 text-outline hover:text-error hover:bg-error-container transition-all rounded-full"
                                        onClick={() => deleteCategory(cat.id)}
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                        
                        {customCategories.length === 0 && !isFormVisible && (
                            <p className="text-center text-on-surface-variant py-8 border-2 border-dashed border-outline-variant rounded-xl">No custom categories yet.</p>
                        )}
                    </div>

                    {!isFormVisible ? (
                        <button 
                            className="w-full border-2 border-dashed border-outline-variant py-4 rounded-xl text-outline font-label-md flex items-center justify-center gap-2 hover:bg-surface-container-low hover:border-primary hover:text-primary transition-all duration-200"
                            onClick={() => setIsFormVisible(true)}
                        >
                            <span className="material-symbols-outlined">add</span>
                            Add New Category
                        </button>
                    ) : (
                        <div className="bg-surface-container-high p-6 rounded-xl border border-outline-variant shadow-inner transition-all duration-300">
                            <form onSubmit={handleCreate}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Category Name</label>
                                        <input 
                                            className="w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                                            placeholder="e.g. Subscriptions" 
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Category Type</label>
                                        <div className="flex h-12 bg-surface-container-lowest rounded-lg p-1 border border-outline-variant">
                                            <button 
                                                type="button"
                                                className={`flex-1 flex items-center justify-center rounded-md font-label-md text-label-md transition-colors ${type === 'expense' ? 'bg-primary text-white' : 'hover:bg-surface-container-high'}`}
                                                onClick={() => setType('expense')}
                                            >Expense</button>
                                            <button 
                                                type="button"
                                                className={`flex-1 flex items-center justify-center rounded-md font-label-md text-label-md transition-colors ${type === 'income' ? 'bg-primary text-white' : 'hover:bg-surface-container-high'}`}
                                                onClick={() => setType('income')}
                                            >Income</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <label className="block font-label-md text-label-md text-on-surface-variant mb-3">Choose Icon</label>
                                    <div className="flex flex-wrap gap-4">
                                        {icons.map(icon => (
                                            <button 
                                                key={icon}
                                                type="button"
                                                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${selectedIcon === icon ? 'border-primary bg-primary-fixed text-primary' : 'border-outline-variant bg-surface hover:border-primary text-on-surface-variant'}`}
                                                onClick={() => setSelectedIcon(icon)}
                                            >
                                                <span className="material-symbols-outlined">{icon}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-8 flex gap-3 justify-end">
                                    <button 
                                        className="h-12 px-6 rounded-lg font-label-md text-label-md text-outline hover:bg-surface-container-highest transition-colors"
                                        type="button"
                                        onClick={() => setIsFormVisible(false)}
                                    >Cancel</button>
                                    <button 
                                        className="h-12 px-8 rounded-lg font-label-md text-label-md bg-primary text-on-primary hover:bg-primary-container transition-all shadow-md"
                                        type="submit"
                                    >Create Category</button>
                                </div>
                            </form>
                        </div>
                    )}
                </section>
            </div>
        </MainLayout>
    );
=======
import { useCategories } from '../contexts/CategoryContext';

const Categories: React.FC = () => {
  const { categories, createCategory, deleteCategory } = useCategories();
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createCategory({ name, icon: 'category', color: '#0d631b' });
    setName('');
  };

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>
      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input 
          type="text" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="New category name" 
          className="border p-2 rounded flex-1"
          required
        />
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Add</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white p-4 rounded shadow flex justify-between items-center border">
            <span>{cat.name}</span>
            <button onClick={() => deleteCategory(cat.id)} className="text-error text-sm">Delete</button>
          </div>
        ))}
      </div>
    </main>
  );
>>>>>>> feature/stack-upgrade
};

export default Categories;
