import React, { useEffect, useRef } from 'react';

const GoogleMapEmbed = ({ center, zoom, apiKey }) => {
    const mapRef = useRef(null);

    useEffect(() => {
        if (!window.google) {
            console.error("Google Maps JavaScript API is not loaded.");
            return;
        }

        const map = new window.google.maps.Map(mapRef.current, {
            center,
            zoom,
        });

        // Add marker for user's location
        new window.google.maps.Marker({
            position: center,
            map,
            title: "Your Location",
            icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            },
        });

        const service = new window.google.maps.places.PlacesService(map);
        const request = {
            location: center,
            radius: '5000', // 5km radius
            type: ['Hospital'],
        };

        service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                results.forEach((place) => {
                    new window.google.maps.Marker({
                        position: place.geometry.location,
                        map,
                        title: place.name,
                        icon: {
                            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                        },
                    });
                });
            } else {
                console.error("PlacesService failed: ", status);
            }
        });
    }, [center, zoom]);

    return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
};

export default GoogleMapEmbed;