import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UploadVideo from './pages/UploadVideo';
import VideoDetail from './pages/VideoDetail';
import Navbar from './components/Navbar';
import Badge from './components/Badge';
import { Auth } from '@supabase/auth-ui-react';
import { supabase } from './supabaseClient';
import { useState, useEffect } from 'react';

export default function App(){
    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            authListener.subscription.unsubscribe();
        }
    }, []);

    return (
        <div className="min-h-screen h-full">
            <Router>
                <Navbar session={session} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/upload" element={<UploadVideo />} />
                    <Route path="/video/:id" element={<VideoDetail />} />
                </Routes>
                <Badge />
            </Router>
            {!session && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-xl mb-4">Sign in with ZAPT</h2>
                        <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mb-4 block">
                            Visit ZAPT
                        </a>
                        <Auth supabaseClient={supabase} appearance={{ theme: 'dark' }} providers={['google', 'facebook', 'apple']} />
                    </div>
                </div>
            )}
        </div>
    )
}