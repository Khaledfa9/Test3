import React from 'react';
import { HomeIcon, UtensilsIcon, HistoryIcon, SettingsIcon } from './icons';

type Page = 'home' | 'meals' | 'history' | 'settings';

interface BottomNavProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage }) => {
  const navItems = [
    { id: 'home', icon: HomeIcon, label: 'Home' },
    { id: 'meals', icon: UtensilsIcon, label: 'Meals' },
    { id: 'history', icon: HistoryIcon, label: 'History' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around max-w-lg mx-auto">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id as Page)}
            className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-sm transition-colors duration-200 ${
              activePage === item.id ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
