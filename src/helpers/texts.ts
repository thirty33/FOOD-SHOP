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