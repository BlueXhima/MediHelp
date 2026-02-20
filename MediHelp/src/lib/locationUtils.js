// Import showNotification from notificationUtils
import { showNotification } from "./notificationUtils";

// Enhanced redirectToNearbyHospitals function
export const redirectToNearbyHospitals = () => {
    if (!navigator.geolocation) {
        showNotification("Geolocation is not supported by your browser.", "error");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            console.log("User location fetched:", { latitude, longitude });
            const googleMapsUrl = `https://www.google.com/maps/search/hospitals/@${latitude},${longitude},15z`;
            showNotification("Redirecting to Google Maps to show nearby hospitals.", "info");
            window.open(googleMapsUrl, "_blank");
        },
        (error) => {
            let errorMessage = "An unknown error occurred while fetching your location.";
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = "Location permission denied. Please enable location permissions in your browser settings.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = "Location information is unavailable. Please check your device settings.";
                    break;
                case error.TIMEOUT:
                    errorMessage = "The request to get your location timed out. Please try again.";
                    break;
            }
            console.error("Geolocation error:", error);
            showNotification(errorMessage, "error");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Increased timeout for better accuracy
    );
};