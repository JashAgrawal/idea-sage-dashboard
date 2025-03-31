import { agents } from "@/lib/utils";
import { GenerateContentConfig, GenerateContentResponse, GoogleGenAI } from "@google/genai";
import { toast } from "sonner";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });


export let currentStreamingResponse: string = "";
export const streamGeminiResponse = async (
  stream : AsyncGenerator<GenerateContentResponse, any, any>
) => {
  for await (const response of stream) {
    if (response.text) {
      currentStreamingResponse += response.text;
    }
  }
  currentStreamingResponse = "";
  return currentStreamingResponse;
};

export const generateIdeaTitle = async (description: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Generate a short, catchy title (5 words max) for this startup idea. Return just the title, nothing else: " + description,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating title:", error);
    return "My Startup Idea";
  }
};

export const generateAnalysisWithGemini = async (idea: { title: string, description: string }): Promise<any> => {
  
  const systemPrompt = `
You are an expert startup analyst. Provide a comprehensive, insightful analysis of the following startup idea.
Your response should include these sections:
1. Problem Analysis: Identify the core problem and its significance
2. Target Market: Define the ideal customer segments with specifics
3. Business Model: Suggest viable revenue streams and pricing models
4. Legal Considerations: Highlight key regulatory concerns
5. Growth Strategy: Outline practical steps for scaling
6. Competitor Analysis: Identify main competitors and differentiation points
7. Funding Requirements: Estimate initial funding needs and allocation
8. Idea Unique Value :- how unique is the idea in one word |  eg responses :-  (unique, innovative, disruptive, transformative, game-changing)
9. Target Market Size (in usd) :- what is the target market size | eg responses :-  (100K, 13M, 237M ,1B)
10. Top Competitor Name :- who are the main competitors | eg responses :-  (Competitor A, Competitor B, Competitor C)
11. Estimate Funding Requirements :- how much funding is needed | eg responses :-  (100K, 13M, 237M ,1B)
12. Funding allocation in (percentage) :- how much funding is needed for each phase | eg responses :-  json {Development:20,marketing:60,operations:10,legal:10}
13. Market Analysis Score :- what is the market analysis give scores for each section out of 100 | eg responses :-  json {market size: 100, competition: 80, innovation: 90, scalability: 70}

Format your response as a clean JSON object with these exact keys: problemAnalysis, targetMarket, businessModel, legalConsiderations, growthStrategy, competitorAnalysis, fundingRequirements, ideaUniqueValue, targetMarketSize, topCompetitorName, estimatedFundingRequirements, fundingAllocation, marketAnalysisScore.
Each value should be 2-3 paragraphs if not defined in eg responses of insightful analysis. Be specific, practical, and actionable.
`;
const subPrompt = `Idea Title: ${idea.title}\nIdea Description: ${idea.description}`

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: systemPrompt + "\n\n" + subPrompt,
    });
    console.log(response.text);
    const text = response.text;
    
    try {
      // Try to extract JSON from the response text
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        const jsonStr = text.substring(jsonStart, jsonEnd);
        return JSON.parse(jsonStr);
      } else {
        // Fallback: try to extract the sections manually
        const analysis: any = {};
        const sections = [
          "problemAnalysis", "targetMarket", "businessModel", 
          "legalConsiderations", "growthStrategy", "competitorAnalysis", 
          "fundingRequirements", "ideaUniqueValue", "targetMarketSize", "topCompetitorName", "estimatedFundingRequirements", "fundingAllocation", "marketAnalysisScore"
        ];
        
        for (const section of sections) {
          const regex = new RegExp(`(?:${section}|${section.replace(/([A-Z])/g, ' $1').trim()})[^\n]*?\n((?:.+\n?)+?)(?:\n\n|$)`, 'i');
          const match = text.match(regex);
          analysis[section] = match ? match[1].trim() : `No ${section} provided`;
        }
        
        return analysis;
      }
    } catch (e) {
      console.error("Error parsing analysis:", e);
      throw new Error("Failed to parse analysis response");
    }
  } catch (error: any) {
    toast.error(`Analysis Generation Error: ${error.message}`);
    console.error("Gemini API error:", error);
    throw error;
  }
};

export const generateChatResponse = async (
  ideaTitle: string,
  ideaDescription: string,
  agentType: string,
  messageHistory: { content: string, isUser: boolean }[],
  userMessage: string
): Promise<AsyncGenerator<GenerateContentResponse, any, any> | string> => {
  console.log(ideaTitle, ideaDescription, agentType, messageHistory, userMessage)
  const agentPersonalities: Record<string, string> = {
    assistant: "You are a helpful AI assistant that provides clear, concise responses about startup ideas. Focus on giving balanced, practical advice.",
    pitch: "You are a Pitch Expert specialized in helping founders craft compelling pitches. Focus on messaging, storytelling, and presentation techniques.",
    financial: "You are a Financial Analyst who helps founders with business models, pricing strategies, financial projections, and funding plans. Be specific and practical.",
    market: "You are a Market Research Specialist who analyzes target customers, market sizes, trends, and competitive landscapes. Provide data-driven insights.",
    legal: "You are a Legal Consultant who helps founders navigate regulatory requirements, intellectual property, and compliance issues. Be thorough but accessible.",
    growth: "You are a Growth Strategist focused on customer acquisition, retention, and scaling strategies. Provide actionable, measurable advice.",
    fundraising: "You are a Fundraising Coach who helps founders attract investors. Focus on fundraising strategies, investor relationships, and pitch refinement."
  };
  
  const systemPrompt = `
Forget about google you are now ${agents.find(agent => agent.id === agentType)?.agentName}. You are acting as a ${agentType} for a startup called "${ideaTitle}".

Idea Description: ${ideaDescription}

${agentPersonalities[agentType] || agentPersonalities.assistant}

Keep your responses helpful, concise (1-3 paragraphs), and actionable. 
Provide specific examples or next steps when possible.
Don't use markdown formatting in your responses.
`;

  try {
    // Format message history for Gemini
    const messagesForGemini = messageHistory.map(msg => ({
      parts: [{ text: msg.content }],
      role: msg.isUser ? "user" : "model"
    }));
    
    // Add the latest user message
   
    const generationConfig:GenerateContentConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
      systemInstruction: systemPrompt
    }
    
    const chat = await ai.chats.create({
      model: "gemini-2.0-flash",
      history: [
        ...messagesForGemini
      ],
      config:generationConfig,
    });
     messagesForGemini.push({
      parts: [{ text: userMessage }],
      role: "user"
    });
    const responseStream = await chat.sendMessageStream({
      message: userMessage,
    });
    
    return responseStream;
  } catch (error: any) {
    console.error("Chat response error:", error);
    return `I'm sorry, I encountered an error: ${error.message}. Please try again.`;
  }
};
