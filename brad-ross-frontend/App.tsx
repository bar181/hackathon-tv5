import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import VideoCard from './components/VideoCard';
import HowTo from './components/HowTo';
import { UserPreferences, ContentItem, HistoryItem } from './types';
import { generatePersonalizedContent } from './services/gemini';
import { ArrowRight, Clock, ChevronRight, PlayCircle, Tag } from 'lucide-react';

// --- RICH MOCK DATA GENERATION ---

const MOCK_SHOWS = {
  dad: ["The Expanse", "Foundation", "Interstellar", "Dune", "Blade Runner 2049", "The Martian", "Cosmos", "Apollo 11"],
  kid: ["Bluey", "PAW Patrol", "Peppa Pig", "SpongeBob", "Pokemon", "Minions", "Frozen", "Encanto"],
  teen: ["Stranger Things", "Wednesday", "Euphoria", "Riverdale", "The Vampire Diaries", "Outer Banks", "Sex Education", "Gossip Girl"],
  romcom: ["The Notebook", "Love Actually", "Notting Hill", "About Time", "La La Land", "Crazy Stupid Love", "The Proposal", "Anyone But You"],
  canadian: ["Schitt's Creek", "Kim's Convenience", "Orphan Black", "Trailer Park Boys", "Degrassi", "Murdoch Mysteries", "Corner Gas", "Workin' Moms"],
  action: ["Die Hard", "Terminator 2", "The Matrix", "Speed", "Gladiator", "Braveheart", "Mission Impossible", "John Wick"]
};

// --- BEFORE VIEW GENERATION (CHAOTIC MIX) ---
const generateStandardCategories = () => {
  // Helper to get random items
  const getRandom = (arr: string[], count: number) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const categories = [
    { 
      name: "Top Picks for You", 
      // A jarring mix of Dad sci-fi and Kids cartoons
      pool: [...getRandom(MOCK_SHOWS.dad, 3), ...getRandom(MOCK_SHOWS.kid, 3), ...getRandom(MOCK_SHOWS.romcom, 2)],
      tag: "Based on View History"
    },
    { 
      name: "Location Popular", 
      pool: [...getRandom(MOCK_SHOWS.canadian, 4), ...getRandom(MOCK_SHOWS.teen, 4)],
      tag: "Location Popular"
    },
    { 
      name: "Because you watched Bluey", 
      pool: ["Peppa Pig", "Paw Patrol", "Thomas & Friends", "Cocomelon", "Mickey Mouse", "Sesame Street", "Dora", "Bubble Guppies"],
      tag: "Show Match"
    },
    { 
      name: "Because you watched The Expanse", 
      pool: ["Battlestar Galactica", "Firefly", "Stargate SG-1", "Babylon 5", "Altered Carbon", "Dark Matter", "Killjoys", "Continuum"],
      tag: "Show Match"
    },
    { 
      name: "Because you watched Euphoria", 
      pool: ["Skins", "Elite", "13 Reasons Why", "Gossip Girl", "Pretty Little Liars", "The O.C.", "One Tree Hill", "Degrassi"],
      tag: "Show Match"
    },
    { 
      name: "Because you watched The Notebook", 
      pool: ["A Walk to Remember", "Dear John", "Safe Haven", "The Vow", "Me Before You", "The Longest Ride", "Endless Love", "Midnight Sun"],
      tag: "Show Match"
    }
  ];

  return categories.map((cat, idx) => ({
    id: `cat-std-${idx}`,
    title: cat.name,
    items: cat.pool.map((title, i) => ({
      id: `show-std-${idx}-${i}`,
      title: title,
      description: `Watch ${title}.`,
      category: cat.tag,
      imageKeyword: title.split(' ')[0],
      duration: Math.random() > 0.5 ? `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 59)}m` : `${Math.floor(Math.random() * 50) + 20}m`
    }))
  }));
};

// --- AFTER VIEW GENERATION (SMART CONTEXT) ---
const generateSmartCategories = () => {
  const categories = [
    {
      title: "Hard Sci-Fi Picks",
      reason: "<Match: Dad Segment (Dominant)>",
      pool: MOCK_SHOWS.dad,
      tag: "Dad Segment"
    },
    {
      title: "Date Night Movies",
      reason: "<selected Friday night based on 'date night segment'>",
      pool: MOCK_SHOWS.romcom,
      tag: "Date Night"
    },
    {
      title: "Kids' Zone",
      reason: "<Context: Co-Viewing Segment detected>",
      pool: MOCK_SHOWS.kid,
      tag: "Co-Viewing"
    },
    {
      title: "Teen Drama Trends",
      reason: "<Context: Teen Segment activity>",
      pool: MOCK_SHOWS.teen,
      tag: "Teen Segment"
    },
    {
      title: "Toronto Originals",
      reason: "<Location: Toronto>",
      pool: MOCK_SHOWS.canadian,
      tag: "Local"
    },
    {
      title: "Space Operas",
      reason: "<Affinity: Dad - Deep Match>",
      pool: ["Star Trek", "Star Wars", "Andor", "Mandalorian", "Battlestar Galactica", "Firefly", "Dune", "Foundation"],
      tag: "Dad Segment"
    },
    {
      title: "90s Action Hits",
      reason: "<Affinity: Dad - Nostalgia>",
      pool: MOCK_SHOWS.action,
      tag: "Dad Segment"
    },
    {
      title: "Family Movie Night",
      reason: "<Time Context: Weekend>",
      pool: ["Shrek", "Toy Story", "Harry Potter", "Paddington", "Inside Out", "Coco", "Moana", "Zootopia"],
      tag: "Family Time"
    },
    {
      title: "Science Documentaries",
      reason: "<Affinity: Dad - Learning>",
      pool: ["Cosmos", "Planet Earth", "Black Holes", "The Universe", "Nova", "Mars", "Alien Worlds", "Our Planet"],
      tag: "Dad Segment"
    },
    {
      title: "Because you watched The Expanse",
      reason: "<Semantic Match: Political Sci-Fi>",
      pool: ["Babylon 5", "Deep Space Nine", "For All Mankind", "Westworld", "Severance", "Silo", "3 Body Problem", "Dark"],
      tag: "Deep Match"
    }
  ];

  return categories.map((cat, idx) => ({
    id: `cat-smart-${idx}`,
    title: cat.title,
    reason: cat.reason,
    items: cat.pool.slice(0, 8).map((title, i) => ({
      id: `show-smart-${idx}-${i}`,
      title: title,
      description: `Recommended for ${cat.tag}`,
      category: cat.tag,
      imageKeyword: title.split(' ')[0],
      duration: Math.random() > 0.5 ? `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 59)}m` : `${Math.floor(Math.random() * 50) + 20}m`,
      isAI: true
    }))
  }));
};

const generateHistory = (): HistoryItem[] => {
  const history: HistoryItem[] = [];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  for (let i = 0; i < 50; i++) {
    const r = Math.random();
    let type: 'Dad' | 'Kid' | 'Teen' | 'Family' = 'Dad';
    let title = "";
    
    // Weighted to match the "Visual Graph" in HowTo
    if (r < 0.5) { // 50% Dad
       type = 'Dad';
       title = MOCK_SHOWS.dad[Math.floor(Math.random() * MOCK_SHOWS.dad.length)];
    } else if (r < 0.75) { // 25% Kid/Co-viewing
       type = 'Kid';
       title = MOCK_SHOWS.kid[Math.floor(Math.random() * MOCK_SHOWS.kid.length)];
    } else if (r < 0.9) { // 15% Teen
       type = 'Teen';
       title = MOCK_SHOWS.teen[Math.floor(Math.random() * MOCK_SHOWS.teen.length)];
    } else { // 10% Date Night/Family
       type = 'Family';
       title = MOCK_SHOWS.romcom[Math.floor(Math.random() * MOCK_SHOWS.romcom.length)];
    }

    const day = days[Math.floor(Math.random() * days.length)];
    const hour = Math.floor(Math.random() * 12) + 1;
    const ampm = Math.random() > 0.5 ? "PM" : "AM";
    const episode = Math.floor(Math.random() * 12) + 1;
    const season = Math.floor(Math.random() * 3) + 1;
    
    history.push({
      id: `hist-${i}`,
      title,
      timestamp: `${day} ${hour}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')} ${ampm}`,
      details: type === 'Family' ? 'Movie' : `S${season}:E${episode}`,
      profile: type
    });
  }
  return history;
};

const STANDARD_CATEGORIES = generateStandardCategories();
const SMART_CATEGORIES = generateSmartCategories();
const HISTORY_DATA = generateHistory();

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'standard' | 'personalized' | 'howto'>('home');
  const [preferences, setPreferences] = useState<UserPreferences>({ interests: [] });

  // --- VIEWS ---

  const renderHome = () => (
    <div className="flex flex-col">
      <Hero />
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Welcome to the Future of Broadcast</h2>
        <p className="text-slate-400 mb-10 text-lg">
          Experience how TV5MONDE is moving from a cluttered "One-to-Many" broadcast model to a "One-to-One" personalized streaming experience powered by AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => setCurrentView('standard')}
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold border border-slate-700 transition-colors"
          >
            See Standard Experience
          </button>
          <button 
            onClick={() => setCurrentView('personalized')}
            className="px-8 py-4 bg-tv5 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            Try Personalization <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderStandard = () => (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 animate-fade-in flex flex-col md:flex-row gap-6">
      
      {/* LEFT COLUMN: Main Content (75%) */}
      <div className="w-full md:w-3/4 space-y-8 overflow-hidden">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white mb-2">Standard Broadcast View</h2>
          <p className="text-slate-400 text-sm">
            The algorithm struggles with the shared account. "Top Picks" is a chaotic mix of Sci-Fi, Cartoons, and Teen Drama because it treats all history as equal.
          </p>
        </div>

        {STANDARD_CATEGORIES.map((cat) => (
          <section key={cat.id} className="relative">
             <h3 className="text-lg font-bold text-slate-200 mb-3 flex items-center gap-2">
               {cat.title} <ChevronRight size={16} className="text-slate-500" />
             </h3>
             <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
               {cat.items.map(item => (
                 <div key={item.id} className="w-[200px] flex-shrink-0 snap-start">
                   <VideoCard item={item} />
                 </div>
               ))}
             </div>
          </section>
        ))}
      </div>

      {/* RIGHT COLUMN: History Panel (25%) */}
      <div className="w-full md:w-1/4 flex-shrink-0">
        <div className="sticky top-20 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-800 bg-slate-800/50">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Clock size={16} className="text-tv5" /> Recently Watched
            </h3>
            <p className="text-xs text-slate-400 mt-1">Raw Viewing History</p>
          </div>
          
          <div className="h-[calc(100vh-150px)] overflow-y-auto p-0">
            {HISTORY_DATA.map((item) => (
              <div key={item.id} className="p-3 border-b border-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer group flex gap-3 items-center">
                 {/* Placeholder for thumb */}
                 <div className="w-12 h-8 bg-slate-700 rounded flex-shrink-0 overflow-hidden relative">
                    <img 
                        src={`https://loremflickr.com/50/30/${item.title.split(' ')[0].replace(/[^a-zA-Z]/g, '')}?random=${item.id}`} 
                        className="w-full h-full object-cover opacity-60" 
                        alt="" 
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/50x30/1e293b/ffffff?text=TV`; }}
                    />
                 </div>
                 
                 <div className="flex-grow min-w-0">
                    <h4 className="text-sm font-medium text-slate-300 truncate group-hover:text-white transition-colors">
                      {item.title}
                    </h4>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 mt-0.5">
                      {/* BEFORE VIEW: NO PROFILE BADGE */}
                      <span>{item.details}</span>
                      <span>{item.timestamp}</span>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPersonalized = () => (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 animate-fade-in flex flex-col md:flex-row gap-6">
      
      {/* LEFT COLUMN: Main Content (75%) */}
      <div className="w-full md:w-3/4 space-y-8 overflow-hidden">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-tv5 mb-2">Personalized Context Stream</h2>
          <p className="text-slate-400 text-sm">
            Invisible Design: The AI infers distinct segments (Dad, Co-Viewing, Date Night) without asking.
          </p>
        </div>

        {SMART_CATEGORIES.map((cat) => (
          <section key={cat.id} className="relative">
             <div className="mb-3">
               <h3 className="text-lg font-bold text-white flex items-center gap-2">
                 {cat.title} 
                 <span className="text-slate-500 text-xs font-normal font-mono hidden sm:inline-block">
                    {cat.reason}
                 </span>
               </h3>
             </div>
             <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
               {cat.items.map(item => (
                 <div key={item.id} className="w-[200px] flex-shrink-0 snap-start">
                   <VideoCard item={item} />
                 </div>
               ))}
             </div>
          </section>
        ))}
      </div>

      {/* RIGHT COLUMN: History Panel (25%) */}
      <div className="w-full md:w-1/4 flex-shrink-0">
        <div className="sticky top-20 bg-slate-900 border border-tv5/30 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,174,239,0.1)]">
          <div className="p-4 border-b border-slate-800 bg-slate-800/80 backdrop-blur">
            <h3 className="font-bold text-white flex items-center gap-2">
              <PlayCircle size={16} className="text-tv5" /> Analyzed History
            </h3>
            <p className="text-xs text-tv5 mt-1">Segments Detected</p>
          </div>
          
          <div className="h-[calc(100vh-150px)] overflow-y-auto p-0">
            {HISTORY_DATA.map((item) => (
              <div key={`smart-${item.id}`} className="p-3 border-b border-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer group flex gap-3 items-center">
                 <div className="w-12 h-8 bg-slate-700 rounded flex-shrink-0 overflow-hidden relative">
                    <img 
                        src={`https://loremflickr.com/50/30/${item.title.split(' ')[0].replace(/[^a-zA-Z]/g, '')}?random=${item.id}`} 
                        className="w-full h-full object-cover opacity-60" 
                        alt="" 
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/50x30/1e293b/ffffff?text=TV`; }}
                    />
                 </div>
                 
                 <div className="flex-grow min-w-0">
                    <h4 className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
                      {item.title}
                    </h4>
                    
                    {/* AFTER VIEW: WITH PROFILE BADGE */}
                    <div className="flex justify-between items-center mt-1">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide ${
                        item.profile === 'Dad' ? 'bg-blue-900/40 text-blue-400 border border-blue-900' :
                        item.profile === 'Kid' ? 'bg-green-900/40 text-green-400 border border-green-900' :
                        item.profile === 'Teen' ? 'bg-purple-900/40 text-purple-400 border border-purple-900' :
                        'bg-pink-900/40 text-pink-400 border border-pink-900'
                      }`}>
                        {item.profile}
                      </span>
                      <span className="text-[10px] text-slate-500">{item.timestamp.split(' ')[0]}</span>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header onNavigate={setCurrentView} currentPage={currentView} />
      
      <main className="flex-grow">
        {currentView === 'home' && renderHome()}
        {currentView === 'standard' && renderStandard()}
        {currentView === 'personalized' && renderPersonalized()}
        {currentView === 'howto' && <HowTo />}
      </main>

      <footer className="bg-slate-950 border-t border-slate-900 py-8 text-center text-slate-600 text-sm">
        TV5MONDE Personalization Proof of Concept &bull; Powered by Google Gemini
      </footer>
    </div>
  );
};

export default App;