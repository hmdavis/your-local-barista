'use client'

import React, { useState } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { supabase } from "../lib/supabaseClient";
import { Restaurant, User } from "../types";

const libraries: ("places")[] = ["places"];

interface AutocompleteFormProps {
    promptId: string;
}


const AutocompleteForm: React.FC<AutocompleteFormProps> = ({ promptId }) => {
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [inputValue, setInputValue] = useState<string>("");
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleLoad = (autocomplete: google.maps.places.Autocomplete) => {
        setAutocomplete(autocomplete);
    };

    const handlePlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            setSelectedPlace(place);
            console.log(place);
        }
    };

    const handleSubmit = async () => {
        if (selectedPlace && selectedPlace.place_id) {
            const { place_id, name, formatted_address, geometry, price_level, website } = selectedPlace;

            const latitude = geometry?.location?.lat();
            const longitude = geometry?.location?.lng();

            const { data: restaurantData, error: restaurantError } = await supabase
                .from("restaurants")
                .upsert({
                    place_id,
                    name,
                    address: formatted_address,
                    latitude,
                    longitude,
                    price_level,
                    website
                }, { onConflict: 'place_id' })
                .select() as { data: Restaurant[] | null, error: any };

            if (restaurantError) {
                console.error("Error upserting restaurant:", restaurantError);
            } else {
                console.log("Restaurant upserted successfully:", restaurantData)

                const restaurantId = restaurantData?.[0]?.id;

                // Get the current use
                const userData = null // eventually get this from supabase
                const user = userData as User | null;

                // Insert recommendation
                const { error: recommendationError } = await supabase
                    .from("recommendations")
                    .insert({
                        prompt_id: promptId,
                        restaurant_id: restaurantId,
                        submitted_by: user ? user.id : null,
                    });

                if (recommendationError) {
                    console.error("Error saving recommendation:", recommendationError);
                } else {
                    console.log("Recommendation saved successfully!");
                    setIsSubmitted(true);
                }
            }
        }
    };

    const autocompleteOptions = {
        types: ['bar', 'restaurant'],
        fields: ['place_id', 'name', 'formatted_address', 'geometry', 'price_level', 'icon', 'website', 'types']
    };

    const getPriceLevel = (level: number | undefined) => {
        if (level === undefined) return 'N/A';
        return '$'.repeat(level);
    };

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string} libraries={libraries}>
            <Autocomplete onLoad={handleLoad} onPlaceChanged={handlePlaceChanged} options={autocompleteOptions}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter a location"
                    style={{
                        width: "300px",
                        height: "40px",
                        padding: "10px",
                        backgroundColor: "black",
                        color: "white",
                        border: "1px solid white",
                        borderRadius: "4px",
                      }}
                    autoComplete="off"
                    data-form-type="other"
                />
            </Autocomplete>
            {selectedPlace && (
                <div>
                    <h3>Selected Place:</h3>
                    <p>{selectedPlace.place_id}</p>
                    <p>{selectedPlace.name}</p>
                    <p>{selectedPlace.formatted_address}</p>
                    <p>Latitude: {selectedPlace.geometry?.location?.lat()}</p>
                    <p>Longitude: {selectedPlace.geometry?.location?.lng()}</p>
                    <p>Price Level: {getPriceLevel(selectedPlace.price_level)}</p>
                    <p>Icon URL: {selectedPlace.icon}</p>
                    <p>Website: {selectedPlace.website}</p>
                    {!isSubmitted ? (
                        <button onClick={handleSubmit} style={{
                            backgroundColor: "black",
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            border: "1px solid white"
                        }}>
                            Submit
                        </button>
                    ) : (
                        <p>Recommendation submitted.</p>
                    )}
                </div>
            )}
        </LoadScript>
    );
};

export default AutocompleteForm;