import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <nav className="sidebar">
        <h2>CaboAi</h2>
      </nav>
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
