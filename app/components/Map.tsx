import React, { useState } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { RestaurantWithCount } from "../types"; // Import your type
import Badge from './Badge';

interface MapProps {
    restaurants: RestaurantWithCount[];
    selectedRestaurant: RestaurantWithCount | null;
    onRestaurantSelect: (restaurant: RestaurantWithCount | null) => void;
}

const Map: React.FC<MapProps> = ({ restaurants, selectedRestaurant, onRestaurantSelect }) => {
    // const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantWithCount | null>(null);

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
                        onClick={() => onRestaurantSelect(restaurant)} // Set the selected restaurant on click
                    />
                );
            })}

            {selectedRestaurant && (
                <InfoWindow
                    position={{
                        lat: selectedRestaurant.latitude,
                        lng: selectedRestaurant.longitude,
                    }}
                    onCloseClick={() => onRestaurantSelect(null)}
                >
                    <div className="text-black">
                        <div className="flex flex-col items-start mb-2">
                            <Badge count={selectedRestaurant.recommendation_count} />
                            <h2 className="font-bold text-lg mt-1">{selectedRestaurant.name}</h2>
                        </div>
                        <p className="text-sm mb-2">{selectedRestaurant.address}</p>
                        <div className="flex space-x-2">
                            {selectedRestaurant.website && (
                                <a
                                    href={selectedRestaurant.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                                >
                                    Visit Website
                                </a>
                            )}
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedRestaurant.latitude},${selectedRestaurant.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors"
                            >
                                Get Directions
                            </a>
                        </div>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
};

export default Map;
