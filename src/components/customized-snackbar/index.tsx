import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// Define your severity colors
const severityColors: { [key: string]: string } = {
  success: "#A1D6B2", // Green
  info: "#2196f3", // Blue
  warning: "#ff9800", // Orange
  error: "#E68369", // Red
};

interface CustomizedSnackbarsProps {
  open: boolean;
  handleClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
  message: string;
  severity: "success" | "info" | "warning" | "error";
}

const CustomizedSnackbars: React.FC<CustomizedSnackbarsProps> = ({
  open,
  handleClose,
  message,
  severity,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }} // Change to top center
      sx={{ width: "100%", maxWidth: "1000px", marginTop: "30px" }} // Set the width and maximum width
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{
          width: "100%",
          backgroundColor: severityColors[severity], // Apply severity color
          color: "#fff", // Ensure the text is readable
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomizedSnackbars;
