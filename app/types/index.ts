export interface Restaurant {
    id: string;
    place_id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    price_level: string | null;
    website: string | null;
  }

  export interface RestaurantWithCount extends Restaurant {
    recommendation_count: number;
  }
  
  export interface Prompt {
    id: string;
    prompt_text: string;
  }
  
  export interface User {
    id: string;
    [key: string]: any;
  }

  interface TopRestaurant {
    id: string;
    name: string;
    recommendation_count: number;
  }
