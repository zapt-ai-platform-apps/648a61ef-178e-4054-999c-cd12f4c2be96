import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useParams } from 'react-router-dom';

export default function VideoPlayer() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    fetchVideo();
  }, []);

  const fetchVideo = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(`/api/getVideo?id=${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setVideo(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!video) return <div>Loading...</div>;

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl mb-4">{video.title}</h1>
      <video controls className="w-full h-auto mb-4">
        <source src={video.video_url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p>{video.description}</p>
    </div>
  );
}