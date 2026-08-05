import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { JoinProModal } from './components/JoinProModal';
import { ContactModal } from './components/ContactModal';
import { Home } from './pages/Home';
import { AIgency } from './pages/AIgency';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { Downloads } from './pages/Downloads';
import { Pro } from './pages/Pro';
import { Admin } from './pages/Admin';
import ScrollToTop from './components/ScrollToTop';
import { analytics } from './lib/analytics';
import { AnnouncementBar } from './components/AnnouncementBar';

function AppShell() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [isJoinProOpen, setIsJoinProOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const openJoinPro = () => {
    analytics.track('join_pro_cta_clicked');
    setIsJoinProOpen(true);
  };

  const openContact = () => {
    analytics.track('contact_cta_clicked');
    setIsContactOpen(true);
  };

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <AnnouncementBar onOpenJoinPro={openJoinPro} />}
      <div className="min-h-screen bg-[#05050A] font-sans selection:bg-blue-500/30 flex flex-col">
        {!isAdmin && <Navbar onOpenJoinPro={openJoinPro} onOpenContact={openContact} />}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home onOpenJoinPro={openJoinPro} onOpenContact={openContact} />} />
            <Route path="/pro" element={<Pro onOpenJoinPro={openJoinPro} />} />
            <Route path="/aigency" element={<AIgency onOpenJoinPro={openJoinPro} />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        {!isAdmin && <Footer onOpenJoinPro={openJoinPro} onOpenContact={openContact} />}
        <JoinProModal isOpen={isJoinProOpen} onClose={() => setIsJoinProOpen(false)} />
        <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
