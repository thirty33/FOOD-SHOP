export function truncateString(text: string, maxChars: number): string {
  if (text.length <= maxChars) {
    return text;
  }
  return text.slice(0, maxChars) + '...';
}

/**
 * Transforms text by capitalizing the first letter after each hyphen
 * Handles optional spaces after hyphens
 * 
 * @param text - The text to transform
 * @returns {string} - Text with capitalized letters after hyphens
 * 
 * @example
 * capitalizeAfterHyphen("pollo-asado") => "pollo-Asado"
 * capitalizeAfterHyphen("pollo- asado") => "pollo- Asado"
 * capitalizeAfterHyphen("ensalada-cesar-premium") => "ensalada-Cesar-Premium"
 */
export function capitalizeAfterHyphen(text: string): string {
  return text.replace(/-(\s*)([a-zA-Z])/g, (_, spaces, letter) => {
    return `-${spaces}${letter.toUpperCase()}`;
  });
}

/**
 * Capitalizes the first letter of each word in a string
 * Supports Unicode characters including ñ, á, é, etc.
 * 
 * @param text - The text to transform
 * @returns {string} - Text with each word capitalized
 * 
 * @example
 * capitalizeWords("HELLO WORLD") => "Hello World"
 * capitalizeWords("john doe") => "John Doe"
 * capitalizeWords("mary-ann smith") => "Mary-Ann Smith"
 * capitalizeWords("ELIODORO YAÑEZ") => "Eliodoro Yañez"
 */
export function capitalizeWords(text: string): string {
  if (!text) return text;
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}