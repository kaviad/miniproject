import React, { useState } from 'react'

// Firebase components

import { auth } from '../Firebase';
import {
    createUserWithEmailAndPassword,
    updateProfile,
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
} from 'firebase/auth';

import {toast} from "react-toastify"
import loader from "../assets/loader.svg"
import { useNavigate } from "react-router-dom";


import {db} from '../Firebase'
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

// importing user, mail, password, eye icon from react-icons
import {FaUser} from "react-icons/fa";
import {FiMail} from "react-icons/fi";
import {FiLock} from "react-icons/fi";
import {FiEye} from "react-icons/fi";
import google from "../assets/google.png";
import login from '../assets/login.png';

export function LoginPage(){
    const navigate = useNavigate();

    const [registerDetails, setRegisterDetails] = useState({
        username: '',
        email: '',
        password: ''
    });

    const [signinDetails, setSigninDetails] = useState({
        email: '',
        password: ''
    });
    
    function onInputChange(e){
        setRegisterDetails({
            ...registerDetails,
            [e.target.name]: e.target.value
        });
    }
    
    function onSinginDetails(e){
        setSigninDetails({
            ...signinDetails,
            [e.target.name]: e.target.value
        });
    }

    function changeRoute(route){
        navigate(route);
    }

    const [signinLoading, setSigninLoading] = useState(false);
    const [signupLoading, setSignupLoading] = useState(false);

    async function isAdmin(email) {
        const db = getFirestore();
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
    
        const querySnapshot = await getDocs(q);
        const userDocs = querySnapshot.docs.map(doc => {
            console.log(doc.data())
            return doc.data()
        });
        return userDocs.some(user => user.role === 'admin');
    }

    async function signup(){
        setSignupLoading(true);
        try{
            await createUserWithEmailAndPassword(
                auth,
                registerDetails.email,
                registerDetails.password
            );
    
            updateProfile(auth.currentUser, {
                displayName:registerDetails.name
            })
            setSignupLoading(false);
            toast.success("You are successfully registered");
            changeRoute('/user');
        }
        catch(error){
            toast.error("Something went wrong");
            setSignupLoading(false);
        }
    }

    async function handleGoogleSignIn(){
        try{
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            if(user){
                const isAdminUser = await isAdmin(user.email);
                if (isAdminUser) {
                    // If the user is an admin, do something
                    changeRoute('/admin')
                    toast.success("Welcome back Admin");
                } else {
                    // If the user is not an admin, do something else
                    changeRoute('/user');
                }
            }

            else{
                toast.error("Something went wrong")
            }
        }
        catch(error){
            console.log(error);
        }
    }

    async function handleForgotPassword(e) {
        e.preventDefault();
        if (signinDetails.email.trim() !== '') {
          try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, signinDetails.email);
            toast.success('mail was successfully sent');
          } catch (error) {
            console.log(error);
            toast.error("Couldn't send reset password to given mail id");
          }
        } else {
          toast.error('Enter a valid Email');
        }
    }

    async function signIn(){
        setSigninLoading(true)
        try{
            const userCredential = await signInWithEmailAndPassword(
                auth,
                signinDetails.email,
                signinDetails.password
            )
    
            if(userCredential.user){
                // localStorage.setItem('user', JSON.stringify(userCredential.user));
                const isAdminUser = await isAdmin(signinDetails.email);
                console.log(isAdminUser)
                if (!isAdminUser) {
                    changeRoute('/user')
                    toast.success("You are successfully logged in");
                } else {
                    changeRoute('/admin')
                    toast.success("Welcome back Admin");
                }
                setSigninLoading(false)
            }else{
                toast.error("Something went wrong")
                setSigninLoading(false)
            }
        }
    
        catch(error){
            console.log(error)
            let message = (error.message.split('/')[1]);
            if(message === 'invalid-credential).'){
                toast.error('Incorrect Password. Try Again')
            }
            else if(message === 'user-not-found).'){
                toast.error("User Not Found")
            }
            else if(message === "network-request-failed)."){
                toast.error("Network Error")
            }
            else{
                toast.error(error.message.split('/')[1])
            }
            setSigninLoading(false)
        }
    }

    const [showPassword, setShowPassword] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    return (
        <>
            {showSignUp && <div className='signup'>
                <div className='signup-content'>
                    <h1>Let's Signup</h1>
        
                    <div className='inputs'>
                        <div className='input-container'>
                            <FaUser style={{position:"absolute", left:"8px"}}/>
                            <input type='text' placeholder='Username' name='username' onChange={onInputChange}/>
                        </div>
        
                        <div className='input-container'>
                            <FiMail style={{position:"absolute", left:"8px"}}/>
                            <input type='email' placeholder='Email' name='email' onChange={onInputChange}/>
                        </div>
        
                        <div className='input-container'>
                            <FiLock style={{position:"absolute", left:"8px"}}/>
                            <input type={showPassword ? 'text' : 'password'} placeholder='Password' name='password' onChange={onInputChange}/>
                            <FiEye style={{position:"absolute", right:"15px", cursor:'pointer'}} onClick={() => setShowPassword(!showPassword)}/>
                        </div>

                        <div className='input-container'>
                        <p>Already have an account? <span onClick={() => setShowSignUp(!showSignUp)}>Login</span></p>
                        </div>

                        <div className='input-container'>
                            <button onClick={signup}> {signupLoading? <img className='loader' src={loader} alt="" /> : "SignUp"} </button>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
                            <hr style={{ flex: 1, width: "320px" }} />
                            <span style={{ margin: "0 10px" }}>OR</span>
                            <hr style={{ flex: 1 }} />
                        </div>

                        <button className="google-btn" onClick={handleGoogleSignIn}>
                            <img src={google} alt="" /> Sign In with Google 
                        </button>

                    </div>
                </div>
                <div className='signup-image'>
                    <img src={login} alt="" />
                </div>
            </div> }

            {/* SIGNIN */}
            {!showSignUp && <div className='signup'>
                <div className='signup-content'>
                    <h1>Let's Signin</h1>
        
                    <div className='inputs'>
                        <div className='input-container'>
                            <FiMail style={{position:"absolute", left:"8px"}}/>
                            <input type='email' placeholder='Email' name='email' onChange={onSinginDetails}/>
                        </div>
        
                        <div className='input-container'>
                            <FiLock style={{position:"absolute", left:"8px"}}/>
                            <input type={showPassword ? 'text' : 'password'} placeholder='Password' name='password' onChange={onSinginDetails}/>
                            <FiEye style={{position:"absolute", right:"15px", cursor:'pointer'}} onClick={() => setShowPassword(!showPassword)}/>
                        </div>

                        <div className='input-container'>
                            <h4 className='left' style={{marginRight:'auto'}}>New User? <span onClick={() => setShowSignUp(!showSignUp)}>Signup</span></h4>
                            <h4 className='right'> <span onClick={handleForgotPassword}>Forgot Password?</span></h4>
                        </div>

                        <div className='input-container'>
                        <button onClick={signIn}> {signinLoading? <img className='loader' src={loader} alt="" /> : "SignIn"} </button>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
                            <hr style={{ flex: 1, width: "320px" }} />
                            <span style={{ margin: "0 10px" }}>OR</span>
                            <hr style={{ flex: 1 }} />
                        </div>

                        <button className="google-btn" onClick={handleGoogleSignIn}>            
                            <img src={google} alt="" /> Sign Up with Google
                        </button>
                    </div>
                </div>
                <div className='signup-image'>
                    <img src={login} alt="" />
                </div>
            </div>}
        </>
    );
}
