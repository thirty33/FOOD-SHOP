/**
 * Validates if a dispatch date is today or in the future
 * @param dispatchDate - Date string in format "domingo 31 de agosto de 2025"
 * @returns true if the date is today or in the future, false otherwise
 */
export const isDispatchDateValid = (dispatchDate: string): boolean => {
  try {
    // Month names in Spanish
    const monthMap: Record<string, number> = {
      'enero': 0,
      'febrero': 1,
      'marzo': 2,
      'abril': 3,
      'mayo': 4,
      'junio': 5,
      'julio': 6,
      'agosto': 7,
      'septiembre': 8,
      'octubre': 9,
      'noviembre': 10,
      'diciembre': 11
    };

    // Remove the day name and "de" to simplify parsing
    // Example: "domingo 31 de agosto de 2025" -> "31 agosto 2025"
    const cleanedDate = dispatchDate
      .toLowerCase()
      .replace(/^[a-záéíóúñ]+\s+/, '') // Remove day name
      .replace(/\s+de\s+/g, ' '); // Remove "de"
    
    // Split the cleaned date: "31 agosto 2025"
    const parts = cleanedDate.split(' ');
    
    if (parts.length !== 3) {
      console.error('Invalid date format:', dispatchDate);
      return false;
    }

    const day = parseInt(parts[0], 10);
    const month = monthMap[parts[1]];
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || month === undefined || isNaN(year)) {
      console.error('Could not parse date:', dispatchDate);
      return false;
    }

    // Create date object for the dispatch date (at start of day)
    const dispatch = new Date(year, month, day, 0, 0, 0, 0);
    
    // Get today's date at start of day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Return true if dispatch date is today or in the future
    return dispatch >= today;
  } catch (error) {
    console.error('Error parsing dispatch date:', error, dispatchDate);
    return false;
  }
};