
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Search, Star, Music, ChevronLeft, ChevronRight, StarOff, Download } from 'lucide-react';

// Example Harpa Cristã data
const sampleHymns = Array.from({ length: 640 }, (_, i) => ({
  numero: i + 1,
  titulo: `Hino ${i + 1}`,
  letra: `Exemplo de letra do hino ${i + 1}.\nSegunda linha do hino ${i + 1}.\nTerceira linha do hino ${i + 1}.\nQuarta linha do hino ${i + 1}.`,
}));

// This would be stored in local storage in a real app
const initialFavorites = [1, 25, 380];

const Harpa = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hymns, setHymns] = useState<typeof sampleHymns>([]);
  const [favorites, setFavorites] = useState<number[]>(initialFavorites);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'all');
  const [selectedHymn, setSelectedHymn] = useState<typeof sampleHymns[0] | null>(null);

  // Initialize with hymn from URL or null
  useEffect(() => {
    const hymnId = searchParams.get('hymn');
    if (hymnId && !isNaN(parseInt(hymnId))) {
      const hymn = sampleHymns.find(h => h.numero === parseInt(hymnId));
      if (hymn) {
        setSelectedHymn(hymn);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    // In a real app, this would fetch from an API
    const fetchHymns = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setHymns(sampleHymns);
      } catch (error) {
        console.error('Error fetching hymns:', error);
        toast.error('Erro ao carregar os hinos. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHymns();
  }, []);

  // Filter hymns based on search and active tab
  const filteredHymns = hymns.filter(hymn => {
    const matchesSearch = 
      hymn.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
      hymn.numero.toString().includes(searchTerm);
    
    if (activeTab === 'favorites') {
      return matchesSearch && favorites.includes(hymn.numero);
    }
    return matchesSearch;
  });

  const handleSelectHymn = (hymn: typeof sampleHymns[0]) => {
    setSelectedHymn(hymn);
    setSearchParams({ tab: activeTab, hymn: hymn.numero.toString() });
  };

  const handleToggleFavorite = (numero: number) => {
    let newFavorites = [...favorites];
    
    if (favorites.includes(numero)) {
      newFavorites = newFavorites.filter(n => n !== numero);
      toast.success('Hino removido dos favoritos');
    } else {
      newFavorites.push(numero);
      toast.success('Hino adicionado aos favoritos');
    }
    
    setFavorites(newFavorites);
    // In a real app, this would be saved to local storage or backend
  };

  const handleChangeTab = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value, ...(selectedHymn && { hymn: selectedHymn.numero.toString() }) });
  };

  const handleNextHymn = () => {
    if (!selectedHymn) return;
    
    const currentIndex = hymns.findIndex(h => h.numero === selectedHymn.numero);
    if (currentIndex < hymns.length - 1) {
      handleSelectHymn(hymns[currentIndex + 1]);
    }
  };

  const handlePrevHymn = () => {
    if (!selectedHymn) return;
    
    const currentIndex = hymns.findIndex(h => h.numero === selectedHymn.numero);
    if (currentIndex > 0) {
      handleSelectHymn(hymns[currentIndex - 1]);
    }
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
          onClick={() => toast.success("Harpa Cristã disponível offline!")}
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
            
            <ScrollArea className="h-[60vh]">
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
                    <Button
                      key={hymn.numero}
                      variant={selectedHymn?.numero === hymn.numero ? "secondary" : "ghost"}
                      className="w-full justify-between mb-1 text-left"
                      onClick={() => handleSelectHymn(hymn)}
                    >
                      <span className="truncate flex-1">
                        <span className="font-bold mr-2">{hymn.numero}.</span>
                        {hymn.titulo}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(hymn.numero);
                        }}
                      >
                        {favorites.includes(hymn.numero) ? (
                          <Star className="h-4 w-4 fill-bible-secondary text-bible-secondary" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                    </Button>
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
            {selectedHymn ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">
                    {selectedHymn.numero}. {selectedHymn.titulo}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleFavorite(selectedHymn.numero)}
                  >
                    {favorites.includes(selectedHymn.numero) ? (
                      <Star className="h-5 w-5 fill-bible-secondary text-bible-secondary" />
                    ) : (
                      <Star className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                
                <div className="whitespace-pre-line mb-8">
                  {selectedHymn.letra}
                </div>
                
                <div className="flex justify-between mt-4">
                  <Button 
                    variant="outline" 
                    onClick={handlePrevHymn} 
                    disabled={selectedHymn.numero === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Anterior
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleNextHymn}
                    disabled={selectedHymn.numero === hymns.length}
                  >
                    Próximo
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
                <Music className="h-16 w-16 mb-4 opacity-20" />
                <p className="text-center">Selecione um hino para visualizar</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Harpa;
