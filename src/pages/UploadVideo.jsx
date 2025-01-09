import React, { useState } from 'react';
import { uploadVideoData } from '../services/videoService';

export default function UploadVideo() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !videoFile) {
            alert('Title and video file are required.');
            return;
        }
        setLoading(true);

        try {
            await uploadVideoData({ title, description, videoFile, thumbnailFile });
            alert('Video uploaded successfully!');
            setTitle('');
            setDescription('');
            setVideoFile(null);
            setThumbnailFile(null);
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }

        setLoading(false);
    }

    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-2xl mb-4">Upload Video</h1>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <label className="mb-2">Title</label>
                <input
                    type="text"
                    className="border p-2 mb-4 box-border"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <label className="mb-2">Description</label>
                <textarea
                    className="border p-2 mb-4 box-border"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <label className="mb-2">Video File</label>
                <input
                    type="file"
                    accept="video/*"
                    className="mb-4 cursor-pointer"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    required
                />
                <label className="mb-2">Thumbnail (optional)</label>
                <input
                    type="file"
                    accept="image/*"
                    className="mb-4 cursor-pointer"
                    onChange={(e) => setThumbnailFile(e.target.files[0])}
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer"
                    disabled={loading}
                >
                    {loading ? 'Uploading...' : 'Upload'}
                </button>
            </form>
        </div>
    )
}