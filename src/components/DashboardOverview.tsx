
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Analysis } from '@/lib/ideaService';
import { BadgeDollarSign, Lightbulb, Target, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface DashboardOverviewProps {
  analysis: Analysis;
}

export const DashboardOverview = ({ analysis }: DashboardOverviewProps) => {
  const [marketData, setMarketData] = useState([]);
  const [fundingData, setFundingData] = useState([]);
  // Create market analysis data from analysis text
  const getMarketData = useCallback(() => {
    let mas = {}
    if(typeof analysis.marketAnalysisScore === "string"){
       mas = JSON.parse(analysis.marketAnalysisScore || "{}"); 
    }else{
      mas = analysis.marketAnalysisScore || {};
    }
    // Generate some mock data based on the analysis
    const x =  Object.keys(mas).map(name => ({
      name:name.charAt(0).toUpperCase() + name.slice(1),
      value: Number(mas[name]),
    }));
    return x
  }, [analysis]);

  // Create funding allocation data from analysis text
  const getFundingData = useCallback(() => {
    let fa = {}
    if(typeof analysis.fundingAllocation === "string"){
      fa = JSON.parse(analysis.fundingAllocation || "{}");
    }else{
      fa = analysis.fundingAllocation || {};
    }
    const x =  Object.keys(fa).map(name => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Number(fa[name]),
    }));
    return x
  }, [analysis]);

  const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#6366f1'];

  useEffect(() => {
    if(analysis) {
      setMarketData(getMarketData());
      setFundingData(getFundingData());
    }
  }, [analysis, getMarketData, getFundingData]);

  return (
    <div className="space-y-6">
      {/* Key insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-black/30 backdrop-blur-sm border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-300">Problem Clarity</h3>
            <div className="bg-blue-500/20 p-2 rounded-full">
              <Lightbulb size={16} className="text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-2">{analysis.ideaUniqueValue}</p>
          <p className="text-xs text-slate-400 mt-1">How unique is your idea?</p>
        </div>

        <div className="bg-black/30 backdrop-blur-sm border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-300">Target Market Size</h3>
            <div className="bg-purple-500/20 p-2 rounded-full">
              <Target size={16} className="text-purple-400" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-2">{analysis.targetMarketSize}</p>
          <p className="text-xs text-slate-400 mt-1">Estimated market size</p>
        </div>

        <div className="bg-black/30 backdrop-blur-sm border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-300">Top Competition</h3>
            <div className="bg-cyan-500/20 p-2 rounded-full">
              <Users size={16} className="text-cyan-400" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-2">{analysis.topCompetitorName}</p>
          <p className="text-xs text-slate-400 mt-1">Most established competitor</p>
        </div>

        <div className="bg-black/30 backdrop-blur-sm border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-300">Estimate Funding Needs</h3>
            <div className="bg-indigo-500/20 p-2 rounded-full">
              <BadgeDollarSign size={16} className="text-indigo-400" />
            </div>
          </div>
          <p className="text-2xl font-bold mt-2">${analysis.estimatedFundingRequirements}</p>
          <p className="text-xs text-slate-400 mt-1">Estimated initial investment</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/30 backdrop-blur-sm border border-slate-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-4">Market Analysis Score</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={marketData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                  labelStyle={{ color: '#f8fafc' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                  background={{ fill: '#1e293b' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-black/30 backdrop-blur-sm border border-slate-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-4">Recommended Funding Allocation</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fundingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {fundingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                  formatter={(value: any) => [`${value}%`, 'Allocation']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
