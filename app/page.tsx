'use client';

import React, { useState } from "react";
import PromptDisplay from "../app/components/PromptDisplay";
import Results from "./components/Results";
import { LoadScript } from "@react-google-maps/api";

import { Prompt } from "../app/types";

const Home: React.FC = () => {
  const [prompt, setPrompt] = useState<Prompt | null>(null);

  const libraries: ("places")[] = ["places"];


  // TODO: see if logged in user already has answered prompt. if so, show them the results screen. 
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string} libraries={libraries}>

      <div style={{ padding: "20px" }}>
        <h1 style={{ fontWeight: "bold", fontSize: "24px" }}>
          Help your local barista find places to eat.
        </h1>
        <PromptDisplay prompt={prompt} setPrompt={setPrompt} />
        {prompt ? (
          <>
            <Results prompt={prompt} />
          </>
        ) : (
          <p>Loading prompt...</p> // Display a loading message until the prompt is fetched
        )}
      </div>
    </LoadScript>

  );
};

export default Home;