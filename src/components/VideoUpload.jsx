import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { uploadVideo } from '../services/videoUploadService';

export default function VideoUpload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file || !title) return;

    setUploading(true);

    try {
      await uploadVideo(file, title, description, supabase);
      alert('Video uploaded successfully!');
      setFile(null);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error(error);
      alert(error.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl mb-4">Upload Video</h1>
      <input
        type="file"
        accept="video/*"
        onChange={e => setFile(e.target.files[0])}
        className="mb-4"
      />
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="block mb-4 p-2 border border-gray-300 w-full box-border"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="block mb-4 p-2 border border-gray-300 w-full box-border"
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`bg-blue-500 text-white px-4 py-2 cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {uploading ? 'Uploading...' : 'Upload Video'}
      </button>
    </div>
  );
}