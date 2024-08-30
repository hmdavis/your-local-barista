import React, { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { RestaurantWithCount, Prompt } from "../types";
import Map from "../components/Map";
import { MapPin } from "lucide-react";
import Badge from './Badge';

interface ResultsProps {
    prompt: Prompt;
}

const Results: React.FC<ResultsProps> = ({ prompt }) => {
    const [recommendations, setRecommendations] = useState<RestaurantWithCount[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantWithCount | null>(null);
    const lastRestaurantElementRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            const { data, error } = await supabase
                .from("top_restaurants_for_prompt")
                .select("*")
                .eq("prompt_id", prompt.id)
                .limit(25);

            if (error) {
                console.error("Error fetching recommendations:", error);
                setRecommendations([]);
            } else if (Array.isArray(data)) {
                setRecommendations(data as RestaurantWithCount[]);
            } else {
                console.warn("Unexpected data format:", data);
                setRecommendations([]);
            }
        };

        fetchRecommendations();
    }, [prompt]);

    const handleRestaurantClick = (restaurant: RestaurantWithCount) => {
        setSelectedRestaurant(restaurant);
    };

    return (
        <section className="mb-8 bg-black border border-gray-700 rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-4 text-white flex items-center">
                <MapPin className="mr-2 text-orange-500" size={24} />
                The Spots
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <Map restaurants={recommendations} selectedRestaurant={selectedRestaurant} onRestaurantSelect={setSelectedRestaurant}/>
                </div>
                <div className="h-[500px] overflow-y-auto">
                    <ul className="bg-black rounded-lg p-4">
                        {recommendations.map((restaurant, index) => (
                            <li
                                key={restaurant.id}
                                ref={index === recommendations.length - 1 ? lastRestaurantElementRef : null}
                                className="mb-3 flex items-center cursor-pointer hover:bg-gray-800 p-2 rounded"
                                onClick={() => handleRestaurantClick(restaurant)}
                            >
                                <MapPin className="mr-2 text-cyan-500" />
                                <span className="text-white flex-grow">{restaurant.name}</span>
                                <Badge count={restaurant.recommendation_count} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Results;
