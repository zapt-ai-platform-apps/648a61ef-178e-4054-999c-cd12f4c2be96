import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Navbar({ session }) {
    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
        }
    }

    return (
        <nav className="bg-gray-800 p-4 flex justify-between items-center">
            <Link to="/" className="text-white text-lg font-bold">
                VideoShare
            </Link>
            <div>
                {session ? (
                    <>
                        <Link to="/upload" className="text-gray-300 hover:text-white mr-4 cursor-pointer">
                            Upload Video
                        </Link>
                        <button onClick={handleSignOut} className="text-gray-300 hover:text-white cursor-pointer">
                            Sign Out
                        </button>
                    </>
                ) : (
                    <span className="text-gray-300">Please sign in</span>
                )}
            </div>
        </nav>
    )
}