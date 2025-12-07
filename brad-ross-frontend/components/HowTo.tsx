import React, { useState, useMemo } from 'react';
import { Brain, Heart, Users, Zap, Search, Activity, Play, ChevronRight, X, BarChart3, Target, Clock, Tag } from 'lucide-react';
import { DataClusterScene, generateData, DataPoint, SEGMENT_CONFIG } from './DataCluster';

// Helper to generate mock recommendations based on segment
const getRecsForSegment = (segment: string) => {
    switch (segment) {
        case 'Dad': return ['Cosmos S2', 'Apollo 13', 'Interstellar'];
        case 'Kid': return ['Bluey: The Movie', 'Cocomelon', 'DuckTales'];
        case 'Teen': return ['Riverdale S4', 'Elite', 'Sex Education'];
        case 'Family': return ['Paddington 2', 'Wonka', 'Harry Potter'];
        default: return [];
    }
};

const HowTo: React.FC = () => {
  const [vizMode, setVizMode] = useState<'random' | 'cluster'>('random');
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);
  
  const data = useMemo(() => generateData(), []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-slate-200">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">The Algorithm: Invisible Design</h1>
        <p className="text-slate-400 text-lg max-w-3xl mx-auto">
          We infer context from behavior. A single user profile is actually a collection of distinct "Micro-Segments".
        </p>
      </div>

      {/* VISUALIZATION CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[750px] lg:h-[600px] mb-16">
        
        {/* LEFT: 3D Scene (Takes up 2 cols) */}
        <div className="lg:col-span-2 relative h-full">
            <DataClusterScene 
                data={data} 
                mode={vizMode} 
                setMode={setVizMode} 
                selectedPoint={selectedPoint}
                onSelectPoint={setSelectedPoint}
            />
        </div>

        {/* RIGHT: Stats & Details Panel */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-700 rounded-2xl flex flex-col overflow-hidden h-full shadow-2xl relative">
            
            {/* Header of Panel */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-2">
                    <Activity size={18} className="text-tv5" />
                    <span className="font-bold text-white tracking-wide">
                        {selectedPoint ? "EVENT ANALYSIS" : "DATA STREAM"}
                    </span>
                </div>
                {selectedPoint && (
                    <button 
                        onClick={() => setSelectedPoint(null)} 
                        className="text-slate-500 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* CONTENT AREA */}
            <div className="flex-grow overflow-y-auto custom-scrollbar relative">
                
                {/* STATE A: LIST VIEW (No selection) */}
                {!selectedPoint && (
                    <div className="absolute inset-0 flex flex-col">
                        <div className="p-4 bg-slate-800/30 text-xs text-slate-400">
                            Showing {data.length} recent viewing events. Click a node in the 3D view to inspect AI classification.
                        </div>
                        <div className="overflow-y-auto flex-grow">
                            {data.map((item) => (
                                <div 
                                    key={item.id}
                                    onClick={() => setSelectedPoint(item)}
                                    className="p-3 border-b border-slate-800 hover:bg-slate-800/80 cursor-pointer flex items-center justify-between group transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div 
                                            className="w-2 h-2 rounded-full flex-shrink-0" 
                                            style={{ backgroundColor: item.color }} 
                                        />
                                        <div className="min-w-0">
                                            <div className="text-sm font-medium text-slate-200 group-hover:text-white flex items-center gap-2">
                                                <span className="truncate">{item.label}</span>
                                                {item.episode && (
                                                    <span className="text-[10px] text-slate-500 font-normal bg-slate-800 px-1 rounded flex-shrink-0">
                                                        {item.episode}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-[10px] text-slate-500">
                                                {item.stats.timestamp}
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight size={14} className="text-slate-600 group-hover:text-tv5 flex-shrink-0" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* STATE B: DETAIL VIEW (Selected) */}
                {selectedPoint && (
                    <div className="p-5 space-y-6 animate-in slide-in-from-right-4 duration-300">
                        
                        {/* Title Section */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span 
                                    className="text-[10px] font-bold uppercase px-2 py-0.5 rounded border"
                                    style={{
                                        color: SEGMENT_CONFIG[selectedPoint.segment].color,
                                        borderColor: SEGMENT_CONFIG[selectedPoint.segment].color,
                                        backgroundColor: `${SEGMENT_CONFIG[selectedPoint.segment].color}10`
                                    }}
                                >
                                    {SEGMENT_CONFIG[selectedPoint.segment].label}
                                </span>
                                <span className="text-[10px] text-slate-500 border border-slate-700 px-2 py-0.5 rounded">
                                    {selectedPoint.stats.device}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-1 leading-tight">
                                {selectedPoint.label}
                            </h2>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                {selectedPoint.episode && (
                                    <span className="font-medium text-slate-300">{selectedPoint.episode}</span>
                                )}
                                <span>•</span>
                                <span>{selectedPoint.stats.duration}</span>
                            </div>
                        </div>

                        {/* AI Analysis Tags */}
                        <div>
                             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Tag size={14} /> Likely Segments
                             </h3>
                             <div className="flex flex-wrap gap-2">
                                {selectedPoint.aiAnalysis.relatedTags.map((tag, i) => (
                                    <span key={i} className="px-2 py-1 bg-slate-800 text-xs text-slate-300 rounded-md border border-slate-700">
                                        {tag}
                                    </span>
                                ))}
                             </div>
                        </div>

                        {/* Scheduling Logic */}
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Clock size={14} /> Recommended Scheduling
                             </h3>
                            <div className="text-sm text-white font-medium mb-1">
                                {selectedPoint.aiAnalysis.bestTime}
                            </div>
                            <div className="text-[11px] text-slate-500 leading-tight">
                                Optimal engagement window for the <strong>{selectedPoint.segment}</strong> profile based on historical patterns.
                            </div>
                        </div>

                        {/* Confidence Score */}
                        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-sm text-slate-300">
                                    <Target size={16} className="text-tv5" />
                                    <span>AI Confidence</span>
                                </div>
                                <span className="text-xl font-bold text-tv5">94%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-tv5 h-full rounded-full w-[94%]" />
                            </div>
                            <div className="mt-2 text-[11px] text-slate-500">
                                {selectedPoint.aiAnalysis.matchReason}
                            </div>
                        </div>

                        {/* Related Recommendations */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Play size={14} /> Recommended Next
                             </h3>
                            <div className="space-y-2">
                                {getRecsForSegment(selectedPoint.segment).map((rec, i) => (
                                    <div key={i} className="flex items-center gap-3 p-2 bg-slate-800/50 rounded-lg border border-slate-800/50 hover:bg-slate-800/80 transition-colors cursor-pointer">
                                        <div className="w-8 h-8 bg-slate-700 rounded flex-shrink-0 flex items-center justify-center text-[8px] text-slate-500">
                                            TV
                                        </div>
                                        <div className="text-sm text-slate-200">{rec}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
      </div>

      {/* TEXT CONTENT (Bottom) */}
      <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          <div className="space-y-6">
             <div>
                <h3 className="text-xl font-bold text-white mb-2 text-tv5">1. Raw Input (Chaos)</h3>
                <p className="text-slate-400">
                    The "Data Stream" view shows reality. A standard recommender sees this as noise.
                </p>
             </div>
             <div>
                <h3 className="text-xl font-bold text-white mb-2 text-tv5">2. Vector Space (Order)</h3>
                <p className="text-slate-400">
                    Switch to "AI Segments". The model clusters these events. Click any node to see how the AI assigns a probability score to specific micro-segments.
                </p>
             </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg text-tv5">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Outliers are NOT Errors</h3>
                <p className="text-sm text-slate-400">
                  When "Dad" watches <em>Paw Patrol</em>, it's not a mistake. It identifies a <strong>Co-Viewing Segment</strong>. 
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-pink-500/20 rounded-lg text-pink-400">
                <Heart size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Temporal Context</h3>
                <p className="text-sm text-slate-400">
                  The "Date Night" cluster activates only on Friday/Saturday evenings.
                </p>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default HowTo;