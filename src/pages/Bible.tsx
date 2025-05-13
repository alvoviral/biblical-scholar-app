
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Headphones, 
  BookMarked, 
  Share,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { useSubscription } from '@/hooks/useSubscription';
import { BibleService, bibleBooks, bibleTranslations, BibleChapter } from '@/services/BibleService';

const Bible = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedBook, setSelectedBook] = useState(searchParams.get('book') || 'genesis');
  const [selectedChapter, setSelectedChapter] = useState(parseInt(searchParams.get('chapter') || '1', 10));
  const [isLoading, setIsLoading] = useState(true);
  const [bibleText, setBibleText] = useState<BibleChapter | null>(null);
  const [selectedVersion, setSelectedVersion] = useState(searchParams.get('version') || 'acf');
  const { isSubscribed } = useSubscription();
  
  // Find the selected book object
  const book = bibleBooks.find(b => b.id === selectedBook) || bibleBooks[0];
  
  // Generate array of chapter numbers based on the selected book
  const chapterNumbers = Array.from({ length: book.chapters }, (_, i) => i + 1);

  // Fetch Bible text when selection changes
  const fetchBibleText = useCallback(async () => {
    if (!selectedBook || !selectedChapter) return;
    
    setIsLoading(true);
    try {
      const chapterData = await BibleService.getChapter(selectedBook, selectedChapter, selectedVersion);
      setBibleText(chapterData);
    } catch (error) {
      console.error('Error fetching Bible text:', error);
      toast.error('Erro ao carregar o texto bíblico. Tente novamente.');
      setBibleText(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedBook, selectedChapter, selectedVersion]);

  // Effect to fetch Bible text when selection changes
  useEffect(() => {
    // Update URL with current selection first
    setSearchParams({ 
      book: selectedBook, 
      chapter: selectedChapter.toString(),
      version: selectedVersion
    });
    
    // Fetch the Bible text
    fetchBibleText();
  }, [selectedBook, selectedChapter, selectedVersion, setSearchParams, fetchBibleText]);

  const handlePreviousChapter = useCallback(() => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
    } else {
      const currentIndex = bibleBooks.findIndex(b => b.id === selectedBook);
      if (currentIndex > 0) {
        const prevBook = bibleBooks[currentIndex - 1];
        setSelectedBook(prevBook.id);
        setSelectedChapter(prevBook.chapters);
      }
    }
  }, [selectedBook, selectedChapter]);

  const handleNextChapter = useCallback(() => {
    if (selectedChapter < book.chapters) {
      setSelectedChapter(selectedChapter + 1);
    } else {
      const currentIndex = bibleBooks.findIndex(b => b.id === selectedBook);
      if (currentIndex < bibleBooks.length - 1) {
        setSelectedBook(bibleBooks[currentIndex + 1].id);
        setSelectedChapter(1);
      }
    }
  }, [selectedBook, selectedChapter, book.chapters]);

  const handleSaveBibleOffline = async () => {
    await BibleService.saveBibleOffline(selectedVersion);
  };

  const handleVersionChange = (version: string) => {
    // Verificar se o usuário tem acesso à versão
    const translation = bibleTranslations.find(t => t.id === version);
    
    if (translation?.requiresSubscription && !isSubscribed) {
      toast.error(`A tradução ${translation.name} está disponível apenas para assinantes.`);
      return;
    }
    
    setSelectedVersion(version);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 app-container pb-20">
        <div className="flex flex-col">
          {/* Bible Navigation Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 sticky top-[57px] bg-background pt-4 pb-2 z-10">
            <div className="flex-1 flex gap-2">
              <Select value={selectedBook} onValueChange={setSelectedBook}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um livro" />
                </SelectTrigger>
                <SelectContent>
                  {bibleBooks.map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      {book.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={selectedChapter.toString()} 
                onValueChange={(value) => setSelectedChapter(parseInt(value, 10))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Cap." />
                </SelectTrigger>
                <SelectContent>
                  {chapterNumbers.map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedVersion} onValueChange={handleVersionChange}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Versão" />
                </SelectTrigger>
                <SelectContent>
                  {bibleTranslations.map((translation) => (
                    <SelectItem 
                      key={translation.id} 
                      value={translation.id} 
                      disabled={translation.requiresSubscription && !isSubscribed}
                    >
                      {translation.id.toUpperCase()}
                      {translation.requiresSubscription && !isSubscribed && " 🔒"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="ghost" size="icon" onClick={() => toast.info("Busca bíblica em breve disponível.")}>
                <Search className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="icon" onClick={() => toast.info("Áudio Bíblia em breve disponível.")}>
                <Headphones className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="icon" onClick={() => toast.info("Planos de leitura em breve disponíveis.")}>
                <BookMarked className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="mb-4 w-full flex justify-center items-center gap-2"
            onClick={handleSaveBibleOffline}
          >
            <Download className="h-4 w-4" /> Salvar Bíblia Offline
          </Button>
          
          {/* Bible Content */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-bible-primary dark:text-bible-secondary">
                {bibleText?.reference || `${book.name} ${selectedChapter}`}
              </h1>
              <Button variant="ghost" size="icon" onClick={() => toast.success("Capítulo compartilhado!")}>
                <Share className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className="flex gap-4">
                    <Skeleton className="h-6 w-6" />
                    <Skeleton className="h-6 flex-1" />
                  </div>
                ))
              ) : bibleText?.verses?.length ? (
                // Bible verses
                bibleText.verses.map((verse) => (
                  <div key={verse.verse} className="flex gap-2 group">
                    <span className="text-bible-secondary font-bold min-w-[24px] text-right">
                      {verse.verse}
                    </span>
                    <p className="flex-1">{verse.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Não foi possível carregar o texto bíblico.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={fetchBibleText}
                  >
                    Tentar novamente
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePreviousChapter} 
              disabled={selectedBook === bibleBooks[0].id && selectedChapter === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            <Button 
              variant="outline" 
              onClick={handleNextChapter}
              disabled={selectedBook === bibleBooks[bibleBooks.length - 1].id && 
                selectedChapter === bibleBooks[bibleBooks.length - 1].chapters}
            >
              Próximo
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Bible;
