import React from 'react';
import { AVAILABLE_INTERESTS } from '../types';
import { Check, Sparkles } from 'lucide-react';

interface TopicSelectorProps {
  selectedInterests: string[];
  toggleInterest: (interest: string) => void;
  isGenerating: boolean;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ selectedInterests, toggleInterest, isGenerating }) => {
  return (
    <div className="bg-slate-900 p-6 border border-slate-800 rounded-xl mb-8 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-tv5/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="text-tv5" size={20} />
              AI Personalization Engine
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Select topics to generate a personalized video feed in real-time.
            </p>
          </div>
          {isGenerating && (
             <div className="flex items-center space-x-2 text-tv5 text-sm font-medium animate-pulse bg-tv5/10 px-3 py-1 rounded-full">
               <div className="w-2 h-2 bg-tv5 rounded-full animate-bounce" />
               <span>Generating recommendations...</span>
             </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {AVAILABLE_INTERESTS.map((interest) => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                  flex items-center space-x-2
                  ${isSelected 
                    ? 'bg-tv5 text-white border-tv5 shadow-[0_0_15px_rgba(0,174,239,0.4)]' 
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:border-slate-600'}
                `}
              >
                <span>{interest}</span>
                {isSelected && <Check size={14} strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopicSelector;