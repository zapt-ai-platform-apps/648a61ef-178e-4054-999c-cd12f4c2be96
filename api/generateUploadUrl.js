import * as Sentry from "@sentry/node";
import { authenticateUser } from "./_apiUtils.js";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.VITE_PUBLIC_APP_ID
    }
  }
});

export default async function handler(req, res) {
  try {
    const user = await authenticateUser(req);

    const { fileName, fileType } = req.body;

    const s3 = new S3Client({ region: process.env.AWS_REGION });

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `videos/${user.id}/${Date.now()}_${fileName}`,
      ContentType: fileType,
      ACL: 'public-read'
    };

    const command = new PutObjectCommand(params);

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    res.status(200).json({ uploadUrl, key: params.Key });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}