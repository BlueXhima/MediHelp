import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mic, User, BookOpen, Phone, Calendar, FileText, MapPin, Settings } from 'lucide-react';
import Icon from './Icon';
import Button from './Button';
import { redirectToNearbyHospitals } from '../../../lib/locationUtils';
import GoogleMapEmbed from '../../../components/GoogleMapEmbed';
import { showNotification } from '../../../lib/notificationUtils';

const QuickActionsPanel = () => {
    const quickActions = [
        {
            id: 1,
            title: "Voice Assistant",
            description: "Ask health questions instantly",
            icon: <Mic size={24} color="white" />,
            color: "accent",
            path: "/voice-interaction-interface",
            gradient: "from-accent to-accent/80"
        },
        {
            id: 2,
            title: "Health Profile",
            description: "Update your health information",
            icon: <User size={24} color="white" />,
            color: "secondary",
            path: "/health-profile",
            gradient: "from-secondary to-secondary/80"
        },
        {
            id: 3,
            title: "Guidance Library",
            description: "Browse health resources",
            icon: <BookOpen size={24} color="white" />,
            color: "primary",
            path: "/guidance-library",
            gradient: "from-primary to-primary/80"
        },
        {
            id: 4,
            title: "Emergency Contact",
            description: "Quick access to help",
            icon: <Phone size={24} color="white" />,
            color: "destructive",
            path: "#emergency",
            gradient: "from-destructive to-destructive/80"
        }
    ];

    const [showEmergencyModal, setShowEmergencyModal] = useState(false);

    const handleEmergencyClick = () => {
        setShowEmergencyModal(true);
    };

    const closeEmergencyModal = () => {
        setShowEmergencyModal(false);
    };

    const [showMap, setShowMap] = React.useState(false);
    const [userLocation, setUserLocation] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);

    // Cache user location for session
    let cachedLocation = null;

    function getCachedLocation() {
        if (cachedLocation) {
            return Promise.resolve(cachedLocation);
        }

        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    cachedLocation = position.coords;
                    resolve(cachedLocation);
                },
                (error) => {
                    reject(error);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        });
    }

    const handleNearbyHospitalClick = () => {
        if (!navigator.geolocation) {
            console.error("Geolocation is not supported by your browser.");
            return;
        }

        // Add loading spinner during location fetch
        showLoadingSpinner("Fetching your location...");

        getCachedLocation()
            .then((coords) => {
                hideLoadingSpinner(); // Hide spinner after fetching location
                const { latitude, longitude } = coords;
                console.log("User location fetched:", { lat: latitude, lng: longitude });
                const mappingService = "OpenStreetMap"; // Change service as needed
                const mapUrl = getMappingServiceUrl(mappingService, latitude, longitude);
                // Modern UI notification instead of alert
                showNotification(`Redirecting to ${mappingService} to show nearby hospitals.`, "info");
                window.open(mapUrl, "_blank");
            })
            .catch((error) => {
                hideLoadingSpinner(); // Hide spinner on error
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
                // Modern UI notification for errors
                showNotification(errorMessage, "error");
            });
    };

    // Allow custom search parameters for hospitals
    function getCustomSearchUrl(latitude, longitude, searchRadius = 5, hospitalType = "general") {
        return `https://www.google.com/maps/search/${hospitalType}+hospitals/@${latitude},${longitude},${searchRadius}z`;
    }

    // Integrate alternative mapping services
    function getMappingServiceUrl(service, latitude, longitude) {
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
    }

    // Update showPrivacyNotice to display only once per session
    function showPrivacyNotice() {
        const hasSeenPrivacyNotice = sessionStorage.getItem("hasSeenPrivacyNotice");

        if (!hasSeenPrivacyNotice) {
            const privacyNotice = `We use your location to find nearby hospitals. Your location data is not stored or shared.`;
            showNotification(privacyNotice, "info");
            sessionStorage.setItem("hasSeenPrivacyNotice", "true");
        }
    }

    // Call privacy notice before fetching location
    showPrivacyNotice();

    // Debugging logs
    console.log("User location:", userLocation);
    console.log("Show map state:", showMap);

    if (!window.google) {
        console.error("Google Maps JavaScript API is not loaded. Check your API key and script tag in index.html.");
    } else {
        console.log("Google Maps JavaScript API loaded successfully.");
    }

    // Add CSS styles for modal
    const modalStyles = {
        overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
        },
        content: {
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            maxWidth: "400px",
            width: "90%",
            textAlign: "center",
        },
        closeButton: {
            marginTop: "10px",
            padding: "10px 20px",
            backgroundColor: "#f44336",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
        },
    };

    return (
        <div className="bg-card dark:bg-card border-t border-b border-border/50 dark:border-border/30 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-primary flex items-center">
                    <Icon name="Zap" size={24} color="var(--color-accent)" className="mr-3" />
                    Quick Actions
                </h3>
                <span className="text-sm text-muted-foreground">Get help fast</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                    action.path === "#emergency" ? (
                        <button
                            key={action.id}
                            onClick={handleEmergencyClick}
                            className={`group p-4 rounded-xl bg-red-500 hover:bg-red-600 text-white hover:shadow-medical-hover transition-all duration-200 medical-card cursor-pointer`}
                        >
                            <div className="flex flex-col items-center text-center space-y-3">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                    {action.icon}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm mb-1">{action.title}</h4>
                                    <p className="text-xs opacity-90">{action.description}</p>
                                </div>
                            </div>
                        </button>
                    ) : (
                        <Link
                            key={action.id}
                            to={action.path}
                            className={`group p-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white hover:shadow-medical-hover transition-all duration-200 medical-card`}
                        >
                            <div className="flex flex-col items-center text-center space-y-3">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                    {action.icon}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm mb-1">{action.title}</h4>
                                    <p className="text-xs opacity-90">{action.description}</p>
                                </div>
                            </div>
                        </Link>
                    )
                ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-2 justify-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs cursor-pointer bg-transparent border text-black px-4 py-2 rounded-sm hover:bg-blue-600 hover:text-white"
                        onClick={redirectToNearbyHospitals}
                    >
                        <MapPin size={14} className="mr-1" />
                        Nearby Hospital
                    </Button>

                    {showMap && userLocation && (
                        <div className="mt-4">
                            <GoogleMapEmbed
                                apiKey="YOUR_VALID_GOOGLE_MAPS_API_KEY"
                                center={userLocation}
                                zoom={15}
                            />
                        </div>
                    )}

                    <Button variant="ghost" size="sm" className="text-xs cursor-pointer bg-transparent border text-black px-4 py-2 rounded-sm hover:bg-blue-600 hover:text-white">
                        <FileText size={14} className="mr-1" />
                        Medical Records
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs cursor-pointer bg-transparent border text-black px-4 py-2 rounded-sm hover:bg-blue-600 hover:text-white">
                        <MapPin size={14} className="mr-1" />
                        Find Doctors
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs cursor-pointer bg-transparent border text-black px-4 py-2 rounded-sm hover:bg-blue-600 hover:text-white">
                        <Settings size={14} className="mr-1" />
                        Preferences
                    </Button>
                </div>
            </div>
            {showEmergencyModal && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
                        <button
                            onClick={closeEmergencyModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                        >
                            ✖
                        </button>
                        <h2 className="text-2xl font-bold mb-4 text-red-600">Emergency Contacts</h2>
                        <p className="text-gray-600 text-left mb-2">In case of an emergency, please contact the following services:</p>
                        <hr />
                        <ul className="text-left text-gray-700 mb-4 mt-4 list-disc list-inside">
                            <li><strong>Emergency services:</strong> 911</li>
                            <li><strong>Poison Control:</strong> 1-800-222-1222</li>
                            <li><strong>Mental Health Crisis:</strong> 988</li>
                            <li><strong>Fire Department:</strong> 1-800-555-0199</li>
                            <li><strong>Local Police:</strong> 1-800-555-0123</li>
                        </ul>
                        <p className="text-sm text-gray-500 mb-4">Stay calm and provide clear information about your location and the nature of the emergency.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuickActionsPanel;