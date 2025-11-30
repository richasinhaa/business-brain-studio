// Hook this to the OpenAI SDK when you're ready.

export async function generateText(prompt: string): Promise<string> {
  // For now just log the prompt and return placeholder text.
  console.log("DEBUG prompt to OpenAI:", prompt.slice(0, 200));
  return "This is a placeholder response. Connect OpenAI in src/lib/openai.ts.";
}
