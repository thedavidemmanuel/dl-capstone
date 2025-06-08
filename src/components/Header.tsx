"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarSide, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useLanguage, Language } from '@/contexts/LanguageContext';

const Header: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setLanguage(e.target.value as Language);

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const headerBg = scrolled
    ? 'bg-white/90 backdrop-blur-md shadow-md'
    : 'bg-white';

  return (
    <header className={`${headerBg} sticky top-0 z-50 border-b border-gray-200 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#2C8E5D] to-[#1f6a44] rounded-lg p-1.5 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
              <FontAwesomeIcon icon={faCarSide} className="w-6 h-6 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="font-inter font-bold text-xl text-black">DLV Burundi</h1>
              <p className="font-inter text-sm text-gray-600">Digital License Verification</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="font-inter font-medium text-sm text-black hover:text-[#2C8E5D]">
              Home
            </Link>
            <Link href="/about" className="font-inter font-medium text-sm text-black hover:text-[#2C8E5D]">
              About
            </Link>
            <Link href="/how-it-works" className="font-inter font-medium text-sm text-black hover:text-[#2C8E5D]">
              How it Works
            </Link>
            <Link href="/apply" className="font-inter font-medium text-sm text-black hover:text-[#2C8E5D]">
              Apply for License
            </Link>
            <Link href="/verify" className="font-inter font-medium text-sm text-black hover:text-[#2C8E5D]">
              Verify License
            </Link>
          </nav>

          {/* Login & Language & Mobile Toggle */}
          <div className="flex items-center space-x-3">
            {/* Language switcher */}
            <div className="relative flex items-center">
              <FontAwesomeIcon icon={faGlobe} className="text-[#2C8E5D] w-4 h-4 mr-1" />
              <select
                value={language}
                onChange={handleLanguageChange}
                aria-label="Select language"
                className="text-sm bg-transparent pr-6 pl-1 py-1 focus:outline-none cursor-pointer font-medium text-gray-800"
              >
                <option value="en">EN</option>
                <option value="fr">FR</option>
                <option value="rn">RN</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                <svg className="h-4 w-4 text-[#2C8E5D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <Link
              href="/login"
              className="bg-[#2C8E5D] hover:bg-[#245A47] text-white font-inter font-medium px-5 py-2 rounded-full shadow-sm hover:shadow transition-all"
            >
              Login
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-1 rounded-md text-gray-700 hover:text-[#2C8E5D] hover:bg-gray-100 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* ...hamburger & X icons... */}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden bg-white shadow-sm rounded-b-lg overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-64' : 'max-h-0'}`} id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" className="block px-3 py-2 text-sm font-medium text-black hover:text-[#2C8E5D] hover:bg-gray-50 rounded-md">
              Home
            </Link>
            <Link href="/about" className="block px-3 py-2 text-sm font-medium text-black hover:text-[#2C8E5D] hover:bg-gray-50 rounded-md">
              About
            </Link>
            <Link href="/how-it-works" className="block px-3 py-2 text-sm font-medium text-black hover:text-[#2C8E5D] hover:bg-gray-50 rounded-md">
              How it Works
            </Link>
            <Link href="/apply" className="block px-3 py-2 text-sm font-medium text-black hover:text-[#2C8E5D] hover:bg-gray-50 rounded-md">
              Apply for License
            </Link>
            <Link href="/verify" className="block px-3 py-2 text-sm font-medium text-black hover:text-[#2C8E5D] hover:bg-gray-50 rounded-md">
              Verify License
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;