import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, Wallet, LogOut, Home, Sparkles, PlaySquare, User } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

/**
 * COMPOSANT HEADER PANU (NETTOYÉ ET ÉPURÉ)
 * - Logo PANU à gauche (sans coupure)
 * - Exactement 2 icônes à droite : Recherche et Menu Hamburger
 */
export interface HeaderProps {
  userBalance?: number;
  onBalanceUpdate?: (newBalance: number) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  userBalance = 250, 
  onBalanceUpdate,
  searchQuery = '',
  onSearchChange
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data?.user?.email || null);
    });
  }, []);

  const handleNav = (path: string) => {
    setShowMenu(false);
    navigate(path);
  };

  return (
    <>
      <header className="w-full bg-[#10121A] border-b border-white/5 px-4 py-3 flex items-center justify-between sticky top-0 z-[100] backdrop-blur-md">
        {/* CÔTÉ GAUCHE : LOGO PANU */}
        {!isSearchExpanded && (
          <div 
            className="flex items-center gap-3 cursor-pointer select-none animate-in fade-in duration-300" 
            onClick={() => navigate('/')}
          >
            <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
              <span className="text-black font-black text-xl">P</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase whitespace-nowrap hidden sm:block">
              PANU
            </span>
          </div>
        )}

        {/* BARRE DE RECHERCHE INTERACTIVE */}
        <div className={`flex-grow mx-4 transition-all duration-300 flex items-center ${isSearchExpanded ? 'max-w-full' : 'max-w-[200px]'}`}>
          <div className="relative w-full group">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${searchQuery ? 'text-amber-500' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Rechercher sur PANU..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onFocus={() => setIsSearchExpanded(true)}
              onBlur={() => {
                if (!searchQuery) setIsSearchExpanded(false);
              }}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange?.('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* CÔTÉ DROIT : MENU */}
        <div className="flex items-center gap-2">
          {!isSearchExpanded && (
            <button 
              onClick={() => setShowMenu(true)}
              className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
          {isSearchExpanded && (
             <button 
              onClick={() => setIsSearchExpanded(false)}
              className="p-2 text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider"
            >
              Fermer
            </button>
          )}
        </div>
      </header>

      {/* MENU HAMBURGER (DRAWER) */}
      {showMenu && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowMenu(false)} 
          />
          <div className="relative w-[300px] bg-[#12141F] h-full shadow-2xl border-l border-white/10 p-6 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-white tracking-tight">MENU</h2>
              <button 
                onClick={() => setShowMenu(false)}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white bg-white/5 rounded-full"
              >
                ✕
              </button>
            </div>

            {/* INFOS UTILISATEUR & SOLDE */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-6">
              <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">Mon Compte</div>
              <div className="text-white font-bold text-sm truncate mb-3">{userEmail || 'Utilisateur PANU'}</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-black text-lg">
                  <Wallet className="w-5 h-5 text-amber-500" />
                  {userBalance} 🪙
                </div>
                <button className="bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-black px-3 py-1.5 rounded-lg transition-colors">
                  RECHARGER
                </button>
              </div>
            </div>

            {/* NAVIGATION RAPIDE */}
            <nav className="flex flex-col gap-2">
              {[
                { label: 'Accueil & Reels', path: '/', icon: <Home className="w-5 h-5" /> },
                { label: 'Studio Créatif IA', path: '/studio', icon: <Sparkles className="w-5 h-5" /> },
                { label: 'Directs & Matchs', path: '/live', icon: <PlaySquare className="w-5 h-5" /> },
                { label: 'Mon Profil', path: '/profile', icon: <User className="w-5 h-5" /> },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`flex items-center gap-4 p-4 rounded-xl font-bold text-sm transition-all ${
                    location.pathname === item.path 
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>

            {/* DÉCONNEXION */}
            <div className="mt-auto pt-6 border-t border-white/5">
              <button 
                className="w-full flex items-center gap-4 p-4 text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-bold text-sm"
                onClick={() => {
                  supabase.auth.signOut();
                  handleNav('/login');
                }}
              >
                <LogOut className="w-5 h-5" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
