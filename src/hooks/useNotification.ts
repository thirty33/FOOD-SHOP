import { useSnackbar } from "notistack";

export function useNotification() {

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    return {
        enqueueSnackbar,
        closeSnackbar
    }
    
}