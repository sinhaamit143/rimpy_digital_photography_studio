import React, { useState, useEffect } from 'react';
import { motion as m } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Home, Sparkles, Image as ImageIcon, ShoppingBag, Phone } from 'lucide-react';

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);

  const navItems = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Services', path: '/services', icon: Sparkles },
    { name: 'Shop', path: '/shop', icon: ShoppingBag },
    { name: 'Portfolio', path: '/portfolio', icon: ImageIcon },
    { name: 'Contact', path: '/contact', icon: Phone },
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const index = navItems.findIndex(item =>
      item.path === '/' ? currentPath === '/' : currentPath.startsWith(item.path)
    );
    if (index !== -1) setActiveIndex(index);
  }, [location]);

  return (
    <div className="fixed bottom-0 left-0 w-full z-[100] md:hidden bg-dark shadow-[0_-10px_40px_rgba(0,0,0,0.3)] border-t border-white/5 rounded-t-3xl h-[72px]">
      <ul className="flex relative h-full w-full">
        {/* Floating Indicator Bubble */}
        <m.div
          className="absolute top-[-24px] w-1/5 h-14 flex justify-center z-10 pointer-events-none"
          initial={false}
          animate={{ x: `${activeIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        >
          <div className="w-14 h-14 bg-primary rounded-full border-[5px] border-dark flex items-center justify-center shadow-xl shadow-primary/40" />
        </m.div>

        {navItems.map((item, i) => {
          const isActive = activeIndex === i;
          return (
            <li key={item.name} className="flex-1 h-full flex flex-col items-center justify-center relative z-20">
              <Link
                to={item.path}
                className="w-full h-full flex flex-col items-center justify-center bg-transparent outline-none pt-2 pb-1"
                aria-label={item.name}
              >
                <m.div
                  initial={false}
                  animate={{ y: isActive ? -32 : 0, color: isActive ? '#ffffff' : '#9ca3af' }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                >
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </m.div>
                <m.span
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
                  className="text-[9px] uppercase tracking-[0.2em] font-bold text-white absolute bottom-[6px]"
                >
                  {item.name}
                </m.span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MobileNav;
