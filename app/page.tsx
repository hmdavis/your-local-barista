'use client';

import React, { useState } from "react";
import AutocompleteForm from "../app/components/AutocompleteForm";
import PromptDisplay from "../app/components/PromptDisplay";
import { Prompt } from "../app/types";

const Home: React.FC = () => {
  const [prompt, setPrompt] = useState<Prompt | null>(null);

  // TODO: see if logged in user already has answered prompt. if so, show them the results screen. 
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontWeight: "bold", fontSize: "24px" }}>
        Help your local barista find places to eat.
      </h1>
      <PromptDisplay setPrompt={setPrompt} />
      {prompt ? (
        <>
          <p style={{ fontSize: "18px", margin: "20px 0" }}>
            What is {prompt.prompt_text}?
          </p>
          <AutocompleteForm promptId={prompt.id} />
        </>
      ) : (
        <p>Loading prompt...</p> // Display a loading message until the prompt is fetched
      )}
    </div>
  );
};

export default Home;