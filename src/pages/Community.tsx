
import React, { useState } from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import { Users, MessageCircle, Search, Plus, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: Date;
  likes: number;
  comments: Comment[];
  liked?: boolean;
}

interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: Date;
}

// Posts de exemplo
const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      id: 'user-1',
      name: 'João Silva',
      avatar: ''
    },
    content: 'Compartilho com vocês esta reflexão sobre Romanos 8:28. Como esse versículo tem impactado sua vida?',
    createdAt: new Date('2025-05-10T14:30:00'),
    likes: 12,
    comments: [
      {
        id: 'c1',
        author: {
          id: 'user-2',
          name: 'Maria Souza',
          avatar: ''
        },
        content: 'Esse versículo me ajudou a superar momentos difíceis na minha vida!',
        createdAt: new Date('2025-05-10T15:20:00')
      }
    ]
  },
  {
    id: '2',
    author: {
      id: 'user-3',
      name: 'Pedro Santos',
      avatar: ''
    },
    content: 'Alguém tem uma recomendação de livro para estudo sobre o livro de Apocalipse?',
    createdAt: new Date('2025-05-09T10:15:00'),
    likes: 5,
    comments: []
  }
];

const Community = () => {
  const { user } = useAuth();
  const { tier } = useSubscription();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPost, setNewPost] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [commentText, setCommentText] = useState('');
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  
  // Verificar se o usuário pode acessar este recurso premium
  const canUseFeature = user && tier === 'premium';

  const handleCreatePost = () => {
    if (!newPost.trim()) {
      toast.error('O conteúdo da postagem não pode estar vazio');
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      author: {
        id: user?.id || '',
        name: user?.name || 'Usuário',
        avatar: ''
      },
      content: newPost,
      createdAt: new Date(),
      likes: 0,
      comments: []
    };

    setPosts([post, ...posts]);
    setNewPost('');
    toast.success('Postagem criada com sucesso!');
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        if (post.liked) {
          return { ...post, likes: post.likes - 1, liked: false };
        } else {
          return { ...post, likes: post.likes + 1, liked: true };
        }
      }
      return post;
    }));
  };

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) {
      toast.error('O comentário não pode estar vazio');
      return;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        id: user?.id || '',
        name: user?.name || 'Usuário',
        avatar: ''
      },
      content: commentText,
      createdAt: new Date()
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, comment]
        };
      }
      return post;
    }));

    setCommentText('');
    setActiveCommentId(null);
    toast.success('Comentário adicionado com sucesso!');
  };

  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.author.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                Faça login para acessar a comunidade.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link to="/auth?redirect=/comunidade" className="w-full">
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
                A comunidade está disponível apenas para assinantes do plano Premium.
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
            <Users className="mr-2" /> Comunidade Cristã
          </h1>
          <p className="text-muted-foreground">
            Compartilhe experiências e converse com outros cristãos
          </p>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar na comunidade..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Criar nova postagem</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="O que você gostaria de compartilhar?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={3}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleCreatePost} className="ml-auto">
              <Plus className="mr-2 h-4 w-4" /> Publicar
            </Button>
          </CardFooter>
        </Card>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Nenhuma postagem encontrada.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>
                        {post.author.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{post.author.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="whitespace-pre-wrap">{post.content}</p>
                </CardContent>
                <CardFooter className="pt-0 border-t flex flex-col items-start">
                  <div className="flex justify-between w-full pb-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleLike(post.id)}
                      className={post.liked ? "text-primary" : ""}
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      {post.likes} {post.likes === 1 ? 'Curtida' : 'Curtidas'}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setActiveCommentId(activeCommentId === post.id ? null : post.id)}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {post.comments.length} {post.comments.length === 1 ? 'Comentário' : 'Comentários'}
                    </Button>
                  </div>
                  
                  {post.comments.length > 0 && (
                    <div className="w-full space-y-3 pt-3 border-t">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={comment.author.avatar} />
                            <AvatarFallback>
                              {comment.author.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-muted rounded-lg px-3 py-2 text-sm flex-1">
                            <p className="font-medium text-xs">{comment.author.name}</p>
                            <p>{comment.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(comment.createdAt).toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {activeCommentId === post.id && (
                    <div className="w-full pt-3 flex gap-2 items-center">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>
                          {user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex gap-2">
                        <Input 
                          placeholder="Escreva um comentário..." 
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        />
                        <Button size="sm" onClick={() => handleAddComment(post.id)}>Enviar</Button>
                      </div>
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Community;
