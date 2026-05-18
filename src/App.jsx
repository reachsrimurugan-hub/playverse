import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { SidebarProvider } from './context/SidebarContext';
import QuotaDashboard from './components/QuotaDashboard';
import Loader from './components/Loader';
import CinematicBottomNav from './components/CinematicBottomNav';

// Lazy load pages for performance optimization
const CinematicDashboard = lazy(() => import('./pages/CinematicDashboard'));
const VideoDetails = lazy(() => import('./pages/VideoDetails'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const TrendingPage = lazy(() => import('./pages/TrendingPage'));
const LibraryPage = lazy(() => import('./pages/LibraryPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));

function App() {
  return (
    <LanguageProvider>
      <SidebarProvider>
        <BrowserRouter>
          <Suspense fallback={
            <div className="min-h-screen bg-[#0a0502] flex items-center justify-center">
              <Loader />
            </div>
          }>
            <Routes>
              <Route path="/" element={<CinematicDashboard />} />
              <Route path="/watch/:videoId" element={<VideoDetails />} />
              <Route path="/search/:searchTerm" element={<SearchResults />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
              <Route path="/trending" element={<TrendingPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/auth" element={<AuthPage />} />
            </Routes>
            <CinematicBottomNav />
          </Suspense>
        </BrowserRouter>
        <QuotaDashboard />
      </SidebarProvider>
    </LanguageProvider>
  );
}

export default App;
