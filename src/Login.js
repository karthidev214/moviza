import React, { useState, useRef, useEffect } from 'react';
import { auth, provider } from './customHook/useFirebase';
import { useNavigate } from 'react-router-dom'
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    sendPasswordResetEmail,
    updateProfile,
    getAdditionalUserInfo
} from 'firebase/auth';

function AuthForm({ enforceGoogleSignIn = false, handleUpdate }) {
    const navigate = useNavigate()
    const emailRef = useRef(null);
    const passRef = useRef(null);
    const conPassRef = useRef(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [conPassword, setConPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (emailRef.current) if (emailRef.current.classList.contains('error')) emailRef.current.classList.remove('error')
        if (passRef.current) if (passRef.current.classList.contains('error')) passRef.current.classList.remove('error')
        if (conPassRef.current) if (conPassRef.current.classList.contains('error')) conPassRef.current.classList.remove('error')
        setError("")
    }, [isSignUp, isForgotPassword])

    const handleNameChange = (e) => setName(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleConPasswordChange = (e) => setConPassword(e.target.value);
    const toggleSignUp = () => setIsSignUp((prev) => !prev);
    const toggleForgotPassword = () => setIsForgotPassword((prev) => !prev);

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            setError("Password should be at least 6 characters");
            if (passRef.current.classList.contains('error')) passRef.current.classList.remove('error');
            setTimeout(() => {
                passRef.current.classList.add('error');
            }, 100);
            return;
        }

        if (password === conPassword) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                window.localStorage.setItem('user', JSON.stringify(userCredential.user))
                console.log("signed up")
                handleUpdate(userCredential.user.email, name, ["start"], ["start"])
                navigate('/', {
                    state: {
                        message: 'Welcome to Moviza!',
                        fromSignIn: true
                    },
                    replace: true
                });
            } catch (error) {
                if (error.message === "Firebase: Password should be at least 6 characters (auth/weak-password).") {
                    setError("Password should be at least 6 characters");
                    if (passRef.current.classList.contains('error')) passRef.current.classList.remove('error');
                    setTimeout(() => {
                        passRef.current.classList.add('error');
                    }, 100);
                } else if (error.message === "Firebase: Error (auth/email-already-in-use).") {
                    setError("This Email already in use");
                    if (emailRef.current.classList.contains('error')) emailRef.current.classList.remove('error');
                    setTimeout(() => {
                        emailRef.current.classList.add('error');
                    }, 100);
                } else {
                    setError("An unexpected error occurred. Please try again.");
                    console.error('Error Signing Up:', error.message);
                }
            }
        } else {
            setError("Confirm Password Not Matched");
            if (passRef.current.classList.contains('error')) passRef.current.classList.remove('error');
            if (conPassRef.current.classList.contains('error')) conPassRef.current.classList.remove('error');

            setTimeout(() => {
                passRef.current.classList.add('error');
                conPassRef.current.classList.add('error');
            }, 100);
        }
    };


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log(userCredential.user)
            window.localStorage.setItem('user', JSON.stringify(userCredential.user))
            navigate('/', {
                state: {
                    message: 'Welcome back!',
                    fromSignIn: true
                },
                replace: true
            });
        } catch (error) {
            console.error('Error Logging In:', error.message);
            if (error.message == "Firebase: Error (auth/invalid-credential).") {
                setError("Invalid Email or Password");
                if (emailRef.current.classList.contains('error')) emailRef.current.classList.remove('error')
                if (passRef.current.classList.contains('error')) passRef.current.classList.remove('error')
                setTimeout(() => {
                    emailRef.current.classList.add('error')
                    passRef.current.classList.add('error')
                }, 100)
            }

        }
    };

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            // Check if the user is new or existing
            const additionalInfo = getAdditionalUserInfo(result);
            const isNewUser = additionalInfo.isNewUser;
            window.localStorage.setItem('user', JSON.stringify(result.user))
            // Perform different actions based on new or existing user
            if (isNewUser) {
                // Handle actions for new user
                handleUpdate(result.user.email, result.user.displayName, ["Start"], ["Start"]);
                console.log('Welcome, new user!');
            } else {
                // Handle actions for existing user
                handleUpdate(result.user.email, result.user.displayName);
                console.log('Welcome back!');
            }
            navigate('/', {
                state: {
                    message: 'Welcome ' + result.user.displayName,
                    fromSignIn: true
                },
                replace: true
            });
        } catch (error) {
            console.error('Error with Google Sign-In:', error.message);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            alert('Password reset email sent!');
        } catch (error) {
            console.error('Error sending password reset email:', error.message);
        }
    };

    return (
        <div className='container form-container mt-5 pt-5'>
            <div className="row justify-content-center py-5 my-5 align-items-center h-100">
                <div className="col-11 col-md-5 bg-black p-md-5 p-4 rounded-3">
                    <h2 className='text-center mb-5'>{isForgotPassword ? 'Reset Password' : (isSignUp ? 'Sign Up' : 'Login')}</h2>
                    <h6 className='text-danger mb-2'>{error}</h6>
                    {isForgotPassword ? (
                        <form className="d-flex flex-column gap-4 my-3" onSubmit={handleForgotPassword}>
                            <input
                                className="form-control py-3"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="Email"
                                required
                            />
                            <button className='custom-btn py-2 rounded-1' type="submit">Send Password Reset Email</button>
                        </form>
                    ) : (
                        <form className="d-flex flex-column gap-4 my-3" onSubmit={isSignUp ? handleSignUp : handleLogin}>
                            {(!enforceGoogleSignIn && isSignUp) && (
                                <div>
                                    <input
                                        className="form-control py-3"
                                        type="text"
                                        value={name}
                                        onChange={handleNameChange}
                                        placeholder="Display Name"
                                        required
                                    />
                                </div>
                            )}
                            <input
                                ref={emailRef}
                                className="form-control py-3"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="Email"
                                required
                            />

                            {!enforceGoogleSignIn && (
                                <div>
                                    <input
                                        ref={passRef}
                                        className="form-control py-3"
                                        type="password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        placeholder="Password"
                                        required
                                    />
                                </div>
                            )}
                            {(!enforceGoogleSignIn && isSignUp) && (
                                <div>
                                    <input
                                        ref={conPassRef}
                                        className="form-control py-3"
                                        type="password"
                                        value={conPassword}
                                        onChange={handleConPasswordChange}
                                        placeholder="Confirm Password"
                                        required
                                    />
                                </div>
                            )}
                            {!enforceGoogleSignIn && (
                                <button className='custom-btn py-2 rounded-1' type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
                            )}
                        </form>
                    )}


                    {!enforceGoogleSignIn && !isForgotPassword && (
                        <>
                            {isSignUp ? '' : <p className='text-end cursor' onClick={toggleForgotPassword}>
                                Forgot your password?
                            </p>}
                            <p className='text-center mt-5 cursor' onClick={toggleSignUp}>
                                {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
                            </p>
                        </>
                    )}

                    {isForgotPassword && (
                        <p className='text-end cursor' onClick={toggleForgotPassword}>
                            Back to {isSignUp ? 'Sign Up' : 'Login'}
                        </p>
                    )}
                </div>
                <div className="col-11 mt-5">
                    {enforceGoogleSignIn && <p>You can only sign in with Google.</p>}
                    {!isForgotPassword && (
                        <>
                            <p className='text-center'>or</p>
                            <button className='btn cursor text-white d-flex align-items-center gap-2 w-100 justify-content-center' onClick={signInWithGoogle}>
                                {isSignUp ? 'Sign Up with' : 'Sign in with'}
                                <svg xmlns="http://www.w3.org/2000/svg" width="97.53" height="32" viewBox="0 0 512 168"><path fill="#FF302F" d="m496.052 102.672l14.204 9.469c-4.61 6.79-15.636 18.44-34.699 18.44c-23.672 0-41.301-18.315-41.301-41.614c0-24.793 17.816-41.613 39.308-41.613c21.616 0 32.206 17.193 35.633 26.475l1.869 4.735l-55.692 23.049c4.236 8.348 10.84 12.584 20.183 12.584c9.345 0 15.823-4.61 20.495-11.525M452.384 87.66l37.19-15.45c-2.056-5.17-8.16-8.845-15.45-8.845c-9.281 0-22.176 8.223-21.74 24.295" /><path fill="#20B15A" d="M407.407 4.931h17.94v121.85h-17.94z" /><path fill="#3686F7" d="M379.125 50.593h17.318V124.6c0 30.711-18.128 43.357-39.558 43.357c-20.183 0-32.33-13.58-36.878-24.606l15.885-6.604c2.865 6.79 9.78 14.827 20.993 14.827c13.767 0 22.24-8.535 22.24-24.482v-5.98h-.623c-4.112 4.983-11.961 9.468-21.928 9.468c-20.807 0-39.87-18.128-39.87-41.488c0-23.486 19.063-41.8 39.87-41.8c9.905 0 17.816 4.423 21.928 9.282h.623zm1.245 38.499c0-14.702-9.78-25.417-22.239-25.417c-12.584 0-23.174 10.715-23.174 25.417c0 14.514 10.59 25.042 23.174 25.042c12.46.063 22.24-10.528 22.24-25.042" /><path fill="#FF302F" d="M218.216 88.78c0 23.984-18.688 41.613-41.613 41.613c-22.924 0-41.613-17.691-41.613-41.613c0-24.108 18.689-41.675 41.613-41.675c22.925 0 41.613 17.567 41.613 41.675m-18.19 0c0-14.95-10.84-25.23-23.423-25.23S153.18 73.83 153.18 88.78c0 14.826 10.84 25.23 23.423 25.23c12.584 0 23.423-10.404 23.423-25.23" /><path fill="#FFBA40" d="M309.105 88.967c0 23.984-18.689 41.613-41.613 41.613c-22.925 0-41.613-17.63-41.613-41.613c0-24.108 18.688-41.613 41.613-41.613c22.924 0 41.613 17.443 41.613 41.613m-18.253 0c0-14.95-10.839-25.23-23.423-25.23s-23.423 10.28-23.423 25.23c0 14.826 10.84 25.23 23.423 25.23c12.646 0 23.423-10.466 23.423-25.23" /><path fill="#3686F7" d="M66.59 112.328c-26.102 0-46.534-21.056-46.534-47.158c0-26.101 20.432-47.157 46.534-47.157c14.079 0 24.357 5.544 31.957 12.646l12.522-12.521C100.479 7.984 86.338.258 66.59.258C30.833.259.744 29.414.744 65.17s30.089 64.912 65.846 64.912c19.312 0 33.889-6.354 45.289-18.19c11.711-11.712 15.324-28.158 15.324-41.489c0-4.174-.498-8.472-1.059-11.649H66.59v17.318h42.423c-1.246 10.84-4.672 18.253-9.718 23.298c-6.105 6.168-15.76 12.958-32.705 12.958" /></svg>
                            </button>

                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AuthForm;
