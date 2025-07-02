import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" 
            onClick={() => setSidebarOpen(false)} 
          />
          <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs">
            <div className="flex h-full flex-col bg-gradient-to-b from-blue-900 to-blue-800">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-white p-3 flex items-center justify-center">
                    <img 
                      src="/ChatGPT Image Jun 5, 2025, 04_32_06 PM.png" 
                      alt="CaboAi Logo" 
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-white">CaboAi</h1>
                    <p className="text-xs text-blue-200">AI Communications</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-white hover:text-gray-300 p-2"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <Sidebar mobile onNavigate={() => setSidebarOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="lg:pl-72">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 lg:hidden bg-white border-b border-gray-200 shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <button
              type="button"
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-white border border-gray-200 p-2 flex items-center justify-center">
                <img 
                  src="/ChatGPT Image Jun 5, 2025, 04_32_06 PM.png" 
                  alt="CaboAi Logo" 
                  className="h-7 w-7 object-contain"
                />
              </div>
              <h1 className="text-lg font-semibold text-gray-900">CaboAi</h1>
            </div>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Main content */}
        <main className="py-4 lg:py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;