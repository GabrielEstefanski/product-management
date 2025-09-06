'use client';

import React, { useState } from 'react';
import { Menu, X, LayoutDashboard, Package, FolderOpen, BarChart3, User } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '#' },
    { icon: Package, label: 'Produtos', href: '#' },
    { icon: FolderOpen, label: 'Categorias', href: '#' },
    { icon: BarChart3, label: 'Relatórios', href: '#' },
  ];

  return (
    <>
      <header className="bg-gray-900 border-b border-gray-200/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                Product Management System
              </h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex items-center space-x-6">
                {menuItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <a 
                      key={index}
                      href={item.href} 
                      className="flex items-center space-x-2 text-sm font-medium text-white hover:text-blue-200 transition-colors duration-200"
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{item.label}</span>
                    </a>
                  );
                })}
              </nav>
              
              <div className="flex items-center ml-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                  <User className="w-4 h-4 text-blue-900" />
                </div>
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 text-white hover:text-blue-200 transition-colors duration-200 rounded-lg hover:bg-gray-800"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="fixed inset-0 bg-gray-200/60 bg-opacity-50 transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
          />
          
          <div className="fixed top-16 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
            <nav className="px-4 py-4 space-y-1">
                {menuItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                    <a
                        key={index}
                        href={item.href}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <IconComponent className="w-5 h-5 text-gray-500" />
                        <span className="font-medium">{item.label}</span>
                    </a>
                    );
                })}
              
                <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex items-center space-x-3 px-4">
                        <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-900">Usuário</p>
                        </div>
                    </div>
                </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}