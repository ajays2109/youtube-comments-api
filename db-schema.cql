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
