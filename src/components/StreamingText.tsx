
import { useEffect, useState, useRef } from "react";

interface StreamingTextProps {
  text: string;
  className?: string;
}

export function StreamingText({ text, className = "" }: StreamingTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const fullTextRef = useRef(text);
  
  useEffect(() => {
    // If the text prop changes, reset and start streaming the new text
    if (text !== fullTextRef.current) {
      fullTextRef.current = text;
      setDisplayedText("");
      setIsComplete(false);
    }
  }, [text]);
  
  useEffect(() => {
    if (displayedText === fullTextRef.current) {
      setIsComplete(true);
      return;
    }
    
    // If we're not done streaming yet, continue streaming
    if (!isComplete) {
      const timeoutId = setTimeout(() => {
        setDisplayedText(fullTextRef.current.substring(0, displayedText.length + 1));
      }, 10); // Adjust speed as needed
      
      return () => clearTimeout(timeoutId);
    }
  }, [displayedText, isComplete]);
  
  return <div className={className}>{displayedText || " "}</div>;
}
