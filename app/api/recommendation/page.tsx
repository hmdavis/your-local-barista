"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { Restaurant } from "../../types";

interface TopRestaurant {
  name: string;
  recommendation_count: number;
}

const RecommendationPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get("restaurant_id");
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [topRestaurants, setTopRestaurants] = useState<TopRestaurant[]>([]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!restaurantId) return;

      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", restaurantId)
        .single();

      if (error) {
        console.error("Error fetching restaurant:", error);
      } else {
        setRestaurant(data);
      }
    };

    const fetchTopRestaurants = async () => {
      const { data, error } = await supabase
        .from("recommendations")
        .select("restaurant_id, restaurants(name), count(*) as recommendation_count")
        .group("restaurant_id, restaurants.name")
        .order("recommendation_count", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching top restaurants:", error);
      } else {
        setTopRestaurants(
          data.map((r: any) => ({
            name: r.restaurants.name,
            recommendation_count: parseInt(r.recommendation_count, 10),
          }))
        );
      }
    };

    fetchRestaurant();
    fetchTopRestaurants();
  }, [restaurantId]);

  return (
    <div style={{ padding: "20px" }}>
      {restaurant && (
        <div>
          <h1>Your Spot: {restaurant.name}</h1>
        </div>
      )}
      <h2>Top Answers:</h2>
      <ul>
        {topRestaurants.map((topRestaurant, index) => (
          <li key={index}>
            {topRestaurant.name} - {topRestaurant.recommendation_count} recommendations
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendationPage;
