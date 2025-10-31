import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import SavedMealsPage from './pages/SavedMealsPage';
import SettingsPage from './pages/SettingsPage';
import './index.css';


type Page = 'home' | 'meals' | 'history' | 'settings';

function App() {
  const [activePage, setActivePage] = useState<Page>('home');

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'meals':
        return <SavedMealsPage />;
      case 'history':
        return <HistoryPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <AppProvider>
      <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
        <main className="pb-20">
          {renderPage()}
        </main>
        <BottomNav activePage={activePage} setActivePage={setActivePage} />
      </div>
    </AppProvider>
  );
}

export default App;
