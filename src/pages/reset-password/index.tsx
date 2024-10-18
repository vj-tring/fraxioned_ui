import React, { useState, useEffect } from "react";
import styles from "./reset.module.css";
import axios from "axios";
import Loader from "../../components/loader";
import { IoMdClose } from "react-icons/io";
import CustomizedSnackbars from "../../components/customized-snackbar";
import { resetPasswordApi } from "../../api/api-endpoints";

interface ResetPasswordProps {
  onClose: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserId(user.id);
    }
  }, []);

  const validateInputs = () => {
    const errors: string[] = [];
    if (!oldPassword.trim()) errors.push("Please enter your old password");
    if (!newPassword.trim()) errors.push("Please enter a new password");
    if (!confirmPassword.trim())
      errors.push("Please confirm your new password");
    if (newPassword !== confirmPassword)
      errors.push("New passwords do not match");
    if (userId === null) errors.push("User ID not found.");

    setErrorMessages(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessages([]);
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      if (userId) {
        const response = await resetPasswordApi(
          oldPassword,
          newPassword,
          userId
        );
        handleResponse(response.data.message);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponse = (message: string) => {
    if (message === "Password reset successfully") {
      setSnackbarSeverity("success");
      setSnackbarMessage("Password reset successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setSnackbarSeverity("error");
      setSnackbarMessage(message);
    }
    setShowSnackbar(true);
  };

  const handleError = (error: unknown) => {
    const message =
      axios.isAxiosError(error) && error.response
        ? error.response.data.message || "Password reset failed"
        : "An error occurred. Please try again.";
    setSnackbarSeverity("error");
    setSnackbarMessage(message);
    setShowSnackbar(true);
  };

  const handleClose = () => {
    onClose();
    setShowSnackbar(false);
    setIsLoading(false);
  };

  return (
    <div className={styles.modalContent}>
      {isLoading && <Loader />}
      <div className={styles.closeIconContainer}>
        <IoMdClose
          data-testid="close-icon"
          className={styles.closeIcon}
          onClick={handleClose}
        />
      </div>
      <h2 className={styles.login}>Reset Password</h2>
      <p className={styles.loginSubtext}>Set your new password here</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        {errorMessages.map((error, index) => (
          <div key={index} className={styles.errorMessage}>
            {error}
          </div>
        ))}
        <div className={styles.inputGroup}>
          <input
            id="oldPassword"
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className={
              errorMessages.includes("Please enter your old password")
                ? styles.errorInput
                : ""
            }
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            id="newPassword"
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={
              errorMessages.includes("Please enter a new password")
                ? styles.errorInput
                : ""
            }
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={
              errorMessages.includes("Please confirm your new password")
                ? styles.errorInput
                : ""
            }
          />
        </div>
        <button type="submit" className={styles.signInButton}>
          Submit
        </button>
      </form>
      <CustomizedSnackbars
        open={showSnackbar}
        handleClose={() => setShowSnackbar(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </div>
  );
};

export default ResetPassword;
