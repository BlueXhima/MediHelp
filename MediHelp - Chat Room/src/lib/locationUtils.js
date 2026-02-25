// Utility function to handle location permissions and redirect to Google Maps
export const redirectToNearbyHospitals = () => {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            const googleMapsUrl = `https://www.google.com/maps/search/hospitals/@${latitude},${longitude},15z`;
            window.open(googleMapsUrl, "_blank");
        },
        (error) => {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    alert("Please enable location permissions to find nearby hospitals.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    alert("The request to get your location timed out.");
                    break;
                default:
                    alert("An unknown error occurred while fetching your location.");
            }
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 } // Ensure high accuracy for location
    );
};