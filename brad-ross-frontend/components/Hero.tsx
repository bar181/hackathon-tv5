import React from 'react';
import { Play } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative w-full min-h-[500px] md:min-h-[600px] overflow-hidden bg-slate-950 text-white">
      {/* Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 flex flex-col md:flex-row items-center gap-8 md:gap-12">

        {/* Left Column - Text Content */}
        <div className="flex-1 animate-fade-in-up">
          <span className="bg-tv5 text-white text-xs font-bold px-2 py-1 uppercase tracking-widest mb-4 inline-block rounded-sm">
            The Concept
          </span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Personalization<br />
            <span className="text-tv5">Viewers don't watch TV alone.</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-xl leading-relaxed">
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

        {/* Right Column - Video */}
        <div className="flex-1 w-full md:w-auto">
          <div className="rounded-xl overflow-hidden shadow-2xl shadow-tv5/20 border border-slate-800">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto object-cover"
            >
              <source src="./assets/hackathon - I want with others.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;