
// import { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Key, Check } from "lucide-react";
// import { getApiKey, setApiKey } from "@/lib/geminiService";

// export function ApiKeyInput() {
//   const [apiKey, setApiKeyState] = useState<string>("");
//   const [isSet, setIsSet] = useState<boolean>(false);
//   const [isVisible, setIsVisible] = useState<boolean>(false);

//   useEffect(() => {
//     const existingKey = getApiKey();
//     if (existingKey) {
//       setApiKeyState(existingKey);
//       setIsSet(true);
//     }
//   }, []);

//   const handleSaveKey = () => {
//     if (apiKey.trim()) {
//       setApiKey(apiKey.trim());
//       setIsSet(true);
//     }
//   };

//   return (
//     <div className="bg-black/30 backdrop-blur-sm border border-slate-800 rounded-lg p-4 mb-6">
//       <div className="flex flex-col space-y-2">
//         <div className="flex items-center justify-between mb-2">
//           <h3 className="text-sm font-medium text-slate-300 flex items-center">
//             <Key size={14} className="mr-1" /> Gemini API Key
//           </h3>
//           {isSet && (
//             <Button 
//               variant="ghost" 
//               size="sm" 
//               className="h-6 text-xs" 
//               onClick={() => setIsVisible(!isVisible)}
//             >
//               {isVisible ? "Hide" : "Show"}
//             </Button>
//           )}
//         </div>
        
//         <div className="flex space-x-2">
//           <Input
//             type={isVisible ? "text" : "password"}
//             placeholder="Enter your Gemini API key"
//             value={apiKey}
//             onChange={(e) => setApiKeyState(e.target.value)}
//             className="bg-slate-900/70 border-slate-800 text-white text-sm h-8"
//           />
//           <Button
//             size="sm"
//             className="h-8 bg-blue-600 hover:bg-blue-700"
//             onClick={handleSaveKey}
//           >
//             {isSet ? <Check size={14} /> : "Save"}
//           </Button>
//         </div>
        
//         <p className="text-xs text-slate-400 mt-1">
//           Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google AI Studio</a>
//         </p>
//       </div>
//     </div>
//   );
// }
