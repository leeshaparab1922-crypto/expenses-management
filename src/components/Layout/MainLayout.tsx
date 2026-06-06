import React from 'react';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="bg-background text-on-surface min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 overflow-y-auto pb-24 md:pb-8">
                {children}
            </main>
            <BottomNav />
        </div>
    );
};

export default MainLayout;
