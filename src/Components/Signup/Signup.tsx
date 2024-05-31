import React, { useState } from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import {  Button } from '@mui/material';

interface SignupProps {
  navigate?: (url: string) => void;
}

const Signup: React.FC<SignupProps> = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [fullNameError, setFullNameError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [termsError, setTermsError] = useState<string>("");

  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const onButtonClick = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setFullNameError("");
    setPhoneError("");
    setTermsError("");

    if (fullName === "") {
      setFullNameError("Please enter your full name");
      return;
    }

    if (email === "") {
      setEmailError("Please enter your email");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (phone === "") {
      setPhoneError("Please enter your phone number");
      return;
    }

    if (!validatePhone(phone)) {
      setPhoneError("Please enter a valid 10-digit phone number");
      return;
    }

    if (password === "") {
      setPasswordError("Please enter a password");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be 8 characters or longer");
      return;
    }

    if (!acceptTerms) {
      setTermsError("You must accept the terms and conditions");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="login-box">
      <h2>Signup</h2>
      <form onSubmit={onButtonClick}>
        <div className="user-box">
          <input
            value={fullName}
            placeholder="Enter full name"
            onChange={ev => setFullName(ev.target.value)}
            className="user-box"
            type="text"
          />
          <label className="errorLabel">{fullNameError}</label>
        </div>
        <div className="user-box">
          <input
            value={email}
            placeholder="Enter email address here"
            onChange={ev => setEmail(ev.target.value)}
            className="user-box"
            type="email"
          />
          <label className="errorLabel">{emailError}</label>
        </div>
        <div className="user-box">
          <input
            value={phone}
            placeholder="Enter phone number"
            onChange={ev => setPhone(ev.target.value)}
            className="user-box"
            type="text"
          />
          <label className="errorLabel">{phoneError}</label>
        </div>
        <div className="user-box">
          <input
            value={password}
            placeholder="Enter password here"
            onChange={ev => setPassword(ev.target.value)}
            className="user-box"
            type="password"
          />
          <label className="errorLabel">{passwordError}</label>
        </div>
        <div className="terms-box">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={ev => setAcceptTerms(ev.target.checked)}
          />
          <label>I accept the terms and conditions</label>
          <label className="errorLabel">{termsError}</label>
        </div>
        

       <Button
          className="inputButton "
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Signup;
