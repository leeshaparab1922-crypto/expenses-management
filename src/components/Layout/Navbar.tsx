import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LOGO_BASE64 } from '../../assets/logo';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/transaction', label: 'Transactions' },
  { to: '/budget', label: 'Budgets' },
  { to: '/reports', label: 'Reports' },
  { to: '/categories', label: 'Categories' },
];

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userInitial = currentUser?.email?.charAt(0).toUpperCase() ?? 'U';

  return (
    <header className="bg-surface sticky top-0 z-50 border-b border-outline-variant">
      <div className="flex justify-between items-center h-16 w-full px-12 max-w-[1200px] mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <img alt="SpendWise Logo" className="h-8 w-8 rounded-lg" src={LOGO_BASE64} />
          <span className="text-headline-md font-headline-md font-bold text-primary">SpendWise</span>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive
                  ? 'text-primary font-bold border-b-2 border-primary pb-1 text-body-sm'
                  : 'text-on-surface-variant hover:text-primary transition-colors text-body-sm'
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-6">
          <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-all">
            notifications
          </button>
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(v => !v)}
              className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm focus:outline-none"
            >
              {userInitial}
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-surface border border-outline-variant rounded-lg shadow-lg py-1 z-50">
                <div className="px-4 py-2 text-body-sm text-on-surface-variant truncate border-b border-outline-variant">
                  {currentUser?.email}
                </div>
                <button
                  onClick={() => { setShowUserMenu(false); navigate('/profile'); }}
                  className="w-full text-left px-4 py-2 text-body-sm text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-body-sm text-error hover:bg-error-container/20 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
