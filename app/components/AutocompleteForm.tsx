'use client'

import React, { useState, useEffect } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { supabase } from "../lib/supabaseClient";
import { Restaurant, User } from "../types";
import { Search } from "lucide-react";
import Auth from "./Auth";

interface AutocompleteFormProps {
    promptId: string;
}

const AutocompleteForm: React.FC<AutocompleteFormProps> = ({ promptId }) => {
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [inputValue, setInputValue] = useState<string>("");
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
    const [countdown, setCountdown] = useState<string>("");
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [existingRecommendation, setExistingRecommendation] = useState<Restaurant | null>(null);


    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (user && promptId) {
            checkExistingRecommendation();
        }
    }, [user, promptId]);

    const checkExistingRecommendation = async () => {
        if (!user) return;

        const { data, error } = await supabase
            .from("recommendations")
            .select("*, restaurants(*)")
            .eq("prompt_id", promptId)
            .eq("submitted_by", user.id)
            .single();

        if (error) {
            console.error("Error checking existing recommendation:", error);
        } else if (data) {
            setExistingRecommendation(data.restaurants as Restaurant);
            setIsSubmitted(true);
            startCountdown();
        }
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error("Error getting user location:", error);
                }
            );
        }
    }, []);

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
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }

        if (user && selectedPlace && selectedPlace.place_id) {
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
                    website,
                }, { onConflict: 'place_id' })
                .select() as { data: Restaurant[] | null, error: any };

            if (restaurantError) {
                console.error("Error upserting restaurant:", restaurantError);
            } else {
                console.log("Restaurant upserted successfully:", restaurantData)

                const restaurantId = restaurantData?.[0]?.id;

                // Insert recommendation
                const { error: recommendationError } = await supabase
                    .from("recommendations")
                    .insert({
                        prompt_id: promptId,
                        restaurant_id: restaurantId,
                        submitted_by: user.id, // Use the current user's ID
                    });

                if (recommendationError) {
                    console.error("Error saving recommendation:", recommendationError);
                } else {
                    console.log("Recommendation saved successfully!");
                    setIsSubmitted(true);
                    startCountdown();
                }
            }
        }
    };

    const startCountdown = () => {
        const updateCountdown = () => {
            const now = new Date();
            let target = new Date(now);
            target.setHours(9, 0, 0, 0);
            target.setDate(target.getDate() + (target.getHours() >= 9 ? 1 : 0));

            const diff = target.getTime() - now.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setCountdown(`${hours}h ${minutes}m ${seconds}s`);
        };

        updateCountdown();
        const intervalId = setInterval(updateCountdown, 1000);
        return () => clearInterval(intervalId);
    };

    const autocompleteOptions = {
        types: ['bar', 'restaurant', 'cafe', 'bakery', 'night_club'],
        fields: ['place_id', 'name', 'formatted_address', 'geometry', 'price_level', 'icon', 'website', 'types'],
        bounds: {
            north: 40.9176,
            south: 40.4774,
            east: -73.7004,
            west: -74.2591,
        },
        strictBounds: true,
        componentRestrictions: { country: 'us' }
    };

    const getPriceLevel = (level: number | undefined) => {
        if (level === undefined) return 'N/A';
        return '$'.repeat(level);
    };

    return (
        <>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="mb-4">
            {promptId != null && !isSubmitted && !existingRecommendation && (
                    <>
                        <div className="relative">
                            <Autocomplete
                                onLoad={handleLoad}
                                onPlaceChanged={handlePlaceChanged}
                                options={autocompleteOptions}
                            >
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Submit a recommendation to view results..."
                                    className="w-full p-3 pl-10 bg-orange-50 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 placeholder-gray-500"
                                    autoComplete="off"
                                    data-form-type="other"
                                />
                            </Autocomplete>
                            <Search className="absolute left-3 top-3 text-orange-400" />
                        </div>
                        {selectedPlace && (
                            <div className="mt-4 text-gray-500">
                                <p>{selectedPlace.name}</p>
                                <p>{selectedPlace.formatted_address}</p>
                                <p>Price Level: {getPriceLevel(selectedPlace.price_level)}</p>
                            </div>
                        )}
                        {selectedPlace && (
                            <button
                                type="submit"
                                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition duration-300 w-full font-semibold"                        >
                                Submit
                            </button>
                        )}
                    </>
                )}
                {(isSubmitted || existingRecommendation) && (
                    <div className="text-center">
                        <p className="text-3xl font-bold text-orange-500 mb-2">{selectedPlace?.name}</p>
                        <p className="text-lg text-gray-500">Come back for your next cup in</p>
                        <p className="text-2xl font-bold text-gray-500">{countdown}</p>
                    </div>
                )}
            </form>
            <Auth
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={() => {
                    setIsAuthModalOpen(false);
                    handleSubmit();
                }}
            />
        </>
    );
};

export default AutocompleteForm;
