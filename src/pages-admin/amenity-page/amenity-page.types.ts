
export interface SnackbarState {
    open: boolean;
    message: string;
    severity: "success" | "info" | "warning" | "error";
}

export interface ErrorResponse {
    success: boolean;
    message: string;
    statusCode: number;
}