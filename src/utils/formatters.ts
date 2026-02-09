/**
 * Formats a category string by capitalizing the first letter of each word.
 * e.g., "men's clothing" -> "Men's Clothing"
 * 
 * @param category - The raw category string from the API
 * @returns The formatted category string
 */
export const formatCategory = (category: string): string => {
  return category
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
