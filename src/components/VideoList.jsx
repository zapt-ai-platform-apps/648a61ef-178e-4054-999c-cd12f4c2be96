import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

export default function VideoList() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('/api/getVideos', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl mb-4">Videos</h1>
      <ul>
        {videos.map(video => (
          <li key={video.id} className="mb-2">
            <Link to={`/video/${video.id}`} className="text-blue-500">
              {video.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}