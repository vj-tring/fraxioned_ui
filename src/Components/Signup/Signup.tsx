import React, { useState } from 'react';
import styles from './Signup.module.css';
import logo from '../Login/fraxioned.png';


const Signup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setNameError(true);
            setEmailError(false);
            setPasswordError(false);
        } else if (!email.trim()) {
            setEmailError(true);
            setPasswordError(false);
            setNameError(false);
        } else if (!password.trim()) {
            setPasswordError(true);
            setEmailError(false);
        } else {
            setEmailError(false);
            setPasswordError(false);
            setNameError(false);
            console.log('Login attempted with:', email, password);
        }
    };


    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        setNameError(false);
    };
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setEmailError(false);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setPasswordError(false);
    };

    return (
        <div className={styles.outerContainer}>
            <div className={styles.innerContainer}>
                <img src={logo} alt="Fraxioned Logo" className={styles.logo} />
                <div className={styles.formWrapper}>
                    <h2 className={styles.login}>Register here</h2>
                    <p className={styles.loginSubtext}>Please enter your details to get registered</p>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            {nameError && (
                                <div className={styles.errorMessage}>
                                    Please fill in the Name
                                </div>
                            )}
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                autoFocus
                                onChange={handleNameChange}
                                className={nameError ? styles.errorInput : ''}
                            />
                        </div>
                        {/* <div className={styles.inputGroup}>
              {nameError && (
                <div className={styles.errorMessage}>
                  Please fill in the Name
                </div>
              )}
              <input
                type="number"
                placeholder="Phonenumber"
                value={phone}
                autoFocus
                onChange={handleNameChange}
                className={nameError ? styles.errorInput : ''}
              />
            </div> */}
                        <div className={styles.inputGroup}>
                            {emailError && (
                                <div className={styles.errorMessage}>
                                    Please fill in the Email ID
                                </div>
                            )}
                            <input
                                type="text"
                                placeholder="Email"
                                value={email}
                                onChange={handleEmailChange}
                                className={emailError ? styles.errorInput : ''}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            {passwordError && (
                                <div className={styles.errorMessage}>
                                    Please fill in the Password
                                </div>
                            )}
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={handlePasswordChange}
                                className={passwordError ? styles.errorInput : ''}
                            />
                        </div>

                        <div className={styles.formFooter}>
                            <label className={styles.remember}>
                                <input type="checkbox" /> I agree with the terms of service
                            </label>
                        </div>
                        <button type="submit" className={styles.signInButton}>Register</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
