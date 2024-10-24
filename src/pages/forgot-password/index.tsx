import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./forgot.module.css";
import background from "../../assets/images/background.png";
import { Link } from "react-router-dom";
import logo from "../../assets/images/fraxioned.png";
import Loader from "../../components/loader";
import axios from "axios";
import CustomizedSnackbars from "../../components/customized-snackbar";
import { forgetPassword } from "@/store/services";

const ForgetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "info" | "warning" | "error"
  >("info");
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re =
      /^[a-zA-Z0-9]+([.@][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please fill in the Email ID");
    } else if (!validateEmail(email)) {
      setError("Please enter a valid email ID");
    } else {
      setError("");
      setIsLoading(true);
      try {
        const response = await forgetPassword(email);
        if (
          response.data.message === "Password reset email sent successfully"
        ) {
          setSnackbarMessage("Password reset link sent successfully!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          setSnackbarMessage(response.data.message || "Password reset failed");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Error requesting password reset:", error);
        if (axios.isAxiosError(error) && error.response) {
          if (
            error.response.status === 404 &&
            error.response.data.message ===
              "The account associated with this user was not found"
          ) {
            setSnackbarMessage("User unauthorized");
          } else {
            setSnackbarMessage(
              error.response.data.message ||
                "Failed to request password reset. Please try again."
            );
          }
        } else {
          setSnackbarMessage("An error occurred. Please try again.");
        }
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setError("Please enter a valid email ID");
    }
  };

  return (
    <div
      className={styles.outerContainer}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className={styles.innerContainer}>
        {isLoading && <Loader />}
        <img
          src={logo}
          alt="Fraxioned Logo"
          className={styles.logo}
          loading="lazy"
        />
        <div className={styles.formWrapper}>
          <h2 className={styles.login}>Forget password</h2>
          <p className={styles.loginSubtext}>Recover your password here</p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              {error && <div className={styles.errorMessage}>{error}</div>}
              <input
                type="text"
                placeholder="Email"
                value={email}
                autoFocus
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                className={`${styles.input} ${error ? styles.errorInput : ""}`}
              />
            </div>
            <div className={styles.formFooter}>
              <label className={styles.remember}>
                {/* <input type="checkbox" /> Remember password? */}
              </label>
              <Link to="/" className={styles.forgotPassword}>
                Login here!
              </Link>
            </div>
            <button
              type="submit"
              className={styles.signInButton}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
      <CustomizedSnackbars
        open={snackbarOpen}
        handleClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </div>
  );
};

export default ForgetPassword;
