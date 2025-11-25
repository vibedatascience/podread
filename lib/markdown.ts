import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';

export async function processMarkdown(content: string): Promise<string> {
    // 1. Convert Markdown to HTML, preserving raw HTML
    const processedContent = await remark()
        .use(remarkGfm) // Enable GitHub Flavored Markdown (tables, strikethrough, etc.)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeStringify)
        .process(content);

    let htmlContent = processedContent.toString();

    // 2. Apply Regex Replacements (Ported from Python script)

    // Format "Contents Covered:" sections

    // 1. Handle markdown-style lists in content (Paragraph followed by List)
    htmlContent = htmlContent.replace(
        /<p><strong>Contents Covered:<\/strong><\/p>\s*<ol>([\s\S]*?)<\/ol>/gi,
        (match, listContent) => {
            return `<div style="border-top: 3px solid #E3120B; background: #F9FAFB; padding: 1.5rem; margin: 2rem 0;">
                <h3 style="color: #111827; margin-top: 0; margin-bottom: 1rem; font-family: var(--font-serif); font-size: 1.1rem; font-weight: 700;">Contents Covered</h3>
                <ol style="margin: 0; padding-left: 1.5rem; line-height: 1.6; color: #374151;">${listContent}</ol>
            </div>`;
        }
    );

    // 2. Handle inline content (Single paragraph with breaks)
    htmlContent = htmlContent.replace(
        /<p><strong>Contents Covered:<\/strong>([\s\S]*?)(?=<\/p>|<p><strong>|<h\d|$)/gi,
        (match, content) => {
            // If content is empty or just whitespace, ignore (let the previous regex handle it or leave it)
            if (!content.trim()) return match;

            let items: string[] = [];

            const lines = content.split(/\n|<br\s*\/?>/).filter((line: string) => line.trim());
            lines.forEach((line: string) => {
                line = line.replace(/<[^>]*>/g, '').trim();
                if (line.match(/^\d+\./)) {
                    const cleaned = line.replace(/^\d+\.\s*/, '').trim();
                    if (cleaned) items.push(cleaned);
                }
            });

            if (items.length === 0) {
                lines.forEach((line: string) => {
                    const cleaned = line.replace(/<[^>]*>/g, '').trim();
                    if (cleaned && cleaned !== 'Contents Covered:') {
                        items.push(cleaned);
                    }
                });
            }

            const itemsHtml = items.map(item =>
                `<li style="margin: 0.5rem 0;">${item}</li>`
            ).join('');

            return `<div style="border-top: 3px solid #E3120B; background: #F9FAFB; padding: 1.5rem; margin: 2rem 0;">
                <h3 style="color: #111827; margin-top: 0; margin-bottom: 1rem; font-family: var(--font-serif); font-size: 1.1rem; font-weight: 700;">Contents Covered</h3>
                <ol style="margin: 0; padding-left: 1.5rem; line-height: 1.6; color: #374151;">${itemsHtml}</ol>
            </div>`;
        }
    );

    // Format "Guest:" sections
    htmlContent = htmlContent.replace(
        /<p><strong>Guest:<\/strong>([^<]*)<\/p>/gi,
        (match, guestInfo) => {
            return `<div style="border-top: 3px solid #E3120B; background: #F9FAFB; padding: 1.5rem; margin: 2rem 0;">
                <span style="color: #E3120B; font-family: var(--font-sans); font-weight: 700; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; display: block; margin-bottom: 0.5rem;">Guest</span>
                <div style="font-family: var(--font-serif); font-size: 1.1rem; color: #111827;">${guestInfo.trim()}</div>
            </div>`;
        }
    );

    // Format "Key Quote:" sections
    htmlContent = htmlContent.replace(
        /<p><strong>Key Quote:<\/strong>([\s\S]*?)<\/p>/gi,
        (match, quote) => {
            const cleanQuote = quote
                .replace(/<strong>|<\/strong>/g, '')
                .replace(/<em>|<\/em>/g, '')
                .replace(/<br\s*\/?>/g, ' ')
                .replace(/\*\*\*/g, '')
                .trim();

            return `<div style="background: #FEF2F2; border: 1px solid #FECACA; padding: 2rem; margin: 2rem 0; text-align: center;">
                <div style="color: #E3120B; font-size: 2rem; line-height: 1; margin-bottom: 1rem; font-family: var(--font-serif);">"</div>
                <div style="font-family: var(--font-serif); font-size: 1.25rem; font-style: italic; color: #111827; line-height: 1.4;">
                    ${cleanQuote}
                </div>
            </div>`;
        }
    );

    // Remove redundant "Detailed Analysis:" heading
    htmlContent = htmlContent.replace(
        /<p><strong>Detailed Analysis:<\/strong><\/p>/gi,
        ''
    );

    // Add IDs to h2 headings for table of contents navigation
    htmlContent = htmlContent.replace(
        /<h2>([^<]+)<\/h2>/gi,
        (match, headingText) => {
            const id = headingText
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            return `<h2 id="${id}">${headingText}</h2>`;
        }
    );

    // Add visual separator after each h2 section
    htmlContent = htmlContent.replace(
        /(<\/h2>)/gi,
        '$1\n<hr style="border: none; border-top: 1px solid #E5E7EB; margin: 2rem 0;" />'
    );

    // Style section quotes (***"quote"*** pattern) - Economist style pull quotes
    htmlContent = htmlContent.replace(
        /<p><em><strong>&quot;([\s\S]*?)&quot;<\/strong><\/em><\/p>/gi,
        (match, quoteText) => {
            const cleanQuote = quoteText
                .replace(/<[^>]*>/g, '')
                .trim();
            return `<blockquote style="border-left: 4px solid #E3120B; background: linear-gradient(to right, #FEF2F2, #FFFFFF); padding: 1.25rem 1.5rem; margin: 1.5rem 0; font-style: italic; font-size: 1.1rem; color: #1F2937; line-height: 1.6;">
                <span style="color: #E3120B; font-size: 1.5rem; font-weight: bold; line-height: 1; margin-right: 0.25rem;">"</span>${cleanQuote}<span style="color: #E3120B; font-size: 1.5rem; font-weight: bold; line-height: 1; margin-left: 0.25rem;">"</span>
            </blockquote>`;
        }
    );

    // Also handle the variant with regular quotes (not HTML entities)
    htmlContent = htmlContent.replace(
        /<p><em><strong>"([\s\S]*?)"<\/strong><\/em><\/p>/gi,
        (match, quoteText) => {
            const cleanQuote = quoteText
                .replace(/<[^>]*>/g, '')
                .trim();
            return `<blockquote style="border-left: 4px solid #E3120B; background: linear-gradient(to right, #FEF2F2, #FFFFFF); padding: 1.25rem 1.5rem; margin: 1.5rem 0; font-style: italic; font-size: 1.1rem; color: #1F2937; line-height: 1.6;">
                <span style="color: #E3120B; font-size: 1.5rem; font-weight: bold; line-height: 1; margin-right: 0.25rem;">"</span>${cleanQuote}<span style="color: #E3120B; font-size: 1.5rem; font-weight: bold; line-height: 1; margin-left: 0.25rem;">"</span>
            </blockquote>`;
        }
    );

    return htmlContent;
}
