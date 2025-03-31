import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { 
  Users, MessageSquare, PieChart, Search, Scale, TrendingUp, BadgeDollarSign, ChevronLeft, Menu
} from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const agents = [
  { id: "assistant", name: "Personal Assistant", icon: <MessageSquare size={18} />, color: "purple",agentName:"Stacy" },
  { id: "pitch", name: "Pitch Expert", icon: <Users size={18} />, color: "blue",agentName:"Steve" },
  { id: "financial", name: "Financial Analyst", icon: <PieChart size={18} />, color: "emerald",agentName:"Jordon" },
  { id: "market", name: "Market Researcher", icon: <Search size={18} />, color: "amber",agentName:"Lily" },
  { id: "legal", name: "Legal Consultant", icon: <Scale size={18} />, color: "red",agentName:"Harvey" },
  { id: "growth", name: "Growth Strategist", icon: <TrendingUp size={18} />, color: "teal",agentName:"Reids" },
  { id: "fundraising", name: "Fundraising Coach", icon: <BadgeDollarSign size={18} />, color: "indigo",agentName:"Sam" },
];