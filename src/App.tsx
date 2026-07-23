import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Downloads } from './pages/Downloads';
import { AIgency } from './pages/AIgency';
import { AIgencyTechnical } from './pages/AIgencyTechnical';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-ad-bg)] text-[var(--color-ad-text)] font-sans">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/aigency" element={<AIgency />} />
          <Route path="/aigency/technical" element={<AIgencyTechnical />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
