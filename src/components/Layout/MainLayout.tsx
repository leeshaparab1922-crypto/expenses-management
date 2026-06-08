import React from 'react';
import Navbar from './Navbar';
<<<<<<< HEAD
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
=======

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-background flex flex-col">
    <Navbar />
    <div className="flex-1">{children}</div>
    <footer className="bg-surface-container-low border-t border-outline-variant mt-6">
      <div className="flex flex-col md:flex-row justify-between items-center py-3 px-12 w-full max-w-[1200px] mx-auto">
        <div className="text-label-md font-bold text-on-surface mb-2 md:mb-0">SpendWise</div>
        <div className="flex gap-6 mb-2 md:mb-0">
          {['Privacy Policy', 'Terms of Service', 'Security', 'Help Center'].map(l => (
            <a key={l} className="text-label-md text-on-surface-variant hover:underline hover:text-primary transition-all" href="#">{l}</a>
          ))}
        </div>
        <div className="text-body-sm text-on-surface-variant">© 2024 SpendWise Financial. All rights reserved.</div>
      </div>
    </footer>
  </div>
);
>>>>>>> feature/stack-upgrade

export default MainLayout;
