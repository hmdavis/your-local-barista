import React, { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Prompt } from "../types";
import styled from "styled-components";
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
    <Container>
      {prompt && (
        <ContentWrapper>
        <PromptText>{prompt.prompt_text}</PromptText>
        <AutocompleteForm promptId={prompt.id} />
      </ContentWrapper>
      )}
    </Container>
  );
};

export default PromptDisplay;
