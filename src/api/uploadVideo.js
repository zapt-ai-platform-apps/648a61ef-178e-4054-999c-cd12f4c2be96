import { authenticateUser } from './_apiUtils.js';
import { videos } from '../../drizzle/schema.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const user = await authenticateUser(req);

        const { title, description, videoUrl, thumbnailUrl } = req.body;

        const client = postgres(process.env.COCKROACH_DB_URL);
        const db = drizzle(client);

        const result = await db.insert(videos).values({
            title,
            description,
            videoUrl,
            thumbnailUrl,
            userId: user.id
        }).returning();

        res.status(200).json(result);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}