
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { BookOpen, Plus, Search, Trash } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  category?: string;
}

const Notes = () => {
  const { user } = useAuth();
  const { tier } = useSubscription();
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  // Verificar se o usuário pode acessar este recurso
  const canUseFeature = user && (tier === 'basic' || tier === 'premium');

  // Carregar notas do localStorage
  useEffect(() => {
    if (user) {
      const savedNotes = localStorage.getItem(`bible-app-notes-${user.id}`);
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    }
  }, [user]);

  // Salvar notas no localStorage quando mudarem
  useEffect(() => {
    if (user && notes.length > 0) {
      localStorage.setItem(`bible-app-notes-${user.id}`, JSON.stringify(notes));
    }
  }, [notes, user]);

  const handleAddNote = () => {
    if (!title.trim()) {
      toast.error('Por favor, adicione um título');
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date(),
      ...(tier === 'basic' || tier === 'premium' ? { category } : {})
    };

    setNotes([newNote, ...notes]);
    setTitle('');
    setContent('');
    setCategory('');
    toast.success('Nota adicionada com sucesso!');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    toast.success('Nota excluída com sucesso!');
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 app-container flex flex-col items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Recurso Protegido</CardTitle>
              <CardDescription>
                Faça login para acessar suas anotações.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link to="/auth?redirect=/anotacoes" className="w-full">
                <Button className="w-full">Fazer Login</Button>
              </Link>
            </CardFooter>
          </Card>
        </main>
      </div>
    );
  }

  if (!canUseFeature) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 app-container flex flex-col items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Recurso Premium</CardTitle>
              <CardDescription>
                As anotações estão disponíveis para assinantes dos planos Básico e Premium.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link to="/planos" className="w-full">
                <Button className="w-full">Ver Planos</Button>
              </Link>
            </CardFooter>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 app-container">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <BookOpen className="mr-2" /> Minhas Anotações
          </h1>
          <p className="text-muted-foreground">
            Registre e organize suas anotações e reflexões
          </p>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Nova Anotação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            {(tier === 'basic' || tier === 'premium') && (
              <div>
                <Input
                  placeholder="Categoria (opcional)"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
            )}
            <div>
              <Textarea
                placeholder="Conteúdo da anotação"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddNote} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Adicionar Anotação
            </Button>
          </CardFooter>
        </Card>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar anotações..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredNotes.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Você ainda não tem anotações.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <Card key={note.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{note.title}</CardTitle>
                      {note.category && (
                        <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-0.5 rounded mt-1">
                          {note.category}
                        </span>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{note.content}</p>
                </CardContent>
                <CardFooter className="pt-0 text-xs text-muted-foreground">
                  {new Date(note.createdAt).toLocaleDateString('pt-BR')}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Notes;
