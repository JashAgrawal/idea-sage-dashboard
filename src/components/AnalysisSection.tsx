
import { ArrowDownToLine } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface AnalysisSectionProps {
  title: string;
  content: string;
}

export const AnalysisSection = ({ title, content }: AnalysisSectionProps) => {
  const handleExport = () => {
    // Create a blob with the content
    const blob = new Blob([`${title}\n\n${content}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-analysis.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-slate-400 hover:text-white hover:bg-slate-800"
          onClick={handleExport}
        >
          <ArrowDownToLine className="h-4 w-4 mr-1" />
          <span className="text-sm">Export</span>
        </Button>
      </div>
      <div className="bg-black/30 backdrop-blur-sm rounded-lg p-5 border border-slate-800">
        <p className="text-slate-200 leading-relaxed whitespace-pre-line">{content}</p>
      </div>
    </div>
  );
};
