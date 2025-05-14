
import React, { useState } from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import { FileType, Search, Download, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Sermon {
  id: string;
  title: string;
  description: string;
  text: string;
  createdAt: Date;
  references: string[];
}

const mockSermons: Sermon[] = [
  {
    id: '1',
    title: 'A Parábola do Semeador',
    description: 'Uma análise profunda da parábola contada por Jesus',
    text: 'Esta pregação examina a parábola do semeador contada por Jesus em Mateus 13...',
    createdAt: new Date('2025-04-25'),
    references: ['Mateus 13:1-23', 'Marcos 4:1-20']
  },
  {
    id: '2',
    title: 'O Bom Pastor',
    description: 'Entendendo o papel de Jesus como o bom pastor',
    text: 'Jesus se apresentou como o Bom Pastor que dá a vida pelas ovelhas...',
    createdAt: new Date('2025-05-05'),
    references: ['João 10:1-21', 'Salmos 23']
  },
  {
    id: '3',
    title: 'A Armadura de Deus',
    description: 'Como nos revestir com a armadura espiritual',
    text: 'Paulo nos ensina sobre a importância de nos revestirmos com toda a armadura de Deus...',
    createdAt: new Date('2025-05-10'),
    references: ['Efésios 6:10-18']
  }
];

const Sermons = () => {
  const { user } = useAuth();
  const { tier } = useSubscription();
  const [sermons, setSermons] = useState<Sermon[]>(mockSermons);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newSermon, setNewSermon] = useState({
    title: '',
    description: '',
    text: '',
    references: ''
  });
  
  // Verificar se o usuário pode acessar este recurso premium
  const canUseFeature = user && tier === 'premium';

  const handleCreateSermon = () => {
    if (!newSermon.title.trim() || !newSermon.text.trim()) {
      toast.error('Preencha pelo menos o título e o conteúdo da pregação');
      return;
    }

    const sermon: Sermon = {
      id: Date.now().toString(),
      title: newSermon.title,
      description: newSermon.description,
      text: newSermon.text,
      references: newSermon.references.split(',').map(ref => ref.trim()).filter(ref => ref),
      createdAt: new Date()
    };

    setSermons([sermon, ...sermons]);
    setNewSermon({
      title: '',
      description: '',
      text: '',
      references: ''
    });
    setShowForm(false);
    toast.success('Pregação criada com sucesso!');
  };

  const filteredSermons = sermons.filter(sermon => 
    sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    sermon.description.toLowerCase().includes(searchTerm.toLowerCase())
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
                Faça login para acessar as pregações.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link to="/auth?redirect=/pregacoes" className="w-full">
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
                As pregações estão disponíveis apenas para assinantes do plano Premium.
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
            <FileType className="mr-2" /> Pregações
          </h1>
          <p className="text-muted-foreground">
            Crie, organize e compartilhe suas pregações
          </p>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar pregações..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" /> Nova Pregação
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Criar Nova Pregação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  placeholder="Título"
                  value={newSermon.title}
                  onChange={(e) => setNewSermon({...newSermon, title: e.target.value})}
                />
              </div>
              <div>
                <Input
                  placeholder="Descrição breve"
                  value={newSermon.description}
                  onChange={(e) => setNewSermon({...newSermon, description: e.target.value})}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Conteúdo da pregação"
                  value={newSermon.text}
                  onChange={(e) => setNewSermon({...newSermon, text: e.target.value})}
                  rows={10}
                />
              </div>
              <div>
                <Input
                  placeholder="Referências bíblicas (separadas por vírgulas)"
                  value={newSermon.references}
                  onChange={(e) => setNewSermon({...newSermon, references: e.target.value})}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button onClick={handleCreateSermon}>Salvar</Button>
            </CardFooter>
          </Card>
        )}

        {filteredSermons.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Nenhuma pregação encontrada.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSermons.map((sermon) => (
              <Card key={sermon.id}>
                <CardHeader>
                  <CardTitle>{sermon.title}</CardTitle>
                  <CardDescription>{sermon.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{sermon.text.substring(0, 200)}...</p>
                  {sermon.references.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {sermon.references.map((ref, index) => (
                        <span key={index} className="bg-muted text-xs px-2 py-1 rounded">
                          {ref}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(sermon.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                  <Button size="sm" variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Baixar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Sermons;
