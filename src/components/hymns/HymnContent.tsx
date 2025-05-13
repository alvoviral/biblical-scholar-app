
import React from 'react';
import { Hymn } from '@/types/hymn';
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight, Music } from 'lucide-react';

interface HymnContentProps {
  hymn: Hymn | null;
  isFavorite: boolean;
  onToggleFavorite: (hymn: Hymn) => void;
  onPrevHymn: () => void;
  onNextHymn: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

const HymnContent: React.FC<HymnContentProps> = ({
  hymn,
  isFavorite,
  onToggleFavorite,
  onPrevHymn,
  onNextHymn,
  hasPrev,
  hasNext
}) => {
  if (!hymn) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
        <Music className="h-16 w-16 mb-4 opacity-20" />
        <p className="text-center">Selecione um hino para visualizar</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {hymn.number}. {hymn.title}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onToggleFavorite(hymn)}
        >
          <Star className={`h-5 w-5 ${isFavorite ? "fill-bible-secondary text-bible-secondary" : ""}`} />
        </Button>
      </div>
      
      <div className="whitespace-pre-line mb-8">
        {hymn.verses.map((verse, index) => (
          <p key={index} className="mb-2">{verse}</p>
        ))}
      </div>
      
      <div className="flex justify-between mt-4">
        <Button 
          variant="outline" 
          onClick={onPrevHymn} 
          disabled={!hasPrev}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>
        <Button 
          variant="outline" 
          onClick={onNextHymn}
          disabled={!hasNext}
        >
          Próximo
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </>
  );
};

export default HymnContent;
