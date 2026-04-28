import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import BackgroundLoadingState from '../components/BackgroundLoadingState';

// Check kung admin, or user yung account na ilologin 
const ProtectedRoute = ({ allowedRoles }) => {
    const [isVerified, setIsVerified] = useState(null); // null = loading, true = authenticated, false = failed
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const verifySession = async () => {
            try {
                // I-verify ang HttpOnly Cookie sa backend
                const response = await axios.get("http://localhost:5000/api/verify-session", {
                    withCredentials: true
                });

                if (response.data.isAuthenticated) {
                    setIsVerified(true);
                    // Kunin ang role base sa Role ID (1=Admin, 2=User)
                    const role = response.data.user.Role === 1 ? 'admin' : 'user';
                    setUserRole(role);
                    
                    // Sync localStorage para sa UI display purposes lang
                    localStorage.setItem("userRole", role);
                } else {
                    setIsVerified(false);
                }
            } catch (err) {
                console.error("Session verification failed:", err);
                setIsVerified(false);
            }
        };

        verifySession();
    }, []);

    // 1. Habang nag-che-check pa sa server, ipakita ang loading state
    if (isVerified === null) {
        return <BackgroundLoadingState />; 
    }

    // 2. Kapag hindi authenticated, balik sa login
    if (isVerified === false) {
        console.warn("ProtectedRoute: Session invalid, redirecting to /login");
        localStorage.clear(); // Linisin ang local data
        return <Navigate to="/login" replace />;
    }

    // 3. Kapag authenticated pero maling ROLE (e.g. User pilit pumapasok sa Admin)
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        console.warn(`ProtectedRoute: Role '${userRole}' is not authorized for this route.`);
        return <Navigate to="/login" replace />;
    }

    // 4. Kapag OK lahat, tuloy sa page
    console.log("ProtectedRoute: Access granted for", userRole);
    return <Outlet />;
};

export default ProtectedRoute;