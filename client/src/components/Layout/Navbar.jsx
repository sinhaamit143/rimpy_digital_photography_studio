import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { 
      name: 'Shop', 
      path: '/shop',
      subLinks: [
        { name: 'All Categories', path: '/shop/products' }
      ]
    },
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
            <li key={link.name} className={link.subLinks ? "relative group" : ""}>
              {link.subLinks ? (
                <>
                  <Link
                    to={link.path}
                    className={`nav-link flex items-center gap-1 ${location.pathname.startsWith(link.path) ? 'text-primary font-bold' : 'text-gray-300 hover:text-white'}`}
                  >
                    {link.name}
                    <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                  </Link>
                  <ul className="absolute top-full left-1/2 -translate-x-1/2 mt-6 bg-[#151515] border border-white/10 border-t-2 border-t-primary shadow-2xl w-56 py-2 rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 before:absolute before:-top-6 before:left-0 before:w-full before:h-6">
                    {link.subLinks.map(sub => (
                      <li key={sub.name}>
                        <Link to={sub.path} className="block px-6 py-3 text-[11px] uppercase tracking-widest font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-300 text-center">
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link
                  to={link.path}
                  className={`nav-link ${location.pathname === link.path ? 'text-primary font-bold' : 'text-gray-300 hover:text-white'}`}
                >
                  {link.name}
                </Link>
              )}
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
              className={`transform transition-all duration-700 delay-[${idx * 100}ms] ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              <Link onClick={() => setIsOpen(false)} to={link.path} className="text-4xl font-serif italic tracking-widest text-white hover:text-primary transition-colors inline-block">
                {link.name}
              </Link>
              {link.subLinks && (
                <ul className="mt-6 flex flex-col gap-6">
                  {link.subLinks.map(sub => (
                    <li key={sub.name}>
                      <Link onClick={() => setIsOpen(false)} to={sub.path} className="text-xl font-serif italic tracking-widest text-gray-400 hover:text-white transition-colors inline-block">
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
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
