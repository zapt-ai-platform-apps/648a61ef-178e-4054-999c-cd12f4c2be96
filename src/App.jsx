import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import VideoUpload from './components/VideoUpload';
import VideoList from './components/VideoList';
import VideoPlayer from './components/VideoPlayer';
import { supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>
          <h1 className="text-3xl mb-4">Sign in with ZAPT</h1>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={['google', 'facebook', 'apple']}
            magicLink={true}
          />
          <p className="mt-4">
            Made on <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500">ZAPT</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen">
        <nav className="p-4 bg-gray-200 flex justify-between items-center">
          <div>
            <Link to="/" className="mr-4 text-blue-500">Videos</Link>
            <Link to="/upload" className="text-blue-500">Upload Video</Link>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="bg-red-500 text-white px-4 py-2 cursor-pointer"
          >
            Sign Out
          </button>
        </nav>
        <Routes>
          <Route path="/" element={<VideoList />} />
          <Route path="/upload" element={<VideoUpload />} />
          <Route path="/video/:id" element={<VideoPlayer />} />
        </Routes>
        <footer className="p-4 text-center">
          Made on <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500">ZAPT</a>
        </footer>
      </div>
    </Router>
  );
}