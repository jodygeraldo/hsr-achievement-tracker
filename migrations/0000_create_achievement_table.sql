-- Migration number: 0000 	 2023-05-31T07:55:57.641Z
CREATE TABLE IF NOT EXISTS achievement (
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    path TEXT,
    session_id TEXT NOT NULL,
    created_at TEXT DEFAULT current_timestamp
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_achievement_name_category_session_id ON achievement(name, category, session_id);