
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { 
  CalendarDays, 
  Heart, 
  CalendarIcon, 
  Share, 
  BookOpen,
  Bell,
  HeartOff
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Devotional {
  id: string;
  date: Date;
  verse: string;
  reference: string;
  title: string;
  content: string;
  imageUrl?: string;
}

const DailyBread = () => {
  const [devotional, setDevotional] = useState<Devotional | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date>(new Date());
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchDevotional = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would fetch from an API with the selected date
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Sample devotional data
        setDevotional({
          id: '1',
          date: new Date(),
          verse: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.',
          reference: 'João 3:16',
          title: 'O Amor de Deus',
          content: 'Nenhum versículo resume tão bem o evangelho quanto João 3:16. O amor de Deus é tão vasto que Ele deu Seu único Filho por nós. Este versículo nos lembra que a salvação é para todos, mas é recebida individualmente pela fé. "Todo aquele" é um convite universal para crer em Jesus e receber a vida eterna.\n\nQuando nos sentimos indignos ou distantes, podemos nos lembrar que o amor de Deus não é baseado em nossos méritos, mas em Sua graça infinita. Hoje, reflita sobre este amor incomparável e deixe que ele transforme sua maneira de ver a Deus e aos outros.',
          imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80'
        });
      } catch (error) {
        console.error('Error fetching devotional:', error);
        toast.error('Erro ao carregar o devocional. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevotional();
  }, [date]);

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite 
      ? 'Devocional removido dos favoritos' 
      : 'Devocional adicionado aos favoritos');
    // In a real app, this would save to local storage or backend
  };

  const handleSubscribeNotifications = () => {
    toast.success('Você receberá notificações diárias do Pão Diário!');
    // In a real app, this would register for push notifications
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 app-container">
        <h1 className="text-xl font-bold mb-4 text-bible-primary dark:text-bible-secondary flex items-center">
          <CalendarDays className="mr-2" /> Pão Diário
        </h1>
        
        <div className="flex justify-between items-center mb-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="justify-start text-left font-normal w-[240px]"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : <span>Selecione uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSubscribeNotifications}
          >
            <Bell className="mr-2 h-4 w-4" />
            Notificações
          </Button>
        </div>
        
        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-[250px] mb-2" />
              <Skeleton className="h-6 w-[300px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-[80%]" />
            </CardContent>
          </Card>
        ) : devotional ? (
          <Card className="animate-fade-in">
            {devotional.imageUrl && (
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src={devotional.imageUrl}
                  alt={devotional.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardDescription>
                {format(devotional.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </CardDescription>
              <CardTitle className="text-bible-primary dark:text-bible-secondary">
                {devotional.title}
              </CardTitle>
              <div className="flex items-center text-bible-secondary font-medium italic">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>
                  {devotional.verse} — {devotional.reference}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{devotional.content}</p>
            </CardContent>
            <CardFooter className="flex justify-between pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="flex gap-2 items-center"
                onClick={handleFavoriteToggle}
              >
                {isFavorite ? (
                  <>
                    <HeartOff className="h-4 w-4" />
                    Remover Favorito
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4" />
                    Favoritar
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex gap-2 items-center"
                onClick={() => toast.success('Devocional compartilhado!')}
              >
                <Share className="h-4 w-4" />
                Compartilhar
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <CalendarDays className="h-12 w-12 mb-4 text-muted-foreground" />
              <p>Devocional não disponível para esta data.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default DailyBread;
