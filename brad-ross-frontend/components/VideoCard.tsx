import React from 'react';
import { ContentItem } from '../types';
import { Play, Star } from 'lucide-react';

interface VideoCardProps {
  item: ContentItem;
  layout?: 'vertical' | 'horizontal';
}

const VideoCard: React.FC<VideoCardProps> = ({ item, layout = 'vertical' }) => {
  // Use loremflickr for more reliable hotlinking than picsum in some deployments
  // Adding lock/random param ensures variety
  const imageUrl = `https://loremflickr.com/400/225/${item.imageKeyword}?random=${item.id}`;

  return (
    <div className="group relative flex flex-col bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/50 hover:z-10">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          onError={(e) => {
            // Fallback if image fails
            (e.target as HTMLImageElement).src = `https://placehold.co/400x225/1e293b/ffffff?text=${item.title.substring(0,10)}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
        
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded border border-white/10">
          {item.duration}
        </div>
        
        {item.isAI && (
          <div className="absolute top-2 left-2 bg-tv5 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1">
             <Star size={10} fill="currentColor" /> FOR YOU
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/20 backdrop-blur-md rounded-full p-3 border border-white/50">
            <Play size={24} className="text-white ml-1" fill="white" />
          </div>
        </div>
      </div>
      
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-1">
           <span className="text-tv5 text-[10px] font-bold uppercase tracking-widest">
            {item.category}
          </span>
        </div>
        
        <h3 className="text-gray-100 font-bold text-sm leading-tight mb-2 line-clamp-2">
          {item.title}
        </h3>
        <p className="text-gray-400 text-xs line-clamp-2">
          {item.description}
        </p>
      </div>
    </div>
  );
};

export default VideoCard;