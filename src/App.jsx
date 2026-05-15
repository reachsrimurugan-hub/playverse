import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import VideoDetails from './pages/VideoDetails';
import SearchResults from './pages/SearchResults';
import { SidebarProvider } from './context/SidebarContext';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <SidebarProvider>
        <BrowserRouter>
          <div className="flex flex-col h-screen bg-yt-bg overflow-hidden text-yt-text">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
              <Routes>
                <Route path="/" exact element={<Home />} />
                <Route path="/video/:id" element={<VideoDetails />} />
                <Route path="/search/:searchTerm" element={<SearchResults />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </SidebarProvider>
    </LanguageProvider>
  );
}

export default App;
