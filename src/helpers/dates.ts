
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

export interface FormattedMenuDate {
    year: number;
    dayNumber: number;
    dayName: string;
    monthName: string;
}

export function formatMenuDate(dateString: string): FormattedMenuDate {
    const date = new Date(dateString + "T12:00:00");
    const timezone = import.meta.env.VITE_TIMEZONE || "America/Santiago";

    const year = date.toLocaleDateString("es-CL", {
        year: "numeric",
        timeZone: timezone,
    });

    const dayNumber = date.toLocaleDateString("es-CL", {
        day: "numeric",
        timeZone: timezone,
    });

    const dayName = date.toLocaleDateString("es-CL", {
        weekday: "long",
        timeZone: timezone,
    });

    const monthName = date.toLocaleDateString("es-CL", {
        month: "long",
        timeZone: timezone,
    });

    const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);

    return {
        year: parseInt(year),
        dayNumber: parseInt(dayNumber),
        dayName: capitalizedDayName,
        monthName,
    };
}

export function formatMenuDateShort(dateString: string): { dayNumber: number; dayName: string; month: string } {
    const date = new Date(dateString + "T12:00:00");
    const timezone = import.meta.env.VITE_TIMEZONE || "America/Santiago";

    const dayNumber = date.toLocaleDateString("es-CL", {
        day: "numeric",
        timeZone: timezone,
    });

    const dayName = date.toLocaleDateString("es-CL", {
        weekday: "short",
        timeZone: timezone,
    });

    const monthName = date.toLocaleDateString("es-CL", {
        month: "short",
        timeZone: timezone,
    });

    const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1).replace('.', '');
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1).replace('.', '');

    return {
        dayNumber: parseInt(dayNumber),
        dayName: capitalizedDayName,
        month: capitalizedMonth,
    };
}