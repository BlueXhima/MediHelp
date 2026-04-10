import { Navigate, Outlet } from 'react-router-dom';

// Check kung admin, or user yung account na ilologin 
const ProtectedRoute = ({ allowedRoles }) => {
    const userRole = localStorage.getItem("userRole")?.toLowerCase(); // Normalize userRole to lowercase

    console.log("ProtectedRoute: Retrieved userRole:", userRole);
    console.log("ProtectedRoute: Allowed roles:", allowedRoles);

    if (!userRole) {
        console.warn("ProtectedRoute: No userRole found, redirecting to /login");
        return <Navigate to="/login" replace />; // Redirect to login if no role is found
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        console.warn(`ProtectedRoute: User role '${userRole}' not allowed, redirecting to /login`);
        return <Navigate to="/login" replace />;
    }

    console.log("ProtectedRoute: Access granted for userRole:", userRole);
    return <Outlet />;
};

export default ProtectedRoute;