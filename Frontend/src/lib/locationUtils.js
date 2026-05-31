import React from 'react';
import { showToast } from "../components/ToastMessage";

/*
    Handle navigation to the Nearby Hospital page with location verification.
*/
export const handleNearbyHospitalNavigation = (setLoading, navigate) => {
    // 1. Check browser support
    if (!navigator.geolocation) {
        showToast("Geolocation is not supported by your browser.", "error");
        return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
        (position) => {
            // Simulate short delay para sa "feel" ng search
            setTimeout(() => {
                setLoading(false);
                // I-navigate na sa full page route
                navigate('/dashboard/nearby-hospital');
            }, 1200);
        },
        (error) => {            
            // Error logic - Lagyan ng delay para mawala muna ang loading overlay
            setTimeout(() => {
                setLoading(false);

                // Custom UI elements para sa toast message
                const locationErrorBody = React.createElement('span', { className: "text-foreground" }, 
                    "Location unavailable. Please check your device settings.", 
                    " For more details, visit our ",
                    React.createElement('a', { 
                        href: '/privacy', 
                        className: "text-foreground underline font-semibold hover:text-primary"
                    }, "Privacy Policy"),
                    " or ",
                    React.createElement('a', { 
                        href: '/learn-how', 
                        className: "text-foreground underline font-semibold hover:text-primary ml-1"
                    }, "Learn How"),
                    "."
                );

                let errorMessage = "";
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Please enable location access in your browser settings.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = locationErrorBody;
                        break;
                    case error.TIMEOUT:
                        errorMessage = "Request timed out. Signal is weak, please try again.";
                        break;
                    default:
                        errorMessage = "An unknown error occurred while fetching location.";
                }

                showToast(errorMessage, "error");
            }, 1000); // 1s delay para siguradong tapos na ang initial state toggle
        },
        // Geolocation Options
        { 
            enableHighAccuracy: true, 
            timeout: 10000, // Binabaan sa 10s para hindi masyadong matagal maghintay ang user
            maximumAge: 0 // Gawin nating 0 para hindi siya kumuha ng lumang error state
        } 
    );
};

/**
 * Helper to get the current/cached coordinates as a Promise.
 */
export const getCachedLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation not supported"));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                resolve({ latitude, longitude });
            },
            (error) => {
                reject(error);
            },
            { 
                enableHighAccuracy: true, 
                timeout: 15000, 
                maximumAge: 300000 // 5 minutes cache para sa component initialization
            } 
        );
    });
};