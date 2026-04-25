import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const NavigationTracker = () => {
    const location = useLocation();
    // Gagamit tayo ng useRef para itago ang huling dinaanang page
    const lastPathRef = useRef(location.pathname);

    useEffect(() => {
        // Tuwing magbabago ang location.pathname:
        // 1. I-check kung ang huling page ay HINDI help-support
        if (lastPathRef.current !== location.pathname && 
            lastPathRef.current !== '/dashboard/help-support') {
            
            // 2. I-save yung huling page bago tayo lumipat
            sessionStorage.setItem('prevPath', lastPathRef.current);
        }

        // 3. I-update ang reference para sa susunod na lipat
        lastPathRef.current = location.pathname;
    }, [location.pathname]);

    return null;
};

export default NavigationTracker;