CREATE KEYSPACE IF NOT EXISTS youtube_comments_app
WITH replication = {'class': 'NetworkTopologyStrategy', 'replication_factor': '3'};

USE youtube_comments_app;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY,
    user_name TEXT,
    user_avatar TEXT,
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS videos (
    video_id UUID PRIMARY KEY,
    title TEXT,
    description TEXT,
    thumbnail_url TEXT,
    created_at TIMESTAMP
);

-- Comments table
CREATE TABLE comments_by_video (
  video_id UUID,
  comment_id TIMEUUID,
  user_id UUID,
  user_name TEXT,
  user_avatar TEXT,
  content TEXT,
  created_at TIMESTAMP,
  edited BOOLEAN,
  likes_count INT,
  dislikes_count INT,
  replies_count INT,
  PRIMARY KEY (video_id, comment_id)
) WITH CLUSTERING ORDER BY (comment_id DESC);

-- Replies table
CREATE TABLE replies_by_comment (
  parent_comment_id TIMEUUID,
  reply_id TIMEUUID,
  video_id UUID,
  user_id UUID,
  user_name TEXT,
  user_avatar TEXT,
  content TEXT,
  created_at TIMESTAMP,
  edited BOOLEAN,
  likes_count INT,
  dislikes_count INT,
  PRIMARY KEY (parent_comment_id, reply_id)
) WITH CLUSTERING ORDER BY (reply_id ASC);



-- Top scoring comments table (used for ranking)
CREATE TABLE IF NOT EXISTS scored_comments_by_video (
  video_id UUID,
  score DOUBLE,
  comment_id TIMEUUID,
  user_id UUID,
  user_name TEXT,
  user_avatar TEXT,
  content TEXT,
  created_at TIMESTAMP,
  edited BOOLEAN,
  likes_count INT,
  dislikes_count INT,
  replies_count INT,
  PRIMARY KEY (video_id, comment_id)
) WITH CLUSTERING ORDER BY (comment_id DESC);

-- Likes/Dislikes table
CREATE TABLE IF NOT EXISTS comment_reactions_by_user (
  user_id UUID,
  video_id UUID,
  comment_id TIMEUUID,
  reaction TEXT,
  reacted_at TIMESTAMP,
  PRIMARY KEY ((user_id), video_id, comment_id)
);


--Seeding videos
INSERT INTO videos (
    video_id, title, description, thumbnail_url, created_at
) VALUES (
    3fa85f64-5717-4562-b3fc-2c963f66afa6,
    'JavaScript Fundamentals in 15 Minutes',
    'A quick crash course on JavaScript basics including variables, functions, and DOM.',
    'https://example.com/thumbs/js-fundamentals.jpg',
    '2024-01-10 10:30:00'
);

INSERT INTO videos (
    video_id, title, description, thumbnail_url, created_at
) VALUES (
    a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11,
    'Getting Started with Node.js',
    'Learn what Node.js is, why it’s popular, and how to build your first app.',
    'https://example.com/thumbs/nodejs-intro.jpg',
    '2024-02-15 15:45:00'
);

INSERT INTO videos (
    video_id, title, description, thumbnail_url, created_at
) VALUES (
    9b2c2d3d-e333-4dbb-a52f-cf3eae3d8ad0,
    'Build a REST API with Express.js',
    'A hands-on guide to creating RESTful APIs using Express.js and Node.js.',
    'https://example.com/thumbs/express-api.jpg',
    '2024-03-20 09:00:00'
);
