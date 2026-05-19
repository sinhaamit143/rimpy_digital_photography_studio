import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Shop', path: '/shop' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <nav className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-500 ${isScrolled ? 'bg-dark/95 backdrop-blur-md h-20 border-b border-white/5' : 'bg-dark/90 h-24 md:h-28'}`}>
      <div className="container h-full flex justify-between items-center">
        <Link to="/home" className="group" onClick={() => setIsOpen(false)}>
          <img
            src="/inverselogo.png"
            alt="Rimpy Digital Logo"
            className="h-12 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            width="240"
            height="96"
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'text-primary font-bold' : 'text-gray-300 hover:text-white'}`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-white z-[1100] relative p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close Menu" : "Open Menu"}
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed top-0 left-0 w-full h-[100dvh] bg-dark z-[1000] flex flex-col items-center justify-center transition-all duration-500 lg:hidden ${isOpen ? 'translate-y-0' : '-translate-y-full opacity-0 invisible'}`}>
        <div className="absolute top-0 left-0 w-full h-28 px-8 flex items-center justify-between border-b border-white/5">
          <Link to="/home" onClick={() => setIsOpen(false)}>
            <img src="/inverselogo.png" alt="Logo" className="h-16 w-auto object-contain" width="160" height="64" />
          </Link>
          <div className="w-10"></div> {/* Spacer to balance the logo */}
        </div>

        <ul className="text-center space-y-10">
          {navLinks.map((link, idx) => (
            <li
              key={link.name}
              onClick={() => setIsOpen(false)}
              className={`transform transition-all duration-700 delay-[${idx * 100}ms] ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              <Link to={link.path} className="text-4xl font-serif italic tracking-widest text-white hover:text-primary transition-colors inline-block">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="absolute bottom-12 text-center w-full px-8">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold mb-6">Rimpy Gifts Studio</p>
          <div className="flex justify-center gap-8 text-white/40">
            <div className="w-10 h-[1px] bg-surface/10"></div>
            <div className="w-1 h-1 rounded-full bg-primary"></div>
            <div className="w-10 h-[1px] bg-surface/10"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
