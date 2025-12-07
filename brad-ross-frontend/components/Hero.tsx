import React from 'react';
import { Play } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-gray-900 text-white">
      {/* Background Image - Using High Quality Unsplash Image to avoid 403s on video hotlinking */}
      <img 
        src="https://images.unsplash.com/photo-1593784991095-a20506948430?q=80&w=2670&auto=format&fit=crop"
        alt="Family watching TV"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-7xl mx-auto flex flex-col justify-end h-full">
        <div className="animate-fade-in-up">
          <span className="bg-tv5 text-white text-xs font-bold px-2 py-1 uppercase tracking-widest mb-4 inline-block rounded-sm">
            The Concept
          </span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 max-w-3xl">
            Personalization<br />
            <span className="text-tv5">Viewers don't watch TV alone.</span>
          </h1>
          <p className="text-gray-200 text-lg md:text-xl mb-8 max-w-2xl leading-relaxed text-shadow-sm">
            Traditional algorithms assume one profile = one person. 
            Our new AI engine recommends based on the real world: shared remotes, family nights, and chaotic viewing habits.
          </p>
          <div className="flex flex-wrap gap-4">
             <button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3.5 font-bold rounded-lg flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-white/10">
               <Play size={20} className="fill-current" />
               Watch Concept Demo
             </button>
             <button className="bg-slate-800/80 backdrop-blur-md border border-slate-600 text-white hover:bg-slate-700/80 px-8 py-3.5 font-bold rounded-lg transition-colors">
               Read Whitepaper
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;