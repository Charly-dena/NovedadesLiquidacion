import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  console.log('MainLayout sidebarOpen:', sidebarOpen); // Debug

  const toggleSidebar = () => {
    console.log('Toggling sidebar, was:', sidebarOpen); // Debug
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    console.log('Closing sidebar'); // Debug
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen bg-secondary-50 flex overflow-hidden">
      {/* Hamburger Sidebar - Always overlay, never takes layout space */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={closeSidebar} 
      />

      {/* Main Content Area - Full width always */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuClick={toggleSidebar} 
        />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="container-app section-padding">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Sidebar Overlay for all screen sizes */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50"
          style={{ zIndex: 45 }}
          onClick={closeSidebar}
        />
      )}
    </div>
  );
}