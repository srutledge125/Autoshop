import React, { useState, useEffect } from "react"
import { Link, Navigate } from "react-router-dom"
import APPLOGO from '../assets/APPLOGO.png';
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"
import { setDoc, doc } from "firebase/firestore"
import { db, auth } from "./../firebase"
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { RegisterFormik } from '../components/Formiks'

export const Register = () => {

    var [isFormFilled, setIsFormFilled] = useState(false)
    const [userInfo, setUserInfo] = useState()

    // Creates account using provided email address and password
    const createAccount = async (values) => {
        try {
            console.log(values.emailaddress)

            //When we get emails set up, this needs to be removed and put into separate function on admin approval
            await createUserWithEmailAndPassword(auth, values.emailaddress, values.password)

            // Creates document in Firestore with user data
            try {
                //Get currently signed in user, user signs in automatically on create
                const auth = getAuth();
                const user = auth.currentUser;

                //changed to setDoc so we can assign the Id of the document as user uid. although this will be pointless later
                const docRef = await setDoc(doc(db, "users", user.uid), {
                    firstName: values.firstname,
                    lastName: values.lastname,
                    emailAddress: values.emailaddress,
                    userType: 3,
                    uid: user.uid
                });
                setUserInfo({
                    firstName: values.firstname,
                    lastName: values.lastname,
                    emailAddress: values.emailaddress,
                    userType: 3,
                    uid: user.uid
                })
                setIsFormFilled(true);

            } catch (err) {
                console.error("Error adding document: ", err);
            }
        } catch (err) {
            console.error(err);
        }
    }

    //On user info change, make sure it's correct user, then login
    useEffect(() => {
        if (userInfo) {
            const user = auth.currentUser
            if (user.uid == userInfo.uid) {
                setIsFormFilled(true);
            }
        }
    }, [userInfo])

    const initialValues = {
        firstname: '',
        lastname: '',
        emailaddress: '',
        password: ''
    }

    const onSubmit = values => {
        console.log("Form Data", values)
        createAccount(values)
    }

    const validationSchema = Yup.object({
        firstname: Yup.string().required("Required"),
        lastname: Yup.string().required("Required"),
        emailaddress: Yup.string().required("Required").email('Invalid email format'),
        password: Yup.string().required("Required")//.matches("^([A-Za-z])(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{7,}$", "Invalid password format")
    })


    return (
        <div className="wrapper">
            <div className="auth-form-container">
                <img className="image"
                    src={APPLOGO}
                    alt="Company Logo"
                />
                <h2 style={{fontSize: '30px'}}>Register</h2>

                <RegisterFormik
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                    initialValues={initialValues}
                />

                {isFormFilled && (
                    <Navigate replace state={{ userInfo }} to="/AdminHome" />
                )}

                <Link to="/login">
                    <button className="link-btn" style={{ fontSize: '20px' }}>Already have an account? Click here.</button>
                </Link>

            </div>
        </div>
        
    )
}
