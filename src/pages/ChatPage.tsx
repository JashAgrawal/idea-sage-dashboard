import { useState, useRef, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Send,
  MessageSquare,
  PieChart,
  Search,
  Scale,
  TrendingUp,
  BadgeDollarSign,
  Users,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getIdea,
  getChatHistory,
  saveChatMessage,
  Idea,
} from "@/lib/ideaService";
// import { ApiKeyInput } from "@/components/ApiKeyInput";
import { generateChatResponse } from "@/lib/geminiService";
import { ChatMessageSkeleton } from "@/components/SkeletonLoaders";
import { StreamingText } from "@/components/StreamingText";

const agentConfig = {
  assistant: {
    name: "Personal Assistant",
    icon: <MessageSquare size={18} />,
    color: "bg-purple-500",
    description:
      "Your go-to resource for summarizing insights and answering general questions about your idea.",
    type: "assistant",
  },
  pitch: {
    name: "Pitch Expert",
    icon: <Users size={18} />,
    color: "bg-blue-500",
    description:
      "Perfect your pitch for investors, customers, and partners with expert guidance on messaging and structure.",
    type: "pitch",
  },
  financial: {
    name: "Financial Analyst",
    icon: <PieChart size={18} />,
    color: "bg-emerald-500",
    description:
      "Get detailed advice on financial projections, pricing strategies, and business model optimization.",
    type: "financial",
  },
  market: {
    name: "Market Researcher",
    icon: <Search size={18} />,
    color: "bg-amber-500",
    description:
      "Dive deep into market trends, customer segments, and competitive landscape analysis.",
    type: "market",
  },
  legal: {
    name: "Legal Consultant",
    icon: <Scale size={18} />,
    color: "bg-red-500",
    description:
      "Navigate legal considerations, regulatory requirements, and intellectual property protection.",
    type: "legal",
  },
  growth: {
    name: "Growth Strategist",
    icon: <TrendingUp size={18} />,
    color: "bg-teal-500",
    description:
      "Plan effective customer acquisition, retention strategies, and scaling approaches.",
    type: "growth",
  },
  fundraising: {
    name: "Fundraising Coach",
    icon: <BadgeDollarSign size={18} />,
    color: "bg-indigo-500",
    description:
      "Optimize your fundraising strategy with guidance on investor targeting and pitch preparation.",
    type: "fundraising",
  },
};

const ChatPage = () => {
  const { ideaId, agentId } = useParams<{ ideaId: string; agentId: string }>();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load idea and chat history
  useEffect(() => {
    if (!ideaId || !agentId) return;

    const loadedIdea = getIdea(ideaId);
    if (loadedIdea) {
      setIdea(loadedIdea);
      const history = getChatHistory(ideaId, agentId);

      // If no history, add a welcome message
      if (history.length === 0) {
        const agent = agentConfig[agentId as keyof typeof agentConfig];
        if (agent) {
          const welcomeMessage = {
            id: Date.now().toString(),
            ideaId,
            agentId,
            content: `Hi there! I'm your ${agent.name}. ${agent.description} How can I help with your "${loadedIdea.title}" idea today?`,
            isUser: false,
            timestamp: new Date().toISOString(),
          };
          saveChatMessage(welcomeMessage);
          setMessages([welcomeMessage]);
        }
      } else {
        setMessages(history);
      }

      setInitialLoad(false);
    }
  }, [ideaId, agentId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  if (
    !ideaId ||
    !agentId ||
    !agentConfig[agentId as keyof typeof agentConfig]
  ) {
    return <Navigate to="/" />;
  }

  const agent = agentConfig[agentId as keyof typeof agentConfig];

  const addAssistantMessage = (content: string) => {
    const assistantMessage = {
      id: Date.now().toString(),
      ideaId,
      agentId,
      content,
      isUser: false,
      timestamp: new Date().toISOString(),
    };
    saveChatMessage(assistantMessage);
    setMessages((prev) => [...prev, assistantMessage]);
    setStreamingMessage("");
    setIsLoading(false);
  }
    
  const handleSend = async () => {
    if (!input.trim() || isLoading || !idea) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      ideaId,
      agentId,
      content: input,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    saveChatMessage(userMessage);
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setStreamingMessage("");

    // Prepare message history for API
    const messageHistory = messages.map((msg) => ({
      content: msg.content,
      isUser: msg.isUser,
    }));

    try {
      // Start streaming the response
      const stream = await generateChatResponse(
        idea.title,
        idea.description,
        agent.name,
        messageHistory.length > 1 ? messageHistory.slice(1) : [],
        input
      );
      if (typeof stream === "string") {
        // setStreamingMessage(stream);
        addAssistantMessage(stream);
      } else {
        let msg = "";
        for await (const chunk of stream) {
          msg += chunk.text;
          setStreamingMessage(msg);
        }
        addAssistantMessage(msg);
      }
    } catch (error) {
      console.error("Error generating response:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar ideaId={ideaId} />

      <div className="flex-1 flex flex-col">
        <div className="border-b border-slate-800 p-4">
          <div className="flex items-center">
            <Avatar className={cn("h-8 w-8 mr-3", agent.color)}>
              <AvatarFallback className="text-white">
                {agent.icon}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">{agent.name}</h2>
              <p className="text-sm text-slate-400">
                {idea?.title && `Consulting on: ${idea.title}`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.8))]">
          <div className="max-w-3xl mx-auto">
            {initialLoad ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
              </div>
            ) : (
              <>
                {/* First time user assistance */}
                {messages.length <= 1 && (
                  <div className="bg-blue-900/20 backdrop-blur-sm border border-blue-800/50 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-blue-400 mb-2">
                      Getting Started
                    </h3>
                    <p className="text-sm text-slate-300 mb-2">
                      This AI consultant has been primed with information about
                      your idea. You can ask specific questions about your
                      business concept, request advice, or explore strategic
                      options.
                    </p>
                    {/* <ApiKeyInput /> */}
                  </div>
                )}

                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.isUser ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] rounded-lg p-4",
                          message.isUser
                            ? "bg-blue-600 text-white"
                            : "bg-slate-800/90 text-slate-200"
                        )}
                      >
                        <p className="whitespace-pre-line">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Streaming response */}
                  {streamingMessage && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-lg p-4 bg-slate-800/90 text-slate-200">
                        {/* <StreamingText
                          text={streamingMessage}
                          className="whitespace-pre-line"
                        /> */}
                        <p className="whitespace-pre-line">{streamingMessage}</p>
                        <div className="text-xs opacity-70 mt-1">
                          {new Date().toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Loading indicator */}
                  {isLoading && !streamingMessage && <ChatMessageSkeleton />}

                  <div ref={messagesEndRef} />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="border-t border-slate-800 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex space-x-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={`Ask the ${agent.name} about your idea...`}
                className="min-h-[60px] bg-slate-800/90 border-slate-700 text-white resize-none"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim() || initialLoad}
                className={cn(
                  "px-4",
                  isLoading ? "bg-slate-700" : "bg-blue-600 hover:bg-blue-700"
                )}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
