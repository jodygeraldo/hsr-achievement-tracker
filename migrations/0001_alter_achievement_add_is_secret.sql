-- Migration number: 0001 	 2023-05-31T07:56:07.646Z
ALTER TABLE
    achievement
ADD
    COLUMN is_secret BOOLEAN DEFAULT 'FALSE';