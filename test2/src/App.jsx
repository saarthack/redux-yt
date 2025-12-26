
import SearchBar from './components/SearchBar'
import Tabs from './components/Tabs'
import CollectionPage from './components/CollectionPage'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'


export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <header className="bg-white shadow">
          <div className="max-w-6xl mx-auto p-4 flex items-center gap-4">
            <Link to="/" className="font-bold text-lg">MediaSearch</Link>
            <nav className="ml-auto flex gap-3">
              <Link to="/" className="text-sm text-gray-600">Search</Link>
              <Link to="/collection" className="text-sm text-gray-600">Collection</Link>
            </nav>
          </div>
        </header>


        <main className="flex-1">
          <SearchBar />
          <Routes>
            <Route path="/" element={<Tabs />} />
            <Route path="/collection" element={<CollectionPage />} />
          </Routes>
        </main>


        <footer className="bg-white border-t p-4 text-center text-xs text-gray-500">Built with Redux Toolkit • Tailwind</footer>
      </div>
    </BrowserRouter>
  )
}