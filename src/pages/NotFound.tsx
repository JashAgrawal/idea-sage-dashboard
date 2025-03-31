
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center p-8 bg-slate-900/40 backdrop-blur-sm rounded-xl border border-slate-800 max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-amber-500/20 rounded-full">
            <AlertTriangle className="h-10 w-10 text-amber-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
        <p className="text-slate-400 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <Button 
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
