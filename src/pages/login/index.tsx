import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/index";
import { login } from "../../store/slice/authentication/actions";
import styles from "./login.module.css";
import logo from "../../assets/images/fraxioned.png";
import Loader from "../../components/loader/index";
import CustomizedSnackbars from "../../components/customized-snackbar";
// import { ENCRYPTION_KEY } from "@/constants";
import { encrypt, decrypt } from "@/utils/encryption";

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(String(email).toLowerCase());
};

const Login: React.FC = () => {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Preload email/password if 'remember me' was checked
  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    const storedPassword = localStorage.getItem("rememberedPassword");
    if (storedEmail && storedPassword) {
      setFormState({
        email: decrypt(storedEmail, import.meta.env.VITE_ENCRYPTION_KEY),
        password: decrypt(storedPassword, import.meta.env.VITE_ENCRYPTION_KEY),
        rememberMe: true,
      });
    }
  }, []);

  // Form change handler
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
    setFormErrors((prevState) => ({ ...prevState, [name]: "" }));
  }, []);

  // Form validation
  const validateForm = useCallback(() => {
    const errors: { email: string; password: string } = {
      email: "",
      password: "",
    };

    if (!formState.email) {
      errors.email = "Please fill in the Email ID";
    } else if (!validateEmail(formState.email)) {
      errors.email = "Please enter a valid email ID";
    }

    if (!formState.password) {
      errors.password = "Please fill in the Password";
    }

    setFormErrors(errors);
    return !errors.email && !errors.password;
  }, [formState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const resultAction = await dispatch(
        login({ email: formState.email, password: formState.password })
      ).unwrap();

      setSnackbar({
        show: true,
        message: "Login Successful",
        severity: "success",
      });

      if (formState.rememberMe) {
        localStorage.setItem(
          "rememberedEmail",
          encrypt(formState.email, import.meta.env.VITE_ENCRYPTION_KEY)
        );
        localStorage.setItem(
          "rememberedPassword",
          encrypt(formState.password, import.meta.env.VITE_ENCRYPTION_KEY)
        );
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }

      const redirectPath =
        resultAction.user.role.id === 1 ? "/admin/bookings" : "/";
      navigate(redirectPath);
    } catch (error) {
      setSnackbar({
        show: true,
        message: (error as string) || "Login failed. Please try again.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnackbarClose = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, show: false }));
  }, []);

  return (
    <div className={styles.outerContainer}>
      <div className={styles.innerContainer}>
        {isLoading && <Loader />}
        <img
          src={logo}
          alt="Fraxioned Logo"
          className={styles.logo}
          loading="lazy"
        />
        <div className={styles.formWrapper}>
          <h2 className={styles.login}>Login here</h2>
          <p className={styles.loginSubtext}>
            Please enter your details to sign in
          </p>
          {formErrors.email && (
            <div className={styles.errorMessage}>{formErrors.email}</div>
          )}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={formState.email}
                onChange={handleChange}
                className={formErrors.email ? styles.errorInput : ""}
              />
            </div>
            <div className={styles.inputGroup}>
              {formErrors.password && (
                <div className={styles.errorMessage}>{formErrors.password}</div>
              )}
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formState.password}
                onChange={handleChange}
                className={formErrors.password ? styles.errorInput : ""}
              />
            </div>
            <div className={styles.formFooter}>
              <label className={styles.remember}>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formState.rememberMe}
                  onChange={handleChange}
                />{" "}
                Remember me
              </label>
              <Link to="/forgotPassword" className={styles.forgotPassword}>
                Forgot password?
              </Link>
            </div>
            <button type="submit" className={styles.signInButton}>
              Sign in
            </button>
          </form>
        </div>
      </div>
      <CustomizedSnackbars
        open={snackbar.show}
        handleClose={handleSnackbarClose}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </div>
  );
};

export default Login;
