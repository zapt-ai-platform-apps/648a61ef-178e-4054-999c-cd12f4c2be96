import { supabase } from '../supabaseClient';

export async function uploadVideoData({ title, description, videoFile, thumbnailFile }) {
    if (!title || !videoFile) {
        throw new Error('Title and video file are required.');
    }

    // Upload video
    const videoPath = `videos/${videoFile.name}`;
    const { error: videoError } = await supabase.storage
        .from('videos')
        .upload(videoPath, videoFile);

    if (videoError) {
        throw new Error(`Error uploading video: ${videoError.message}`);
    }

    const videoUrl = supabase.storage.from('videos').getPublicUrl(videoPath).publicURL;

    // Upload thumbnail if exists
    let thumbnailUrl = '';
    if (thumbnailFile) {
        const thumbnailPath = `thumbnails/${thumbnailFile.name}`;
        const { error: thumbError } = await supabase.storage
            .from('thumbnails')
            .upload(thumbnailPath, thumbnailFile);
        if (thumbError) {
            throw new Error(`Error uploading thumbnail: ${thumbError.message}`);
        }
        thumbnailUrl = supabase.storage.from('thumbnails').getPublicUrl(thumbnailPath).publicURL;
    }

    // Insert video record
    const user = supabase.auth.user();
    const { error } = await supabase
        .from('videos')
        .insert([
            { title, description, video_url: videoUrl, thumbnail_url: thumbnailUrl, user_id: user.id }
        ]);

    if (error) {
        throw new Error(`Error inserting video record: ${error.message}`);
    }

    return;
}