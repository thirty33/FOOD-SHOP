
export function formatDate(dateString: string): string {
    const date = new Date(new Date(dateString + 'T00:00:00').toLocaleString('en-US', { timeZone: import.meta.env.VITE_TIMEZONE }));
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName} ${day} de ${monthName} de ${year}`;
}