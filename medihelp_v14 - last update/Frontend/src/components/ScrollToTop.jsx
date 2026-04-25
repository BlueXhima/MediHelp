import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Ito ang magbabalik sa scroll position sa pinakataas (0,0)
        window.scrollTo(0, 0);
    }, [pathname]); // Tatakbo ito tuwing magbabago ang 'pathname'

    return null;
};

export default ScrollToTop;