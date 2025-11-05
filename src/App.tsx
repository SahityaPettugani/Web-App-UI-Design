import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/HomePage";
import { DashboardPage } from "./components/DashboardPage";
import { LibraryPage } from "./components/LibraryPage";

export default function App() {
  // Get initial page from URL
  const getPageFromPath = () => {
    const path = window.location.pathname;
    if (path === '/' || path === '/home') return 'home';
    if (path === '/dashboard') return 'dashboard';
    if (path === '/library') return 'library';
    if (path === '/about') return 'about';
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState(getPageFromPath());

  // Handle navigation with URL updates
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    const path = page === 'home' ? '/' : `/${page}`;
    window.history.pushState({}, '', path);
  };

  // Listen for browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getPageFromPath());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'dashboard':
        return <DashboardPage />;
      case 'library':
        return <LibraryPage onNavigate={handleNavigate} />;
      case 'about':
        return (
          <div className="min-h-screen bg-gradient-to-br from-[#F3EEE8] to-[#e5ddd3] pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-[#3C73AD] mb-6">About VizTwin</h1>
              <div className="bg-white rounded-2xl p-8 shadow-lg space-y-4">
                <p className="text-[#3C73AD]">
                  VizTwin is a cutting-edge platform that transforms 3D scans into accurate digital building models using advanced AI technology.
                </p>
                <p className="text-[#3C73AD]">
                  Our mission is to make building intelligence accessible to everyone, regardless of technical background. We believe that property owners, architects, and facility managers should have easy access to precise 3D models of their buildings.
                </p>
                <p className="text-[#3C73AD]">
                  With VizTwin, you can upload point cloud scans from any device and receive interactive, exportable 3D models in minutes. Our AI automatically identifies architectural elements like walls, doors, ceilings, and floors, saving you hours of manual work.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-['Inter',sans-serif]">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}
