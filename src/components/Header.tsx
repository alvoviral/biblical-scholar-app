
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Sheet, 
  SheetTrigger, 
  SheetContent, 
  SheetHeader, 
  SheetTitle
} from '@/components/ui/sheet';
import { Search, Menu, Moon, Sun, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type ThemeType = 'light' | 'dark';

const Header = () => {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState<ThemeType>(() => {
    // Check if localStorage is available
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme') as ThemeType | null;
      if (storedTheme) return storedTheme;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', newTheme);
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      <div className="app-container flex justify-between items-center py-2">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="font-bold text-xl text-bible-primary dark:text-bible-secondary">
            BíbliaApp
          </span>
        </Link>

        {/* Right side buttons */}
        <div className="flex items-center space-x-2">
          {/* Search button */}
          <Button variant="ghost" size="icon" className="menu-button">
            <Search className="h-5 w-5" />
          </Button>

          {/* Theme toggle */}
          <Button variant="ghost" size="icon" className="menu-button" onClick={toggleTheme}>
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* User menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="menu-button">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-4 mb-2 pb-4 border-b">
                      <Avatar>
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                        <div className="text-xs mt-1 inline-block bg-bible-secondary/20 text-bible-primary dark:text-bible-secondary px-2 py-1 rounded">
                          Plano {user.subscriptionType === 'free' ? 'Gratuito' 
                              : user.subscriptionType === 'basic' ? 'Básico' 
                              : 'Premium'}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={logout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <Link to="/auth">
                    <Button variant="outline" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4" />
                      Entrar / Cadastrar
                    </Button>
                  </Link>
                )}
                
                <div className="border-t my-2 pt-4">
                  <nav className="flex flex-col gap-2">
                    <Link to="/" className="text-lg hover:text-bible-primary dark:hover:text-bible-secondary transition-colors">
                      Início
                    </Link>
                    <Link to="/biblia" className="text-lg hover:text-bible-primary dark:hover:text-bible-secondary transition-colors">
                      Bíblia
                    </Link>
                    <Link to="/harpa" className="text-lg hover:text-bible-primary dark:hover:text-bible-secondary transition-colors">
                      Harpa Cristã
                    </Link>
                    <Link to="/ia-teologica" className="text-lg hover:text-bible-primary dark:hover:text-bible-secondary transition-colors">
                      IA Teológica
                    </Link>
                    <Link to="/pao-diario" className="text-lg hover:text-bible-primary dark:hover:text-bible-secondary transition-colors">
                      Pão Diário
                    </Link>
                    <Link to="/planos" className="text-lg hover:text-bible-primary dark:hover:text-bible-secondary transition-colors">
                      Assinaturas
                    </Link>
                  </nav>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
