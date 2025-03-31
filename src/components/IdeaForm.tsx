import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Edit, Loader2, Save } from "lucide-react";
import { saveIdea } from "@/lib/ideaService";
import {
  generateIdeaTitle,
  generateAnalysisWithGemini,
} from "@/lib/geminiService";
// import { ApiKeyInput } from "@/components/ApiKeyInput";

interface IdeaFormProps {
  onClose?: () => void;
}

const IdeaForm = ({ onClose }: IdeaFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isTitleEditable, setIsTitleEditable] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Generate title when description changes


  const generateTitle = useCallback(async () => {
    if (!description.trim() || isGeneratingTitle) return;

    setIsGeneratingTitle(true);
    try {
      const generatedTitle = await generateIdeaTitle(description);
      setTitle(generatedTitle);
    } catch (error) {
      console.error("Error generating title:", error);
    } finally {
      setIsGeneratingTitle(false);
    }
  }, [description, isGeneratingTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a description for your idea.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Use generated title or fallback
      const finalTitle = title.trim() || "My Startup Idea";

      // Save the idea
      const ideaId = await saveIdea({
        id: Date.now().toString(),
        title: finalTitle,
        description,
        createdAt: new Date().toISOString(),
      });

      toast({
        title: "Idea submitted!",
        description: "Generating analysis with Gemini...",
      });

      // Generate the analysis with Gemini
      try {
        const analysis = await generateAnalysisWithGemini({
          title: finalTitle,
          description,
        });

        // Save the analysis with the actual data
        const analysisToSave = {
          id: Date.now().toString(),
          ideaId,
          problemAnalysis:
            analysis.problemAnalysis || "Analysis in progress...",
          targetMarket: analysis.targetMarket || "Analysis in progress...",
          businessModel: analysis.businessModel || "Analysis in progress...",
          legalConsiderations:
            analysis.legalConsiderations || "Analysis in progress...",
          growthStrategy: analysis.growthStrategy || "Analysis in progress...",
          competitorAnalysis:
            analysis.competitorAnalysis || "Analysis in progress...",
          fundingRequirements:
            analysis.fundingRequirements || "Analysis in progress...",
          ideaUniqueValue: analysis.ideaUniqueValue || "Analysis in progress...",
          targetMarketSize: analysis.targetMarketSize || "Analysis in progress...",
          topCompetitorName: analysis.topCompetitorName || "Analysis in progress...",
          estimatedFundingRequirements: analysis.estimatedFundingRequirements || "Analysis in progress...",
          fundingAllocation: analysis.fundingAllocation || "Analysis in progress...",
          marketAnalysisScore: analysis.marketAnalysisScore || "Analysis in progress...",
          createdAt: new Date().toISOString(),
        };

        // Import and use saveAnalysis from ideaService
        const { saveAnalysis } = await import("@/lib/ideaService");
        saveAnalysis(analysisToSave);

        toast({
          title: "Analysis completed!",
          description: "Analysis completed!",
          variant: "default",
        });
      } catch (error) {
        console.error("Error generating analysis:", error);
        // Still navigate to dashboard even if analysis fails
      }

      // Redirect to the dashboard
      setTimeout(() => {
        navigate(`/dashboard/${ideaId}`);
      }, 500);
    } catch (error) {
      console.error("Error saving idea:", error);
      toast({
        title: "Something went wrong",
        description: "Unable to save your idea. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (description.trim().length > 20 && !title) {
        generateTitle();
      }
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [description, generateTitle, title]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* <ApiKeyInput /> */}

      {/* Title field (auto-generated but editable) */}
      {/* <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-slate-300">
            Idea Title
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 text-xs text-slate-400"
            onClick={() => setIsTitleEditable(!isTitleEditable)}
          >
            <Edit size={12} className="mr-1" />
            {isTitleEditable ? "Auto" : "Edit"}
          </Button>
        </div>
        <div className="relative">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!isTitleEditable && !isGeneratingTitle}
            className={`bg-slate-800/70 border-slate-700 text-white ${
              isGeneratingTitle ? "opacity-70" : ""
            }`}
            placeholder={
              isGeneratingTitle ? "Generating title..." : "Auto-generated title"
            }
          />
          {isGeneratingTitle && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 size={16} className="animate-spin text-slate-400" />
            </div>
          )}
        </div>
      </div> */}

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Describe Your Idea
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-slate-800/70 border-slate-700 text-white min-h-[150px]"
          placeholder="Describe your startup idea in detail. What problem does it solve? Who is your target customer? What makes it unique?"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        {onClose && (
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading || !description.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze My Idea"
          )}
        </Button>
      </div>
    </form>
  );
};

export default IdeaForm;
