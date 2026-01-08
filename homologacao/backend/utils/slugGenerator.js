/**
 * Slug Generator Utility
 * Converts titles to URL-friendly slugs with Portuguese character support
 */

/**
 * Generate a URL-friendly slug from a title
 * @param {string} title - The title to convert
 * @returns {string} - URL-friendly slug
 */
function generateSlug(title) {
    if (!title) return '';

    // Convert to lowercase
    let slug = title.toLowerCase();

    // Replace Portuguese characters
    const charMap = {
        'á': 'a', 'à': 'a', 'ã': 'a', 'â': 'a', 'ä': 'a',
        'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
        'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
        'ó': 'o', 'ò': 'o', 'õ': 'o', 'ô': 'o', 'ö': 'o',
        'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
        'ç': 'c', 'ñ': 'n'
    };

    slug = slug.replace(/[áàãâäéèêëíìîïóòõôöúùûüçñ]/g, char => charMap[char] || char);

    // Replace spaces and special characters with hyphens
    slug = slug.replace(/[^a-z0-9]+/g, '-');

    // Remove leading/trailing hyphens
    slug = slug.replace(/^-+|-+$/g, '');

    // Replace multiple consecutive hyphens with single hyphen
    slug = slug.replace(/-+/g, '-');

    return slug;
}

/**
 * Generate a unique slug by checking against existing slugs
 * @param {string} title - The title to convert
 * @param {Function} checkExists - Async function that checks if slug exists
 * @returns {Promise<string>} - Unique slug
 */
async function generateUniqueSlug(title, checkExists) {
    let slug = generateSlug(title);
    let counter = 1;
    let uniqueSlug = slug;

    // Keep trying until we find a unique slug
    while (await checkExists(uniqueSlug)) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }

    return uniqueSlug;
}

module.exports = {
    generateSlug,
    generateUniqueSlug
};
