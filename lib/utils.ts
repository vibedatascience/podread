/**
 * Calculate estimated reading time based on word count
 * Average reading speed: 200-250 words per minute
 */
export function calculateReadingTime(content: string): number {
    const wordsPerMinute = 220;
    const text = content.replace(/<[^>]*>/g, '').replace(/[#*_`~]/g, '');
    const wordCount = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return Math.max(1, minutes);
}

/**
 * Extract H2 headings from markdown content for table of contents
 */
export function extractHeadings(content: string): { id: string; text: string }[] {
    const headings: { id: string; text: string }[] = [];

    // Match ## Heading patterns in markdown
    const regex = /^## (.+)$/gm;
    let match;

    while ((match = regex.exec(content)) !== null) {
        const text = match[1].trim();
        // Create URL-friendly ID
        const id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        headings.push({ id, text });
    }

    return headings;
}
