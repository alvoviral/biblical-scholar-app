
import React, { useState, useEffect } from 'react';
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
  Share 
} from 'lucide-react';
import { toast } from 'sonner';

// Example Bible data (in a real app, this would come from an API)
const booksList = [
  { id: 'genesis', name: 'Gênesis', chapters: 50 },
  { id: 'exodus', name: 'Êxodo', chapters: 40 },
  { id: 'leviticus', name: 'Levítico', chapters: 27 },
  // More books would be added here
];

// Sample Bible text for Gênesis 1 (in a real app, this would come from an API)
const sampleBibleText = [
  { verse: 1, text: 'No princípio, criou Deus os céus e a terra.' },
  { verse: 2, text: 'A terra, porém, estava sem forma e vazia; havia trevas sobre a face do abismo, e o Espírito de Deus pairava sobre as águas.' },
  { verse: 3, text: 'Disse Deus: Haja luz. E houve luz.' },
  { verse: 4, text: 'Viu Deus que a luz era boa e fez separação entre a luz e as trevas.' },
  { verse: 5, text: 'E chamou Deus à luz Dia e às trevas, Noite. Houve tarde e manhã, o primeiro dia.' },
  { verse: 6, text: 'E disse Deus: Haja um firmamento no meio das águas e separação entre águas e águas.' },
  { verse: 7, text: 'Fez, pois, Deus o firmamento e separação entre as águas debaixo do firmamento e as águas sobre o firmamento. E assim se fez.' },
  { verse: 8, text: 'E chamou Deus ao firmamento Céus. Houve tarde e manhã, o segundo dia.' },
  { verse: 9, text: 'Disse também Deus: Ajuntem-se as águas debaixo dos céus num só lugar, e apareça a porção seca. E assim se fez.' },
  { verse: 10, text: 'À porção seca chamou Deus Terra e ao ajuntamento das águas, Mares. E viu Deus que isso era bom.' },
  // More verses would be added here
];

const Bible = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedBook, setSelectedBook] = useState(searchParams.get('book') || 'genesis');
  const [selectedChapter, setSelectedChapter] = useState(parseInt(searchParams.get('chapter') || '1', 10));
  const [isLoading, setIsLoading] = useState(true);
  const [bibleText, setBibleText] = useState<typeof sampleBibleText>([]);
  const [selectedVersion, setSelectedVersion] = useState('ara');
  
  // Find the selected book object
  const book = booksList.find(b => b.id === selectedBook) || booksList[0];
  
  // Generate array of chapter numbers based on the selected book
  const chapterNumbers = Array.from({ length: book.chapters }, (_, i) => i + 1);

  useEffect(() => {
    // In a real app, this would fetch from an API
    const fetchBibleText = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setBibleText(sampleBibleText);
      } catch (error) {
        console.error('Error fetching Bible text:', error);
        toast.error('Erro ao carregar o texto bíblico. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBibleText();
    // Update URL with current selection
    setSearchParams({ book: selectedBook, chapter: selectedChapter.toString() });
  }, [selectedBook, selectedChapter, setSearchParams, selectedVersion]);

  const handlePreviousChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
    } else {
      const currentIndex = booksList.findIndex(b => b.id === selectedBook);
      if (currentIndex > 0) {
        const prevBook = booksList[currentIndex - 1];
        setSelectedBook(prevBook.id);
        setSelectedChapter(prevBook.chapters);
      }
    }
  };

  const handleNextChapter = () => {
    if (selectedChapter < book.chapters) {
      setSelectedChapter(selectedChapter + 1);
    } else {
      const currentIndex = booksList.findIndex(b => b.id === selectedBook);
      if (currentIndex < booksList.length - 1) {
        setSelectedBook(booksList[currentIndex + 1].id);
        setSelectedChapter(1);
      }
    }
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
                  {booksList.map((book) => (
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
              <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Versão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ara">ARA</SelectItem>
                  <SelectItem value="acf">ACF</SelectItem>
                  <SelectItem value="nvi">NVI</SelectItem>
                  <SelectItem value="kjv">KJV</SelectItem>
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
          
          {/* Bible Content */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-bible-primary dark:text-bible-secondary">
                {book.name} {selectedChapter}
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
              ) : (
                // Bible verses
                bibleText.map((verse) => (
                  <div key={verse.verse} className="flex gap-2 group">
                    <span className="text-bible-secondary font-bold min-w-[24px] text-right">
                      {verse.verse}
                    </span>
                    <p className="flex-1">{verse.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePreviousChapter} 
              disabled={selectedBook === booksList[0].id && selectedChapter === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            <Button 
              variant="outline" 
              onClick={handleNextChapter}
              disabled={selectedBook === booksList[booksList.length - 1].id && 
                selectedChapter === booksList[booksList.length - 1].chapters}
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
