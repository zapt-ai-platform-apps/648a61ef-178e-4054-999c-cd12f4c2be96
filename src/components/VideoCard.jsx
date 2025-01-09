import React from 'react';
import { Link } from 'react-router-dom';

export function VideoCard({ video }) {
    return (
        <div className="border rounded shadow hover:shadow-lg transition-shadow duration-300">
            <Link to={`/video/${video.id}`}>
                {video.thumbnail_url ? (
                    <img src={video.thumbnail_url} alt={video.title} className="w-full h-48 object-cover" />
                ) : (
                    <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                        <span>No Thumbnail</span>
                    </div>
                )}
                <div className="p-4">
                    <h2 className="text-lg font-semibold">{video.title}</h2>
                    <p className="text-gray-600">{video.description.substring(0, 100)}...</p>
                </div>
            </Link>
        </div>
    )
}