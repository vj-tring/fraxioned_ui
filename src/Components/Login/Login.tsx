import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import {  Button } from '@mui/material';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  };

  const onButtonClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    if (email === "") {
      setEmailError("Please enter your email");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
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
    const Email=localStorage.getItem("Email");
    const Pass=localStorage.getItem("Password");
  
    if(Email === email && Pass === password){
      navigate("/dashboard");

    }
    else{
      alert("Invalid Credentials");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="login-box">
      <h2>Login</h2>
      <form>
        <div className="user-box">
          <input
            value={email}
            placeholder="Email"
            onChange={ev => setEmail(ev.target.value)}
            className="user-box"
            type="email"
          />
          <label className="errorLabel">{emailError}</label>
        </div>
        <div className="user-box">
          <input
            value={password}
            placeholder="Password"
            onChange={ev => setPassword(ev.target.value)}
            className="user-box"
            type="password"
          />
          <label className="errorLabel">{passwordError}</label>
        </div>
        <Button
          onClick={onButtonClick}
          className="inputButton mt-3 mb-4"
          type="button"
          variant="contained"
          color="primary"
        >
          Submit
        </Button>

        {/* <a href='/register' >Signup?</a> */}
      </form>
    </div>
  );
};

export default Login;
