import React, { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Prompt } from "../types";
import styled from "styled-components";
import { Coffee, Search } from "lucide-react";
import AutocompleteForm from "./AutocompleteForm";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0 20px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const PromptText = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  max-width: 800px;
  color: #333;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

interface PromptDisplayProps {
  prompt: Prompt | null;
  setPrompt: (prompt: Prompt) => void;
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompt, setPrompt }) => {
  useEffect(() => {
    const fetchPrompt = async () => {
      const { data, error } = await supabase
        .from("prompts")
        .select("id, prompt_text")
        .order("prompt_date", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching prompt:", error);
      } else if (data) {
        setPrompt(data);  // Pass the fetched prompt to the parent component
      }
    };

    fetchPrompt();
  }, [setPrompt]);

  return (
    <>
      {prompt && (
        <section className="mb-8 bg-black border border-gray-700 rounded-lg shadow-lg p-6">
          <div className="text-sm text-gray-400 mb-4 flex items-center">
            <Coffee className="mr-2 text-pink-500 h-4 w-4" />
            {new Date().toLocaleDateString()} - Today&apos;s Cup
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center text-white">
            {prompt.prompt_text}
          </h2>
          <AutocompleteForm promptId={prompt.id} />
        </section>
      )}
    </>
  );
};

export default PromptDisplay;
