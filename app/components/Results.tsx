import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { RestaurantWithCount, Prompt, User } from "../types";
import Map from "../components/Map";
import { MapPin } from "lucide-react";
import Badge from './Badge';
import Auth from "./Auth";
import { Button } from '@mui/material';

interface ResultsProps {
    prompt: Prompt;
}

const Results: React.FC<ResultsProps> = ({ prompt }) => {
    const [recommendations, setRecommendations] = useState<RestaurantWithCount[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantWithCount | null>(null);
    const lastRestaurantElementRef = useRef<HTMLLIElement>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [hasUserRecommendation, setHasUserRecommendation] = useState(false);

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          setUser(session?.user ?? null);
        });
    
        return () => {
          authListener.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (user) {
            checkUserRecommendation();
        }
    }, [user, prompt.id]);

    const checkUserRecommendation = async () => {
        if (!user) {
            return;
        } 

        console.log(user.id);

        const { data, error } = await supabase
            .from("recommendations")
            .select("id")
            .eq("prompt_id", prompt.id)
            .eq("submitted_by", user.id)
            .single();

        if (error) {
            console.error("Error checking user recommendation:", error);
        } else if (data) {
            setHasUserRecommendation(true);
            fetchRecommendations();
        } else {
            setHasUserRecommendation(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchRecommendations();
        }
    }, [user, prompt.id]);

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

    const handleRestaurantClick = (restaurant: RestaurantWithCount) => {
        setSelectedRestaurant(restaurant);
    };

    if (!user) {
        return (
            <div className="flex flex-col justify-center items-center h-full">
                <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-blue-500 text-white hover:bg-blue-700 px-4 py-2 rounded-full transition duration-300 flex items-center font-semibold mb-4"
                >
                    Sign In
                </button>
                <Auth
                    isOpen={isAuthModalOpen}
                    onClose={() => setIsAuthModalOpen(false)}
                    onSuccess={() => {
                        setIsAuthModalOpen(false);
                        checkUserRecommendation();
                    }}
                />
            </div>
        );
    }

    if (!hasUserRecommendation) {
        return null; // Don't render anything if the user hasn't made a recommendation
    }

    return (
        <section className="mb-8 bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-500">
            <h3 className="text-2xl font-bold mb-4 text-green-700 flex items-center">
                <MapPin className="mr-2 text-yellow-500" size={24} />
                The Spots
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <Map restaurants={recommendations} selectedRestaurant={selectedRestaurant} onRestaurantSelect={setSelectedRestaurant} />
                </div>
                <div className="h-[500px] overflow-y-auto">
                    <ul className="bg-green-50 rounded-lg p-4">
                        {recommendations.map((restaurant, index) => (
                            <li
                                key={restaurant.id}
                                ref={index === recommendations.length - 1 ? lastRestaurantElementRef : null}
                                className="mb-3 flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded"
                                onClick={() => handleRestaurantClick(restaurant)}
                            >
                                <MapPin className="mr-2 text-cyan-500" />
                                <span className="flex-grow text-gray-800">{restaurant.name}</span>
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
