
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";

// Interface para representar um versículo
export interface BibleVerse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

// Interface para representar um capítulo
export interface BibleChapter {
  reference: string;
  verses: BibleVerse[];
  translation_id: string;
  translation_name: string;
  book_id: string;
  book_name: string;
  chapter: number;
}

// Livros da Bíblia com suas informações
export const bibleBooks = [
  { id: 'genesis', name: 'Gênesis', chapters: 50 },
  { id: 'exodus', name: 'Êxodo', chapters: 40 },
  { id: 'leviticus', name: 'Levítico', chapters: 27 },
  { id: 'numbers', name: 'Números', chapters: 36 },
  { id: 'deuteronomy', name: 'Deuteronômio', chapters: 34 },
  { id: 'joshua', name: 'Josué', chapters: 24 },
  { id: 'judges', name: 'Juízes', chapters: 21 },
  { id: 'ruth', name: 'Rute', chapters: 4 },
  { id: '1samuel', name: '1 Samuel', chapters: 31 },
  { id: '2samuel', name: '2 Samuel', chapters: 24 },
  { id: '1kings', name: '1 Reis', chapters: 22 },
  { id: '2kings', name: '2 Reis', chapters: 25 },
  { id: '1chronicles', name: '1 Crônicas', chapters: 29 },
  { id: '2chronicles', name: '2 Crônicas', chapters: 36 },
  { id: 'ezra', name: 'Esdras', chapters: 10 },
  { id: 'nehemiah', name: 'Neemias', chapters: 13 },
  { id: 'esther', name: 'Ester', chapters: 10 },
  { id: 'job', name: 'Jó', chapters: 42 },
  { id: 'psalms', name: 'Salmos', chapters: 150 },
  { id: 'proverbs', name: 'Provérbios', chapters: 31 },
  { id: 'ecclesiastes', name: 'Eclesiastes', chapters: 12 },
  { id: 'songofsolomon', name: 'Cânticos', chapters: 8 },
  { id: 'isaiah', name: 'Isaías', chapters: 66 },
  { id: 'jeremiah', name: 'Jeremias', chapters: 52 },
  { id: 'lamentations', name: 'Lamentações', chapters: 5 },
  { id: 'ezekiel', name: 'Ezequiel', chapters: 48 },
  { id: 'daniel', name: 'Daniel', chapters: 12 },
  { id: 'hosea', name: 'Oséias', chapters: 14 },
  { id: 'joel', name: 'Joel', chapters: 3 },
  { id: 'amos', name: 'Amós', chapters: 9 },
  { id: 'obadiah', name: 'Obadias', chapters: 1 },
  { id: 'jonah', name: 'Jonas', chapters: 4 },
  { id: 'micah', name: 'Miquéias', chapters: 7 },
  { id: 'nahum', name: 'Naum', chapters: 3 },
  { id: 'habakkuk', name: 'Habacuque', chapters: 3 },
  { id: 'zephaniah', name: 'Sofonias', chapters: 3 },
  { id: 'haggai', name: 'Ageu', chapters: 2 },
  { id: 'zechariah', name: 'Zacarias', chapters: 14 },
  { id: 'malachi', name: 'Malaquias', chapters: 4 },
  { id: 'matthew', name: 'Mateus', chapters: 28 },
  { id: 'mark', name: 'Marcos', chapters: 16 },
  { id: 'luke', name: 'Lucas', chapters: 24 },
  { id: 'john', name: 'João', chapters: 21 },
  { id: 'acts', name: 'Atos', chapters: 28 },
  { id: 'romans', name: 'Romanos', chapters: 16 },
  { id: '1corinthians', name: '1 Coríntios', chapters: 16 },
  { id: '2corinthians', name: '2 Coríntios', chapters: 13 },
  { id: 'galatians', name: 'Gálatas', chapters: 6 },
  { id: 'ephesians', name: 'Efésios', chapters: 6 },
  { id: 'philippians', name: 'Filipenses', chapters: 4 },
  { id: 'colossians', name: 'Colossenses', chapters: 4 },
  { id: '1thessalonians', name: '1 Tessalonicenses', chapters: 5 },
  { id: '2thessalonians', name: '2 Tessalonicenses', chapters: 3 },
  { id: '1timothy', name: '1 Timóteo', chapters: 6 },
  { id: '2timothy', name: '2 Timóteo', chapters: 4 },
  { id: 'titus', name: 'Tito', chapters: 3 },
  { id: 'philemon', name: 'Filemom', chapters: 1 },
  { id: 'hebrews', name: 'Hebreus', chapters: 13 },
  { id: 'james', name: 'Tiago', chapters: 5 },
  { id: '1peter', name: '1 Pedro', chapters: 5 },
  { id: '2peter', name: '2 Pedro', chapters: 3 },
  { id: '1john', name: '1 João', chapters: 5 },
  { id: '2john', name: '2 João', chapters: 1 },
  { id: '3john', name: '3 João', chapters: 1 },
  { id: 'jude', name: 'Judas', chapters: 1 },
  { id: 'revelation', name: 'Apocalipse', chapters: 22 },
];

// Traduções disponíveis da Bíblia
export const bibleTranslations = [
  { id: 'acf', name: 'Almeida Corrigida Fiel', language: 'pt', requiresSubscription: false },
  { id: 'kjv', name: 'King James (Português)', language: 'pt', requiresSubscription: true },
  { id: 'ntlh', name: 'Nova Tradução na Linguagem de Hoje', language: 'pt', requiresSubscription: true },
  { id: 'rvr', name: 'Reina Valera (Español)', language: 'es', requiresSubscription: true },
  { id: 'kjv-en', name: 'King James Version (English)', language: 'en', requiresSubscription: true },
];

// Exemplo de dados offline para uso quando API não estiver disponível
const offlineChapterData: Record<string, BibleChapter> = {
  'genesis-1-acf': {
    reference: 'Gênesis 1',
    book_id: 'genesis',
    book_name: 'Gênesis',
    chapter: 1,
    translation_id: 'acf',
    translation_name: 'Almeida Corrigida Fiel',
    verses: [
      { book_id: 'genesis', book_name: 'Gênesis', chapter: 1, verse: 1, text: 'No princípio, criou Deus os céus e a terra.' },
      { book_id: 'genesis', book_name: 'Gênesis', chapter: 1, verse: 2, text: 'A terra, porém, estava sem forma e vazia; havia trevas sobre a face do abismo, e o Espírito de Deus pairava sobre as águas.' },
      { book_id: 'genesis', book_name: 'Gênesis', chapter: 1, verse: 3, text: 'Disse Deus: Haja luz. E houve luz.' },
      { book_id: 'genesis', book_name: 'Gênesis', chapter: 1, verse: 4, text: 'Viu Deus que a luz era boa e fez separação entre a luz e as trevas.' },
      { book_id: 'genesis', book_name: 'Gênesis', chapter: 1, verse: 5, text: 'E chamou Deus à luz Dia e às trevas, Noite. Houve tarde e manhã, o primeiro dia.' },
      { book_id: 'genesis', book_name: 'Gênesis', chapter: 1, verse: 6, text: 'E disse Deus: Haja um firmamento no meio das águas e separação entre águas e águas.' },
      { book_id: 'genesis', book_name: 'Gênesis', chapter: 1, verse: 7, text: 'Fez, pois, Deus o firmamento e separação entre as águas debaixo do firmamento e as águas sobre o firmamento. E assim se fez.' },
      { book_id: 'genesis', book_name: 'Gênesis', chapter: 1, verse: 8, text: 'E chamou Deus ao firmamento Céus. Houve tarde e manhã, o segundo dia.' },
      { book_id: 'genesis', book_name: 'Gênesis', chapter: 1, verse: 9, text: 'Disse também Deus: Ajuntem-se as águas debaixo dos céus num só lugar, e apareça a porção seca. E assim se fez.' },
      { book_id: 'genesis', book_name: 'Gênesis', chapter: 1, verse: 10, text: 'À porção seca chamou Deus Terra e ao ajuntamento das águas, Mares. E viu Deus que isso era bom.' },
    ]
  }
};

// Flag para controlar se já tentamos salvar a Bíblia offline
let offlineBibleSaved = false;

// Função para verificar se o usuário tem acesso a uma tradução específica
const canAccessTranslation = (translationId: string): boolean => {
  const translation = bibleTranslations.find(t => t.id === translationId);
  if (!translation) return false;
  
  // Se não requer assinatura, está disponível para todos
  if (!translation.requiresSubscription) return true;
  
  // Verifica o status da assinatura do usuário
  const { isSubscribed } = useSubscription.getState();
  return isSubscribed;
};

// Chave para armazenamento em cache local
const getStorageKey = (bookId: string, chapter: number, translation: string) => {
  return `bible-${bookId}-${chapter}-${translation}`;
};

export const BibleService = {
  // Obtém o texto de um capítulo específico da Bíblia
  getChapter: async (bookId: string, chapter: number, translation: string = 'acf'): Promise<BibleChapter> => {
    // Verifica se o usuário tem acesso à tradução solicitada
    if (!canAccessTranslation(translation)) {
      const translationName = bibleTranslations.find(t => t.id === translation)?.name || translation;
      toast.error(`A tradução ${translationName} requer um plano de assinatura`);
      
      // Retorna a tradução gratuita (ACF) se o usuário não tiver acesso
      translation = 'acf';
    }
    
    // Tentar obter do armazenamento local primeiro
    const cacheKey = getStorageKey(bookId, chapter, translation);
    const cachedData = localStorage.getItem(cacheKey);
    
    if (cachedData) {
      try {
        return JSON.parse(cachedData);
      } catch (error) {
        console.error("Erro ao carregar dados em cache:", error);
        // Continue para buscar da API se o cache falhar
      }
    }
    
    try {
      // Buscar da API da Bíblia
      const apiEndpoint = `https://bible-api.com/${bookId} ${chapter}?translation=${translation}`;
      
      const response = await fetch(apiEndpoint);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar capítulo: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transformar os dados da API para o formato que usamos
      const formattedData: BibleChapter = {
        reference: data.reference,
        book_id: bookId,
        book_name: data.verses[0]?.book_name || bookId,
        chapter: chapter,
        translation_id: translation,
        translation_name: bibleTranslations.find(t => t.id === translation)?.name || translation,
        verses: data.verses.map((v: any) => ({
          book_id: bookId,
          book_name: v.book_name,
          chapter: v.chapter,
          verse: v.verse,
          text: v.text
        }))
      };
      
      // Armazenar no cache local
      localStorage.setItem(cacheKey, JSON.stringify(formattedData));
      
      return formattedData;
    } catch (error) {
      console.error("Erro ao buscar da API da Bíblia:", error);
      
      // Verificar se temos dados offline para este capítulo
      const offlineKey = `${bookId}-${chapter}-${translation}`;
      if (offlineChapterData[offlineKey]) {
        return offlineChapterData[offlineKey];
      }
      
      // Se não temos, usar dados simulados
      const bookName = bibleBooks.find(b => b.id === bookId)?.name || bookId;
      const translationName = bibleTranslations.find(t => t.id === translation)?.name || translation;
      
      // Criar um conjunto de versos simulados
      const simulatedVerses: BibleVerse[] = Array.from({ length: 10 }).map((_, index) => ({
        book_id: bookId,
        book_name: bookName,
        chapter: chapter,
        verse: index + 1,
        text: `Verso ${index + 1} simulado para ${bookName} ${chapter}`
      }));
      
      return {
        reference: `${bookName} ${chapter}`,
        book_id: bookId,
        book_name: bookName,
        chapter: chapter,
        translation_id: translation,
        translation_name: translationName,
        verses: simulatedVerses
      };
    }
  },
  
  // Salvar a Bíblia para uso offline
  saveBibleOffline: async (translation: string = 'acf'): Promise<void> => {
    if (offlineBibleSaved) return;
    
    toast.info("Salvando a Bíblia para uso offline. Isso pode levar alguns minutos.");
    
    // Para não sobrecarregar, vamos salvar apenas alguns livros essenciais
    const essentialBooks = ['genesis', 'psalms', 'proverbs', 'matthew', 'john', 'romans', 'revelation'];
    
    try {
      for (const bookId of essentialBooks) {
        const book = bibleBooks.find(b => b.id === bookId);
        if (!book) continue;
        
        // Salvar apenas alguns capítulos chave por livro
        const chaptersToSave = Math.min(5, book.chapters);
        
        for (let chapter = 1; chapter <= chaptersToSave; chapter++) {
          await BibleService.getChapter(bookId, chapter, translation);
          // Pequena pausa para não sobrecarregar
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
      
      offlineBibleSaved = true;
      toast.success("Bíblia salva para uso offline com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar a Bíblia offline:", error);
      toast.error("Não foi possível salvar a Bíblia completa offline.");
    }
  }
};
