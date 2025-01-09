import * as Sentry from "@sentry/node";
import { authenticateUser } from "./_apiUtils.js";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { videos } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

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
    await authenticateUser(req);

    const { id } = req.query;

    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);

    const [video] = await db.select().from(videos).where(eq(videos.id, id));

    if (!video) {
      res.status(404).json({ error: 'Video not found' });
      return;
    }

    res.status(200).json(video);
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}