import React from 'react';
import Navbar from '../components/Layout/Navbar';
import SummaryCards from '../components/Dashboard/SummaryCards';
import ExpenseForm from '../components/Dashboard/ExpenseForm';
import ExpenseList from '../components/Dashboard/ExpenseList';

const Dashboard: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 w-full">
            <Navbar />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 space-y-6">
                            <SummaryCards />
                            <ExpenseForm />
                        </div>
                        <div className="md:col-span-2">
                            <ExpenseList />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
