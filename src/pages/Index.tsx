
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Brain, Database, Shield, Sparkles } from "lucide-react";
import IdeaForm from "@/components/IdeaForm";
import { getAllIdeas } from "@/lib/ideaService";

const Index = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [hasExistingIdeas, setHasExistingIdeas] = useState(false);
  
  useEffect(() => {
    const ideas = getAllIdeas();
    setHasExistingIdeas(ideas.length > 0);
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-black to-black text-white overflow-auto">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-blue-500/10 p-3 rounded-full mb-4">
            <Brain className="h-8 w-8 text-blue-400" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600">
            IdeaSage
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl leading-relaxed">
            Transform your startup ideas into comprehensive business strategies with AI-powered analysis
          </p>
          
          {!showForm ? (
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-8 py-6 flex items-center text-lg"
              >
                Analyze New Idea
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              {hasExistingIdeas && (
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => {
                    const ideas = getAllIdeas();
                    if (ideas.length > 0) {
                      navigate(`/dashboard/${ideas[0].id}`);
                    }
                  }}
                  className="border-slate-700 text-black hover:bg-slate-300 font-medium rounded-lg px-8 py-6 flex items-center text-lg"
                >
                  View My Ideas
                </Button>
              )}
            </div>
          ) : (
            <div className="w-full max-w-3xl bg-slate-900/60 backdrop-blur-sm rounded-xl p-6 border border-slate-800">
              <IdeaForm onClose={() => setShowForm(false)} />
            </div>
          )}
        </div>
        
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-slate-800">
            <div className="bg-blue-500/10 p-3 rounded-full mb-4 inline-block">
              <Sparkles className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-blue-400">Comprehensive Analysis</h3>
            <p className="text-slate-300">Get detailed insights on target market, business model, legal considerations, and more.</p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-slate-800">
            <div className="bg-purple-500/10 p-3 rounded-full mb-4 inline-block">
              <Brain className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-purple-400">Expert AI Consultants</h3>
            <p className="text-slate-300">Access specialized AI agents for finance, marketing, legal, and growth strategy guidance.</p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-slate-800">
            <div className="bg-cyan-500/10 p-3 rounded-full mb-4 inline-block">
              <Database className="h-5 w-5 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-cyan-400">Track Your Progress</h3>
            <p className="text-slate-300">Store and revisit all your ideas and analyses in one organized dashboard.</p>
          </div>
        </div>
        
        <div className="mt-24 text-center">
          <div className="bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-cyan-900/20 backdrop-blur-sm p-8 rounded-xl border border-slate-800">
            <div className="bg-indigo-500/10 p-3 rounded-full mb-4 inline-block">
              <Shield className="h-5 w-5 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Powered by Google Gemini AI</h3>
            <p className="text-slate-300 max-w-2xl mx-auto">
              IdeaSage leverages Google's Gemini AI to provide intelligent analysis and strategic insights for your startup ideas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
