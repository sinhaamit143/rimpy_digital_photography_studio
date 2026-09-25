import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType(); // 'PUSH' | 'REPLACE' | 'POP'

  useEffect(() => {
    // POP = browser back/forward — let the destination page handle scroll restoration
    if (navigationType === "POP") return;
    window.scrollTo(0, 0);
  }, [pathname, navigationType]);

  return null;
};

export default ScrollToTop;
