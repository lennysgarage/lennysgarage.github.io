/**
 * Parse frontmatter from markdown content
 * Browser-compatible alternative to gray-matter
 */
export const parseFrontmatter = (markdown) => {
    // Match frontmatter: --- followed by content, then ---, then optional whitespace, then content
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*(\n\s*)?([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);

    if (!match) {
        // No frontmatter found, return entire content as body
        return {
            data: {},
            content: markdown.trim()
        };
    }

    const frontmatterText = match[1];
    const content = match[3] || '';

    // Parse YAML-like frontmatter (simple key: value pairs)
    const data = {};
    const lines = frontmatterText.split('\n');

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        const colonIndex = trimmedLine.indexOf(':');
        if (colonIndex === -1) continue;

        const key = trimmedLine.substring(0, colonIndex).trim();
        let value = trimmedLine.substring(colonIndex + 1).trim();

        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        data[key] = value;
    }

    return {
        data,
        content: content.trim()
    };
};
