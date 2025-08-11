import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

export function useQueryParams(paramNames: string[]) {
    const [searchParams] = useSearchParams();

    const queryParams = useMemo(() => {
        const params: Record<string, string> = {};

        paramNames.forEach(paramName => {
            const value = searchParams.get(paramName);
            if (value) {
                params[paramName] = value;
            }
        });

        return params;
    }, [searchParams, paramNames]);

    return queryParams;
}