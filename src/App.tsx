import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import PanuAppRouter from './router';
import { Header } from './components/Header';
import { PanuBottomNav } from './components/nav/PanuBottomNav';

/**
 * POINT D'ENTRÉE PRINCIPAL PANU
 * Gère le layout global avec l'entête et la navigation inférieure.
 */
export const App: React.FC = () => {
  const [userCredits, setUserCredits] = useState<number>(250);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-[#0B0C12] text-white">
        {/* Entête Globale */}
        <Header 
          userBalance={userCredits} 
          onBalanceUpdate={setUserCredits} 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        {/* Contenu de la Page */}
        <main className="flex-grow pb-24">
          <PanuAppRouter searchQuery={searchQuery} />
        </main>

        {/* Barre de Navigation Inférieure avec bouton jaune + central */}
        <PanuBottomNav />
      </div>
    </BrowserRouter>
  );
};

export default App;
