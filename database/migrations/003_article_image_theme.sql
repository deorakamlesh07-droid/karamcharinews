-- Add image_theme column to articles table to support preset visual banners (8thcpc, growth, money)
ALTER TABLE articles ADD COLUMN IF NOT EXISTS image_theme VARCHAR(50) DEFAULT '8thcpc';

-- Update initial articles with appropriate theme tags based on their category
UPDATE articles SET image_theme = '8thcpc' WHERE slug LIKE '%pay-commission%' OR slug LIKE '%8th%';
UPDATE articles SET image_theme = 'money' WHERE slug LIKE '%da%' OR slug LIKE '%salary%' OR slug LIKE '%pension%';
UPDATE articles SET image_theme = 'growth' WHERE slug LIKE '%dpc%' OR slug LIKE '%acp%' OR slug LIKE '%macp%' OR slug LIKE '%promotion%';
