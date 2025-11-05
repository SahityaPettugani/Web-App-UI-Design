import { Box } from "lucide-react";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#3C73AD] shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="bg-[#FFE2EE] p-2 rounded-lg">
              <Box className="w-6 h-6 text-[#79274B]" />
            </div>
            <span className="text-[#F3EEE8] tracking-wide" style={{ fontSize: '1.25rem', fontWeight: 600 }}>VizTwin</span>
          </div>

          {/* Center Navigation */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onNavigate('home')}
              className={`transition-colors ${
                currentPage === 'home' 
                  ? 'text-[#FFE2EE]' 
                  : 'text-[#F3EEE8] hover:text-[#AEE1FE]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('library')}
              className={`transition-colors ${
                currentPage === 'library' 
                  ? 'text-[#FFE2EE]' 
                  : 'text-[#F3EEE8] hover:text-[#AEE1FE]'
              }`}
            >
              Library
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`transition-colors ${
                currentPage === 'about' 
                  ? 'text-[#FFE2EE]' 
                  : 'text-[#F3EEE8] hover:text-[#AEE1FE]'
              }`}
            >
              About
            </button>
          </div>

          {/* Login/Sign Up Button */}
          <button className="bg-[#FFE2EE] text-[#79274B] px-6 py-2 rounded-lg hover:bg-[#FFE2EE]/90 transition-colors">
            Login / Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}
