import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function VideoDetail() {
    const { id } = useParams();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideo = async () => {
            const { data, error } = await supabase
                .from('videos')
                .select('*')
                .eq('id', id)
                .single();
            if (error) {
                console.error('Error fetching video:', error);
            } else {
                setVideo(data);
            }
            setLoading(false);
        }

        fetchVideo();
    }, [id]);

    if (loading) {
        return <div className="flex justify-center items-center h-full">Loading...</div>;
    }

    if (!video) {
        return <div className="flex justify-center items-center h-full">Video not found</div>;
    }

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h1 className="text-2xl mb-4">{video.title}</h1>
            <video controls className="w-full mb-4">
                <source src={video.video_url} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            {video.thumbnail_url && (
                <img src={video.thumbnail_url} alt="Thumbnail" className="w-full mb-4" />
            )}
            <p className="mb-4">{video.description}</p>
            <p className="text-gray-500">Uploaded by: {video.user_id}</p>
        </div>
    )
}