import React, { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Prompt } from "../types";

interface PromptDisplayProps {
  setPrompt: (prompt: Prompt) => void;
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({ setPrompt }) => {
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

  return null; // This component does not render anything itself
};

export default PromptDisplay;
