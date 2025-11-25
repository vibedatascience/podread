const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = '/Users/rahulchaudhary/youtube_subs_extractor/output_copy';
const DATA_DIR = path.join(__dirname, '../data');
const EPISODES_FILE = path.join(DATA_DIR, 'episodes.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

function parseMetadata(content) {
    const metadata = {};
    const lines = content.split('\n');

    lines.forEach(line => {
        const match = line.match(/^([A-Z]+):\s*(.+)$/);
        if (match) {
            const key = match[1].toLowerCase();
            const value = match[2].trim();
            metadata[key] = value;
        }
    });

    return metadata;
}

function isPremium(dateString) {
    if (!dateString) return false;

    try {
        // Try to parse date formats
        let date;
        // Handle "Month DD, YYYY" format often found in these files
        if (dateString.match(/[A-Za-z]+ \d{1,2}, \d{4}/)) {
            date = new Date(dateString);
        } else {
            date = new Date(dateString);
        }

        if (isNaN(date.getTime())) return false;

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        // If date is AFTER one month ago, it's recent -> Premium
        return date > oneMonthAgo;
    } catch (e) {
        return false;
    }
}

function migrate() {
    console.log('Starting migration...');

    if (!fs.existsSync(OUTPUT_DIR)) {
        console.error(`Output directory not found: ${OUTPUT_DIR}`);
        process.exit(1);
    }

    const files = fs.readdirSync(OUTPUT_DIR);
    const txtFiles = files.filter(f => f.endsWith('.txt'));

    const episodes = [];

    txtFiles.forEach(txtFile => {
        try {
            const txtPath = path.join(OUTPUT_DIR, txtFile);
            const txtContent = fs.readFileSync(txtPath, 'utf-8');
            const metadata = parseMetadata(txtContent);

            // Find corresponding MD file
            // The pattern seems to be: filename.txt -> filename_claude_artifact.md
            const baseName = path.basename(txtFile, '.txt');
            const mdFile = `${baseName}_claude_artifact.md`;
            const mdPath = path.join(OUTPUT_DIR, mdFile);

            // Skip this episode if MD file doesn't exist
            if (!fs.existsSync(mdPath)) {
                console.warn(`Skipping ${txtFile}: No corresponding MD file found (${mdFile})`);
                return; // Skip to next iteration
            }

            // Read the MD file content
            const content = fs.readFileSync(mdPath, 'utf-8');

            // Generate a slug from title or filename
            const slug = baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            const episode = {
                id: slug,
                title: metadata.title || 'Unknown Title',
                channel: metadata.channel || 'Unknown Channel',
                publishedAt: metadata.published || '',
                duration: metadata.duration || '',
                url: metadata.url || '',
                views: metadata.views || '',
                content: content,
                isPremium: isPremium(metadata.published),
                slug: slug
            };

            episodes.push(episode);

        } catch (err) {
            console.error(`Error processing ${txtFile}:`, err);
        }
    });

    // Sort by date descending (newest first)
    episodes.sort((a, b) => {
        const dateA = new Date(a.publishedAt);
        const dateB = new Date(b.publishedAt);
        if (isNaN(dateA.getTime())) return 1;
        if (isNaN(dateB.getTime())) return -1;
        return dateB - dateA;
    });

    fs.writeFileSync(EPISODES_FILE, JSON.stringify(episodes, null, 2));
    console.log(`Successfully migrated ${episodes.length} episodes to ${EPISODES_FILE}`);
}

migrate();
