CREATE TABLE "videos" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "video_url" TEXT NOT NULL,
  "thumbnail_url" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "user_id" UUID NOT NULL
);