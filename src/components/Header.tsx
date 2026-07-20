import React, { useState } from "react";
import { Search, Sparkles, Menu, X } from "lucide-react";

interface HeaderProps {
  onSearch: (term: string) => void;
  onOpenCoach: () => void;
  onSelectCategory: (category: string) => void;
}

export default function Header({ onSearch, onOpenCoach, onSelectCategory }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const navItems = [
    { label: "ABOUT", category: "all" },
    { label: "STUDY", category: "Educators" },
    { label: "INNOVATE", category: "Design Thinking" },
    { label: "CONNECT", category: "Alumni" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 sm:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div 
          className="cursor-pointer select-none"
          onClick={() => onSelectCategory("Everything")}
          id="ds-logo"
        >
          <span className="font-display font-medium text-lg sm:text-xl tracking-tight text-black">Stanford </span>
          <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-black relative">
            d.school
            <span className="absolute -bottom-1 left-0 w-4 h-1 bg-ds-red"></span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.category !== "all") {
                  onSelectCategory(item.category);
                } else {
                  onSelectCategory("Everything");
                }
              }}
              className="font-display font-bold text-sm tracking-widest text-black hover:text-ds-blue transition-colors duration-200"
              id={`nav-${item.label.toLowerCase()}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Tools (Search + AI Coach Button) */}
        <div className="flex items-center space-x-4">
          <div className="relative flex items-center">
            {showSearchInput && (
              <input
                type="text"
                placeholder="Search tools, workshops..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="border border-gray-300 rounded-full px-4 py-1 text-sm font-sans focus:outline-none focus:border-ds-blue w-40 sm:w-60 mr-2 animate-fade-in"
                id="search-input"
              />
            )}
            <button
              onClick={() => setShowSearchInput(!showSearchInput)}
              className="text-black hover:text-ds-blue p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Search"
              id="search-btn"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={onOpenCoach}
            className="flex items-center gap-1.5 bg-black hover:bg-ds-blue text-white font-display font-bold text-xs tracking-wider px-3 py-2 rounded-full transition-all duration-300 shadow-sm hover:scale-[1.03]"
            id="coach-trigger-btn"
          >
            <Sparkles className="w-4 h-4 text-ds-lime animate-pulse" />
            <span>AI COACH</span>
          </button>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-black p-1.5 hover:bg-gray-100 rounded-full"
            id="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-100 flex flex-col space-y-4 animate-fade-in" id="mobile-nav-panel">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.category !== "all") {
                  onSelectCategory(item.category);
                } else {
                  onSelectCategory("Everything");
                }
                setMobileMenuOpen(false);
              }}
              className="font-display font-bold text-left text-sm tracking-widest text-black hover:text-ds-blue py-1.5"
              id={`mobile-nav-${item.label.toLowerCase()}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
