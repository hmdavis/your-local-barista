import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { RestaurantWithCount, Prompt } from "../types";
import Map from "../components/Map";
import { MapPin } from "lucide-react";

interface ResultsProps {
    prompt: Prompt;
}

const Results: React.FC<ResultsProps> = ({ prompt }) => {
    const [recommendations, setRecommendations] = useState<RestaurantWithCount[]>([]);

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

    return (
        <section className="mb-8 bg-black border border-gray-700 rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-4 text-white">Our Spots</h3>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <Map restaurants={recommendations} />
                </div>
                <div>
                    <ul className="bg-black rounded-lg p-4">
                        {recommendations.map((restaurant) => (
                            <li key={restaurant.id} className="mb-3 flex items-center">
                                <MapPin className="mr-2 text-cyan-500" />
                                <span className="text-white">
                                    {restaurant.name}{" "}
                                    <span className="font-bold">({restaurant.recommendation_count})</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Results;
