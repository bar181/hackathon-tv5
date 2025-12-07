import React from 'react';
import { Menu, MonitorPlay } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: 'home' | 'standard' | 'personalized' | 'howto') => void;
  currentPage: 'home' | 'standard' | 'personalized' | 'howto';
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'standard', label: 'Standard (Before)' },
    { id: 'personalized', label: 'Personalized (After)' },
    { id: 'howto', label: 'How It Works' },
  ] as const;

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8 w-full">
          
          {/* Logo */}
          <div 
            className="text-2xl font-bold tracking-tight flex items-center cursor-pointer min-w-fit"
            onClick={() => onNavigate('home')}
          >
            <span className="text-tv5">TV5</span><span className="text-white">MONDE</span>
            <span className="ml-2 text-xs bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded border border-gray-700">POC</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-1 flex-grow justify-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                  ${currentPage === item.id 
                    ? 'text-white bg-slate-800' 
                    : 'text-gray-400 hover:text-white hover:bg-slate-800/50'}
                `}
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          {/* Mobile Menu Icon */}
          <button className="md:hidden text-gray-400 hover:text-white">
            <Menu size={24} />
          </button>
          
          {/* Right Placeholder */}
          <div className="hidden md:block w-20 text-right">
             <div className="w-8 h-8 bg-tv5 rounded-full ml-auto flex items-center justify-center font-bold text-white text-xs">
                AI
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;