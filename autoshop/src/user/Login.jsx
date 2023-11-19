import React, { useState, useEffect } from "react"
import APPLOGO from '../assets/APPLOGO.png';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from './../firebase';
import { Link, Navigate } from "react-router-dom"
import { signInWithEmailAndPassword } from "firebase/auth"
import * as Yup from 'yup'
import { LoginFormik } from '../components/Formiks'

export const Login = () => {

    var [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userInfo, setUserInfo] = useState()
    const [error, setError] = useState('')
    const usersRef = collection(db, "users")



    //Try sign-in and set user info if success
    const signIn = async (values) => {
        try {

            await signInWithEmailAndPassword(auth, values.email, values.password)

            const user = auth.currentUser;

            const q = query(usersRef, where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (doc) => {
                setUserInfo({
                    id: doc.id,
                    ...doc.data()
                })
            });
            setError('')
        } catch (err) {
            setError('Sign-in Failed')
            console.error("Could not sign in", err);
        }
    };

    //On user info change, make sure it's correct user, then login
    useEffect(() => {
        if (userInfo) {
            const user = auth.currentUser
            if (user.uid == userInfo.uid) {
                setIsLoggedIn(true);
            }
        }
    }, [userInfo])

    //FORMIK CONSTANTS
    const initialValues = {
        email: '',
        password: ''
    }

    const onSubmit = values => {
        signIn(values)
    }

    const validationSchema = Yup.object({
        email: Yup.string().required("Required"),
        password: Yup.string().required("Required")
    })

    return (
            
        <div className="wrapper">
            <div className="auth-form-container">
                <img className="image"
                    src={APPLOGO}
                    alt="Company Logo"
                />
                <h2 style={{ fontSize: '30px' }}>Login</h2>

                <LoginFormik
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                    initialValues={initialValues}
                />
                {error != '' && (
                    <span style={{color: 'darkred', fontSize: '20px'}}>{error}</span>
                ) }
                {isLoggedIn && (
                    <Navigate replace state={{userInfo}} to="/AdminHome" />
                )}

                <br />

                <Link to="/register">
                    <button className="link-btn" style={{fontSize: '20px'}}>Don't have an account? Click here.</button>
                </Link>
            </div>
        </div>
        
    )
}


