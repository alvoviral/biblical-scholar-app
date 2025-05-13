
import React from 'react';
import { Hymn } from '@/types/hymn';
import { Button } from "@/components/ui/button";
import { Star, StarOff } from 'lucide-react';

interface HymnItemProps {
  hymn: Hymn;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: (hymn: Hymn) => void;
  onToggleFavorite: (hymn: Hymn) => void;
}

const HymnItem: React.FC<HymnItemProps> = ({
  hymn,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite
}) => {
  return (
    <div 
      className={`flex items-center p-2 rounded-md mb-1 ${isSelected ? 'bg-secondary' : 'hover:bg-accent'}`}
    >
      <div 
        className="flex-1 cursor-pointer"
        onClick={() => onSelect(hymn)}
      >
        <span className="font-bold mr-2">{hymn.number}.</span>
        <span className="truncate">{hymn.title}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(hymn);
        }}
      >
        {isFavorite ? (
          <Star className="h-4 w-4 fill-bible-secondary text-bible-secondary" />
        ) : (
          <StarOff className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default HymnItem;
