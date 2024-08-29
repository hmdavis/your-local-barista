import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Restaurant, RestaurantWithCount, Prompt } from "../types";
import Map  from "../components/Map"

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
        <div style={{ padding: "20px" }}>
            <h1 style={{ fontWeight: "bold", fontSize: "24px" }}>
                What is {prompt.prompt_text}?
            </h1>
            <p style={{ fontSize: "14px", fontStyle: "italic", color: "#666", margin: "0" }}>
                Next cup tomorrow at 9am.
            </p>
            <h2 style={{ fontWeight: "bold", fontSize: "20px" }}>
                Top Recommended Places
            </h2>
            <ul>
                {recommendations.map((restaurant) => (
                    <li key={restaurant.id}>
                        <h2>
                            {restaurant.name}{" "}
                            <span style={{ fontWeight: "bold" }}>({restaurant.recommendation_count})</span>
                        </h2>
                    </li>
                ))}
            </ul>
            <Map restaurants={recommendations} />
        </div>
    );
};

export default Results;
