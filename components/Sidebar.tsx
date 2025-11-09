'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, ShoppingCart, Home, Moon, Sun } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Inventory Items', href: '/items', icon: Package },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check localStorage and system preference on mount
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
      document.documentElement.classList.toggle('dark', savedMode === 'true');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 bg-primary-600 text-white">
          <h1 className="text-xl font-bold">Inventory App</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 font-semibold'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <>
                <Sun className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Dark Mode</span>
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Inventory Management v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
