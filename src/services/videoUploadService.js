export async function uploadVideo(file, title, description, supabase) {
  if (!file || !title) {
    throw new Error('File and title are required.');
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error('User is not authenticated.');
    }

    const response = await fetch('/api/generateUploadUrl', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate upload URL.');
    }

    const { uploadUrl, key } = await response.json();

    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload the file.');
    }

    const saveResponse = await fetch('/api/saveVideoMetadata', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        videoUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      }),
    });

    if (!saveResponse.ok) {
      throw new Error('Failed to save video metadata.');
    }
  } catch (error) {
    throw error;
  }
}