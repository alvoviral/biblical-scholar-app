
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Search, Music, Download } from 'lucide-react';
import HymnItem from '@/components/hymns/HymnItem';
import HymnContent from '@/components/hymns/HymnContent';
import { HymnService } from '@/services/HymnService';
import { Hymn } from '@/types/hymn';

const Harpa = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [favorites, setFavorites] = useState<number[]>(() => {
    const savedFavorites = localStorage.getItem('harpa-favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'all');
  const [selectedHymn, setSelectedHymn] = useState<Hymn | null>(null);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('harpa-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Fetch hymns from API
  useEffect(() => {
    const fetchHymns = async () => {
      setIsLoading(true);
      try {
        const data = await HymnService.getAllHymns();
        setHymns(data);
        
        // Initialize selectedHymn from URL if present
        const hymnId = searchParams.get('hymn');
        if (hymnId && !isNaN(parseInt(hymnId))) {
          const hymnNumber = parseInt(hymnId);
          const hymn = data.find(h => h.number === hymnNumber);
          if (hymn) {
            setSelectedHymn(hymn);
          }
        }
      } catch (error) {
        console.error('Error fetching hymns:', error);
        toast.error('Erro ao carregar os hinos. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHymns();
  }, [searchParams]);

  // Filter hymns based on search and active tab
  const filteredHymns = hymns.filter(hymn => {
    const matchesSearch = 
      hymn.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      hymn.number.toString().includes(searchTerm);
    
    if (activeTab === 'favorites') {
      return matchesSearch && favorites.includes(hymn.number);
    }
    return matchesSearch;
  });

  const handleSelectHymn = useCallback((hymn: Hymn) => {
    setSelectedHymn(hymn);
    setSearchParams({ tab: activeTab, hymn: hymn.number.toString() });
  }, [activeTab, setSearchParams]);

  const handleToggleFavorite = useCallback((hymn: Hymn) => {
    let newFavorites = [...favorites];
    
    if (favorites.includes(hymn.number)) {
      newFavorites = newFavorites.filter(n => n !== hymn.number);
      toast.success('Hino removido dos favoritos');
    } else {
      newFavorites.push(hymn.number);
      toast.success('Hino adicionado aos favoritos');
    }
    
    setFavorites(newFavorites);
  }, [favorites]);

  const handleChangeTab = useCallback((value: string) => {
    setActiveTab(value);
    setSearchParams({ 
      tab: value, 
      ...(selectedHymn && { hymn: selectedHymn.number.toString() }) 
    });
  }, [selectedHymn, setSearchParams]);

  const handleNextHymn = useCallback(() => {
    if (!selectedHymn || !hymns.length) return;
    
    const currentIndex = hymns.findIndex(h => h.number === selectedHymn.number);
    if (currentIndex < hymns.length - 1) {
      handleSelectHymn(hymns[currentIndex + 1]);
    }
  }, [selectedHymn, hymns, handleSelectHymn]);

  const handlePrevHymn = useCallback(() => {
    if (!selectedHymn || !hymns.length) return;
    
    const currentIndex = hymns.findIndex(h => h.number === selectedHymn.number);
    if (currentIndex > 0) {
      handleSelectHymn(hymns[currentIndex - 1]);
    }
  }, [selectedHymn, hymns, handleSelectHymn]);

  const handleSaveOffline = () => {
    localStorage.setItem('harpa-offline-hymns', JSON.stringify(hymns));
    toast.success("Harpa Cristã disponível offline!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 app-container">
        <h1 className="text-xl font-bold mb-4 text-bible-primary dark:text-bible-secondary flex items-center">
          <Music className="mr-2" /> Harpa Cristã
        </h1>
        
        <Button 
          variant="outline" 
          className="mb-4 w-full flex justify-center items-center gap-2"
          onClick={handleSaveOffline}
        >
          <Download className="h-4 w-4" /> Salvar Harpa Offline
        </Button>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Hymn List Panel */}
          <div className="w-full md:w-1/3">
            <div className="mb-4 relative">
              <Input
                placeholder="Buscar por número ou título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            </div>
            
            <Tabs value={activeTab} onValueChange={handleChangeTab} className="mb-4">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">Todos</TabsTrigger>
                <TabsTrigger value="favorites" className="flex-1">Favoritos</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <ScrollArea className="h-[60vh] border rounded-md p-2">
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className="mb-2">
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))
              ) : (
                filteredHymns.length > 0 ? (
                  filteredHymns.map((hymn) => (
                    <HymnItem
                      key={hymn.id}
                      hymn={hymn}
                      isSelected={selectedHymn?.number === hymn.number}
                      isFavorite={favorites.includes(hymn.number)}
                      onSelect={handleSelectHymn}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    {activeTab === 'favorites' && favorites.length === 0 
                      ? 'Você não tem hinos favoritos ainda.' 
                      : 'Nenhum hino encontrado.'}
                  </div>
                )
              )}
            </ScrollArea>
          </div>
          
          {/* Hymn Content Panel */}
          <div className="w-full md:w-2/3 border rounded-lg p-4">
            <HymnContent
              hymn={selectedHymn}
              isFavorite={selectedHymn ? favorites.includes(selectedHymn.number) : false}
              onToggleFavorite={handleToggleFavorite}
              onPrevHymn={handlePrevHymn}
              onNextHymn={handleNextHymn}
              hasPrev={!!selectedHymn && hymns.findIndex(h => h.number === selectedHymn.number) > 0}
              hasNext={!!selectedHymn && hymns.findIndex(h => h.number === selectedHymn.number) < hymns.length - 1}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Harpa;
