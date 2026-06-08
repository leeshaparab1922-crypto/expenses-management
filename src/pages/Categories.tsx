import React, { useState } from 'react';
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
};

export default Categories;
