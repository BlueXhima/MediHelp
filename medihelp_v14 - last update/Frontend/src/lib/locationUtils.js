import React from 'react';
import { showToast } from "../components/ToastMessage";

export const redirectToNearbyHospitals = (setLoading) => {
    if (!navigator.geolocation) {
        showToast("Geolocation is not supported by your browser.", "error");
        return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            // const GOOGLE_MAPS_API_KEY = 'YOUR_VALID_GOOGLE_MAPS_API_KEY';
            const googleMapsUrl = 'https://www.google.com/maps/search/hospitals/@' + latitude + ',' + longitude + ',15z';
            showToast("Redirecting to Google Maps...", "info");
            setTimeout(() => {
                setLoading(false);
                window.open(googleMapsUrl, "_blank");
            }, 1500);
        },
        (error) => {
            setLoading(false);
            let errorMessage = "";

            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = "Location permission denied. Please enable it in your settings.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = React.createElement('span', { className: "text-foreground" }, 
                        "Location unavailable. Check device settings.", 
                        "For more details, visit our ",
                        React.createElement('a', { 
                            href: '/privacy', 
                            // Tailwind classes para sa kulay, underline, at hover
                            className: "text-cyan-400 underline font-bold hover:text-cyan-300 transition-colors duration-200 ml-1"
                        }, "Privacy Policy"),
                        " or ",
                        React.createElement('a', { 
                            href: '/learn-how', 
                            className: "text-cyan-400 underline font-bold hover:text-cyan-300 transition-colors duration-200 ml-1"
                        }, "Learn How"),
                        "."
                    );
                    break;
                case error.TIMEOUT:
                    errorMessage = "The location request timed out.";
                    break;
                default:
                    errorMessage = "An unknown error occurred.";
            }

            showToast(errorMessage, "error");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
};

// Function to handle changing to Privacy Policy page
export const changeToPrivacyPolicyPage = (isSignedIn) => {
    const navigate = useNavigate(); // Initialize useNavigate

    if (isSignedIn) {
        console.log("User is signed in. Changing to Privacy Policy page.");
    } else {
        console.log("User is not signed in. Changing to Privacy Policy page.");
    }

    // Navigate to the Privacy Policy page
    navigate('/privacy');
};

export const getCachedLocation = () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                resolve({ latitude, longitude });
            },
            (error) => {
                reject(error);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    });
};

export const getMappingServiceUrl = (service, latitude, longitude) => {
    switch (service) {
        case "GoogleMaps":
            return `https://www.google.com/maps/search/hospitals/@${latitude},${longitude},15z`;
        case "OpenStreetMap":
            return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15`;
        case "BingMaps":
            return `https://www.bing.com/maps?q=hospitals&cp=${latitude}~${longitude}&lvl=15`;
        default:
            throw new Error("Unsupported mapping service");
    }
};