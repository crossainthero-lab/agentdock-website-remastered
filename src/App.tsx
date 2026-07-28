import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Downloads } from './pages/Downloads';
import { AigencyArchitecture } from './pages/AigencyArchitecture';
import { Pro } from './pages/Pro';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { Admin } from './pages/Admin';
import { useLocation } from 'react-router-dom';

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-ad-bg)] text-[var(--color-ad-text)] font-sans">
      {!isAdmin && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/aigency" element={<Navigate to="/pro#aigency" replace />} />
          <Route path="/aigency/technical" element={<Navigate to="/docs/aigency-architecture" replace />} />
          <Route path="/docs/aigency-architecture" element={<AigencyArchitecture />} />
          <Route path="/pro" element={<Pro />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}
