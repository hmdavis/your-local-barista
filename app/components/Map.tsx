import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { RestaurantWithCount } from "../types"; // Import your type

interface MapProps {
    restaurants: RestaurantWithCount[];
}

const Map: React.FC<MapProps> = ({ restaurants }) => {
    const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantWithCount | null>(null);

    const mapContainerStyle = {
        width: "100%",
        height: "500px",
    };

    const getMarkerColor = (recommendationCount: number) => {
        if (recommendationCount <= 1) return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
        if (recommendationCount <= 5) return "http://maps.google.com/mapfiles/ms/icons/orange-dot.png";
        return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
      };

    const center = {
        lat: restaurants[0]?.latitude || 0,
        lng: restaurants[0]?.longitude || 0,
    };

    // Calculate the max count to normalize marker sizes
    const maxCount = Math.max(...restaurants.map(r => r.recommendation_count));

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={12}
            center={center}
            options={{ gestureHandling: "cooperative" }}
        >
            {restaurants.map((restaurant) => {
                const markerSize = (restaurant.recommendation_count / maxCount) * 40 + 10; // Size between 10 and 50
                const markerColor = getMarkerColor(restaurant.recommendation_count);

                return (
                    <Marker
                        key={restaurant.id}
                        position={{ lat: restaurant.latitude, lng: restaurant.longitude }}
                        icon={{
                            url: markerColor,
                            // scaledSize: new window.google.maps.Size(markerSize, markerSize),
                        }}
                        title={restaurant.name}
                        onClick={() => setSelectedRestaurant(restaurant)} // Set the selected restaurant on click
                    />
                );
            })}

            {selectedRestaurant && (
                <InfoWindow
                    position={{
                        lat: selectedRestaurant.latitude,
                        lng: selectedRestaurant.longitude,
                    }}
                    onCloseClick={() => setSelectedRestaurant(null)}
                >
                    <div>
                        <h2>{selectedRestaurant.name}</h2>
                        <p>{selectedRestaurant.address}</p>
                        <p>Recommendations: {selectedRestaurant.recommendation_count}</p>
                        {selectedRestaurant.website && (
                            <p>
                                <a href={selectedRestaurant.website} target="_blank" rel="noopener noreferrer">
                                    Visit Website
                                </a>
                            </p>
                        )}
                        <p>
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedRestaurant.latitude},${selectedRestaurant.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Get Directions
                            </a>
                        </p>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
};

export default Map;
