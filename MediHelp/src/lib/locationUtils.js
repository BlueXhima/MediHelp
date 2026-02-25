// Import showNotification from notificationUtils
import { showNotification } from "./notificationUtils";
import { useNavigate } from 'react-router-dom';

// Enhanced redirectToNearbyHospitals function
export const redirectToNearbyHospitals = (setLoading) => {
    if (!navigator.geolocation) {
        showNotification("Geolocation is not supported by your browser.", "error");
        return;
    }

    setLoading(true); // Start background loading state

    console.log("Attempting to fetch user location...");

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            console.log("User location fetched successfully:", { latitude, longitude });
            const GOOGLE_MAPS_API_KEY = 'YOUR_VALID_GOOGLE_MAPS_API_KEY';
            const googleMapsUrl = `https://www.google.com/maps/search/hospitals/@${latitude},${longitude},15z?key=${GOOGLE_MAPS_API_KEY}`;
            showNotification("Redirecting to Google Maps to show nearby hospitals.", "info");

            setTimeout(() => {
                setLoading(false); // Stop background loading state
                window.open(googleMapsUrl, "_blank"); // Open Google Maps in a new tab
            }, 1500); // Simulate loading state duration
        },
        (error) => {
            setLoading(false); // Stop background loading state
            let errorMessage = "An unknown error occurred while fetching your location.";
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = "Location permission denied. Please enable location permissions in your browser settings.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = `Location information is unavailable. Please check your device settings. <br /> For more details, visit our 
                    <a href='/privacy' onclick="event.preventDefault(); window.history.pushState({}, '', '/privacy'); location.reload();">Privacy Policy</a> or 
                    <a href='/learn-how' onclick="event.preventDefault(); window.history.pushState({}, '', '/learn-how'); location.reload();">Learn How</a>.`;
                    break;
                case error.TIMEOUT:
                    errorMessage = "The request to get your location timed out. Please try again.";
                    break;
            }
            console.error("Geolocation error:", error);
            showNotification(errorMessage, "error");
        },
        { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 } // Further increased timeout for better accuracy
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