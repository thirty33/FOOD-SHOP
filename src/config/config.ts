export const configuration = {
    company: {
        name: import.meta.env.VITE_COMPANY_NAME,
        logo: import.meta.env.VITE_COMPANY_LOGO,   
    },
    menu: {
        image: import.meta.env.VITE_MENU_LOGO
    },
    product: {
        image: import.meta.env.VITE_NO_IMAGE_PRODUCT
    },
    fonts: {
        cera: {
            black: import.meta.env.VITE_CERA_BLACK_FONT_URL,
            thin: import.meta.env.VITE_CERA_THIN_FONT_URL,
            light: import.meta.env.VITE_CERA_LIGHT_FONT_URL,
            regular: import.meta.env.VITE_CERA_REGULAR_FONT_URL,
            medium: import.meta.env.VITE_CERA_MEDIUM_FONT_URL,
            bold: import.meta.env.VITE_CERA_BOLD_FONT_URL
        }
    }
}