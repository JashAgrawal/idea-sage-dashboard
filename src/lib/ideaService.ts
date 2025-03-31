
import { toast } from "sonner";

// Types
export interface Idea {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface Analysis {
  id: string;
  ideaId: string;
  problemAnalysis: string;
  targetMarket: string;
  businessModel: string;
  legalConsiderations: string;
  growthStrategy: string;
  competitorAnalysis: string;
  fundingRequirements: string;
  ideaUniqueValue: string;
  targetMarketSize: string;
  topCompetitorName: string;
  estimatedFundingRequirements: string;
  fundingAllocation: string;
  marketAnalysisScore: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  ideaId: string;
  agentId: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

// LocalStorage Keys
const STORAGE_KEYS = {
  IDEAS: "ideasage-ideas",
  ANALYSES: "ideasage-analyses",
  CHAT_HISTORY: "ideasage-chats"
};

// Helper function to get data from localStorage
function getFromStorage<T>(key: string, defaultValue: T): T {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
}

// Helper function to save data to localStorage
function saveToStorage(key: string, data: any): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Idea functions
export function getAllIdeas(): Idea[] {
  return getFromStorage<Idea[]>(STORAGE_KEYS.IDEAS, []);
}

export function getIdea(id: string): Idea | undefined {
  const ideas = getAllIdeas();
  return ideas.find(idea => idea.id === id);
}

export async function saveIdea(idea: Idea): Promise<string> {
  const ideas = getAllIdeas();
  ideas.push(idea);
  saveToStorage(STORAGE_KEYS.IDEAS, ideas);
  return idea.id;
}

export function deleteIdea(id: string): void {
  const ideas = getAllIdeas().filter(idea => idea.id !== id);
  saveToStorage(STORAGE_KEYS.IDEAS, ideas);
  
  // Also delete associated analysis and chat history
  const analyses = getAllAnalyses().filter(analysis => analysis.ideaId !== id);
  saveToStorage(STORAGE_KEYS.ANALYSES, analyses);
  
  const chatHistory = getAllChatHistory().filter(chat => chat.ideaId !== id);
  saveToStorage(STORAGE_KEYS.CHAT_HISTORY, chatHistory);
}

// Analysis functions
export function getAllAnalyses(): Analysis[] {
  return getFromStorage<Analysis[]>(STORAGE_KEYS.ANALYSES, []);
}

export function getAnalysisForIdea(ideaId: string): Analysis | undefined {
  const analyses = getAllAnalyses();
  return analyses.find(analysis => analysis.ideaId === ideaId);
}

export function saveAnalysis(analysis: Analysis): void {
  const analyses = getAllAnalyses();
  const existingIndex = analyses.findIndex(a => a.ideaId === analysis.ideaId);
  
  if (existingIndex >= 0) {
    analyses[existingIndex] = analysis;
  } else {
    analyses.push(analysis);
  }
  
  saveToStorage(STORAGE_KEYS.ANALYSES, analyses);
}

// Generate mock analysis (in a real app, this would call an AI service)
export async function generateAnalysis(ideaId: string): Promise<void> {
  const idea = getIdea(ideaId);
  
  if (!idea) {
    throw new Error("Idea not found");
  }
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const analysis: Analysis = {
    id: Date.now().toString(),
    ideaId: idea.id,
    problemAnalysis: generateMockContent("Problem Analysis", idea.title),
    targetMarket: generateMockContent("Target Market", idea.title),
    businessModel: generateMockContent("Business Model", idea.title),
    legalConsiderations: generateMockContent("Legal Considerations", idea.title),
    growthStrategy: generateMockContent("Growth Strategy", idea.title),
    competitorAnalysis: generateMockContent("Competitor Analysis", idea.title),
    fundingRequirements: generateMockContent("Funding Requirements", idea.title),
    ideaUniqueValue: generateMockContent("Idea Unique Value", idea.title),
    targetMarketSize: generateMockContent("Target Market Size", idea.title),
    topCompetitorName: generateMockContent("Top Competitor Name", idea.title),
    estimatedFundingRequirements: generateMockContent("Estimated Funding Requirements", idea.title),
    fundingAllocation: generateMockContent("Funding Allocation", idea.title),
    marketAnalysisScore: generateMockContent("Market Analysis Score", idea.title),
    createdAt: new Date().toISOString()
  };
  
  saveAnalysis(analysis);
  toast.success("Analysis completed!");
}

// Chat history functions
export function getAllChatHistory(): ChatMessage[] {
  return getFromStorage<ChatMessage[]>(STORAGE_KEYS.CHAT_HISTORY, []);
}

export function getChatHistory(ideaId: string, agentId: string): ChatMessage[] {
  const chatHistory = getAllChatHistory();
  return chatHistory.filter(
    chat => chat.ideaId === ideaId && chat.agentId === agentId
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

export function saveChatMessage(message: ChatMessage): void {
  const chatHistory = getAllChatHistory();
  chatHistory.push(message);
  saveToStorage(STORAGE_KEYS.CHAT_HISTORY, chatHistory);
}

// Mock data generator
function generateMockContent(section: string, ideaTitle: string): string {
  const mockData: Record<string, string[]> = {
    "Problem Analysis": [
      `${ideaTitle} addresses a significant pain point in the market. The problem is well-defined and affects a large number of potential customers.`,
      `Our analysis shows that ${ideaTitle} targets an underserved market need. There is substantial evidence of customer dissatisfaction with current solutions.`,
      `${ideaTitle} solves a critical inefficiency in existing workflows. The problem is persistent and costly for affected organizations.`
    ],
    "Target Market": [
      `The primary target audience for ${ideaTitle} consists of tech-savvy professionals aged 25-45. This demographic represents approximately 120 million potential users in North America alone.`,
      `${ideaTitle} appeals most strongly to small and medium-sized businesses in the service sector. This market segment is growing at 7.2% annually.`,
      `The ideal customer for ${ideaTitle} is enterprise organizations with 500+ employees, particularly in healthcare, finance, and logistics sectors.`
    ],
    "Business Model": [
      `A SaaS subscription model is recommended for ${ideaTitle}, with tiered pricing based on feature access and usage volume. Estimated customer lifetime value is 3-4 years.`,
      `${ideaTitle} should adopt a freemium model with premium features unlocked through subscription. This approach has shown 15-20% conversion rates in similar markets.`,
      `A transaction-based revenue model suits ${ideaTitle} best, with the platform taking a small percentage of each transaction facilitated through the service.`
    ],
    "Legal Considerations": [
      `${ideaTitle} will need to address data privacy regulations including GDPR and CCPA. Intellectual property protection through patents should be explored for core technology.`,
      `Regulatory compliance in financial services will be a key consideration for ${ideaTitle}. Legal counsel specializing in fintech regulations is recommended.`,
      `${ideaTitle} should establish clear terms of service and user agreements. Industry-specific regulations in healthcare will require specialized compliance measures.`
    ],
    "Growth Strategy": [
      `A product-led growth strategy is optimal for ${ideaTitle}, focusing on viral features and exceptional user experience to drive organic adoption.`,
      `${ideaTitle} should pursue strategic partnerships with complementary service providers to accelerate market penetration and establish credibility.`,
      `An aggressive content marketing approach will position ${ideaTitle} as a thought leader in the space, supported by targeted digital advertising campaigns.`
    ],
    "Competitor Analysis": [
      `${ideaTitle} faces 3-4 established competitors, but offers significant differentiation through superior UX and proprietary technology. Key competitors include established players with larger resources but less agility.`,
      `The competitive landscape for ${ideaTitle} is fragmented, with no dominant player holding more than 15% market share. This presents an opportunity to establish market leadership.`,
      `${ideaTitle} will compete with legacy systems rather than direct competitors. The main challenge will be overcoming organizational resistance to change.`
    ],
    "Funding Requirements": [
      `${ideaTitle} requires approximately $750K-$1.2M in seed funding to reach MVP and initial market validation, followed by a Series A of $3-5M for scaling.`,
      `Bootstrap development is feasible for ${ideaTitle}, with estimated costs of $150-200K until revenue generation. Angel investment may accelerate time-to-market.`,
      `${ideaTitle} should pursue venture funding of $2-3M to build team and product. The capital-intensive nature of the business warrants early institutional investment.`
    ],
    "Idea Unique Value": ["Unique", "Innovative", "Disruptive", "Transformative", "Game-changing"],
    "Target Market Size": ["100K", "13M", "237M", "1B"],
    "Top Competitor Name": ["Competitor A", "Competitor B", "Competitor C"],
    "Estimated Funding Requirements": ["100K", "13M", "237M", "1B"],
    "Funding Allocation": ["{Development:20,marketing:60,operations:10,legal:10}", "{Development:20,marketing:60,operations:10,legal:10}", "{Development:20,marketing:60,operations:10,legal:10}", "{Development:20,marketing:60,operations:10,legal:10}", "{Development:20,marketing:60,operations:10,legal:10}"]
  };
  
  const options = mockData[section] || ["No data available"];
  return options[Math.floor(Math.random() * options.length)];
}
