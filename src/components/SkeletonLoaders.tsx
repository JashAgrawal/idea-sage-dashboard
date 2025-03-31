
import { Skeleton } from "@/components/ui/skeleton";

export const AnalysisSectionSkeleton = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="bg-slate-900/60 rounded-lg p-5 border border-slate-700/70 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-10 w-72 mb-2" />
        <Skeleton className="h-5 w-48" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="bg-slate-800/60 rounded-lg p-4 border border-slate-700">
            <Skeleton className="h-5 w-24 mb-4" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
      
      <div className="bg-slate-800/60 rounded-xl border border-slate-700 p-4">
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
      
      <div className="bg-slate-800/60 rounded-xl border border-slate-700 p-4">
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  );
};

export const ChatMessageSkeleton = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-slate-800 rounded-lg p-4 max-w-[80%] animate-pulse">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-52" />
        </div>
        <div className="space-y-2 mt-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
        <Skeleton className="h-3 w-16 mt-2" />
      </div>
    </div>
  );
};
