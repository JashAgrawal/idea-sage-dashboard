
import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { getIdea, getAnalysisForIdea, Idea, Analysis } from "@/lib/ideaService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sidebar } from "@/components/Sidebar";
import { AnalysisSection } from "@/components/AnalysisSection";
import { BarChart4, Target, Users, DollarSign, Scale, TrendingUp, PieChart, RefreshCw, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AnalysisSectionSkeleton, DashboardSkeleton } from "@/components/SkeletonLoaders";
import { DashboardOverview } from "@/components/DashboardOverview";
import { generateAnalysisWithGemini } from "@/lib/geminiService";
// import { ApiKeyInput } from "@/components/ApiKeyInput";

const Dashboard = () => {
  const { ideaId } = useParams<{ ideaId: string }>();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!ideaId) return;
    
    const loadedIdea = getIdea(ideaId);
    if (loadedIdea) {
      setIdea(loadedIdea);
      const loadedAnalysis = getAnalysisForIdea(ideaId);
      setAnalysis(loadedAnalysis || null);
    }
    
    setIsLoading(false);
  }, [ideaId]);

  const handleRegenerateAnalysis = async () => {
    if (!idea || !ideaId || isGeneratingAnalysis) return;
    
    setIsGeneratingAnalysis(true);
    
    try {
      toast({
        title: "Regenerating analysis",
        description: "Please wait while Gemini analyzes your idea..."
      });
      
      const newAnalysis = await generateAnalysisWithGemini({
        title: idea.title,
        description: idea.description
      });
      
      // Save the analysis with the actual data
      const analysisToSave = {
        id: Date.now().toString(),
        ideaId,
        problemAnalysis: newAnalysis.problemAnalysis || "Analysis in progress...",
        targetMarket: newAnalysis.targetMarket || "Analysis in progress...",
        businessModel: newAnalysis.businessModel || "Analysis in progress...",
        legalConsiderations: newAnalysis.legalConsiderations || "Analysis in progress...",
        growthStrategy: newAnalysis.growthStrategy || "Analysis in progress...",
        competitorAnalysis: newAnalysis.competitorAnalysis || "Analysis in progress...",
        fundingRequirements: newAnalysis.fundingRequirements || "Analysis in progress...",
        ideaUniqueValue: newAnalysis.ideaUniqueValue || "Analysis in progress...",
        targetMarketSize: newAnalysis.targetMarketSize || "Analysis in progress...",
        topCompetitorName: newAnalysis.topCompetitorName || "Analysis in progress...",
        estimatedFundingRequirements: newAnalysis.estimatedFundingRequirements || "Analysis in progress...",
        fundingAllocation: newAnalysis.fundingAllocation || "Analysis in progress...",
        marketAnalysisScore: newAnalysis.marketAnalysisScore || "Analysis in progress...",
        createdAt: new Date().toISOString()
      };
      
      // Import and use saveAnalysis from ideaService
      const { saveAnalysis } = await import("@/lib/ideaService");
      saveAnalysis(analysisToSave);
      
      setAnalysis(analysisToSave);
      toast({title: "Analysis regenerated", description: "Your analysis has been regenerated successfully."})
    } catch (error) {
      console.error("Error regenerating analysis:", error);
      toast({title: "Failed to regenerate analysis", description: "Please try again.", variant: "destructive"})
    } finally {
      setIsGeneratingAnalysis(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen p-8 w-full bg-black text-white">
        <Sidebar ideaId={ideaId || ""} />
        
        <div className="flex-1 p-6 overflow-auto ">
          <div className="max-w-5xl mx-auto">
            <DashboardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!idea || !ideaId) {
    return <Navigate to="/" />;
  }

  // Handle if analysis isn't ready yet
  if (!analysis) {
    return (
      <div className="flex h-screen p-8 bg-black text-white">
        <Sidebar ideaId={ideaId} />
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">{idea.title}</h1>
            <p className="text-slate-400 mb-6">{new Date(idea.createdAt).toLocaleDateString()}</p>
            
            <div className="bg-slate-900/40 backdrop-blur-sm rounded-xl p-8 text-center border border-slate-800 mb-6">
              {/* <ApiKeyInput /> */}
              
              <RefreshCw className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-3">Generating Your Analysis</h2>
              <p className="text-slate-300 mb-6">
                Our AI is analyzing your idea and preparing comprehensive insights. This may take a moment.
              </p>
              <Button
                onClick={handleRegenerateAnalysis}
                disabled={isGeneratingAnalysis}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isGeneratingAnalysis ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Analysis"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const analysisItems = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: "problem", label: "Problem Analysis", icon: <BarChart4 className="h-5 w-5" />, content: analysis.problemAnalysis },
    { id: "market", label: "Target Market", icon: <Target className="h-5 w-5" />, content: analysis.targetMarket },
    { id: "business", label: "Business Model", icon: <DollarSign className="h-5 w-5" />, content: analysis.businessModel },
    { id: "legal", label: "Legal Considerations", icon: <Scale className="h-5 w-5" />, content: analysis.legalConsiderations },
    { id: "growth", label: "Growth Strategy", icon: <TrendingUp className="h-5 w-5" />, content: analysis.growthStrategy },
    { id: "competitors", label: "Competitor Analysis", icon: <Users className="h-5 w-5" />, content: analysis.competitorAnalysis },
    { id: "funding", label: "Funding Requirements", icon: <PieChart className="h-5 w-5" />, content: analysis.fundingRequirements },
  ];

  return (
    <div className="flex h-screen p-8 bg-black text-white">
      <Sidebar ideaId={ideaId} />
      
      <div className="flex-1 p-6 overflow-auto ">
        <div className="max-w-full mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{idea.title}</h1>
              <p className="text-slate-400">{new Date(idea.createdAt).toLocaleDateString()}</p>
            </div>
            <Button
              onClick={handleRegenerateAnalysis}
              disabled={isGeneratingAnalysis}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGeneratingAnalysis ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </>
              )}
            </Button>
          </div>
          
          <div className="bg-slate-900/10 backdrop-blur-sm rounded-xl border border-slate-800 mb-8">
            <Tabs defaultValue="overview" value={activeSection} onValueChange={setActiveSection}>
              <div className="overflow-x-auto pb-4">
                <TabsList className="w-full h-auto bg-slate-900/60 p-2 border-b border-slate-800">
                  {analysisItems.map(item => (
                    <TabsTrigger 
                      key={item.id} 
                      value={item.id}
                      className="w-auto py-3 h-auto flex items-center rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      {item.icon}
                      <span className="ml-2 hidden sm:inline">{item.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              <TabsContent value="overview" className="p-6">
                <DashboardOverview analysis={analysis} />
              </TabsContent>
              
              {analysisItems.slice(1).map(item => (
                <TabsContent key={item.id} value={item.id} className="p-6">
                  {isGeneratingAnalysis ? (
                    <AnalysisSectionSkeleton />
                  ) : (
                    <AnalysisSection
                      title={item.label}
                      content={item.content || "Analysis not available"}
                    />
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          <div className="bg-slate-900/40 backdrop-blur-sm rounded-xl p-6 border border-slate-800">
            <h2 className="text-xl font-semibold mb-4">Original Idea</h2>
            <p className="text-slate-300 whitespace-pre-line">{idea.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
