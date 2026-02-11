import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        setTimeout(() => {
            if (hash) {
                const id = decodeURIComponent(hash.replace("#", ""));
                const el = document.getElementById(id);
                if (el) {
                    // Use native scrollIntoView and rely on CSS scroll-margin-top on targets
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                    return;
                }
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }, 0);
    }, [pathname, hash]);

    return null;
}