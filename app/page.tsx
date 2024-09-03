'use client';

import React, { useState, useEffect } from "react";
import PromptDisplay from "../app/components/PromptDisplay";
import Results from "./components/Results";
import { LoadScript } from "@react-google-maps/api";
import { User } from "./types";
import { supabase } from "./lib/supabaseClient";

import { Prompt } from "../app/types";

const Home: React.FC = () => {
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const libraries: ("places")[] = ["places"];

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // TODO: see if logged in user already has answered prompt. if so, show them the results screen. 
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string} libraries={libraries}>
        <PromptDisplay prompt={prompt} setPrompt={setPrompt} />
        {prompt ? (
          <>
            <Results prompt={prompt} />
          </>
        ) : (
          <p>Loading prompt...</p> // Display a loading message until the prompt is fetched
        )}
    </LoadScript>

  );
};

export default Home;