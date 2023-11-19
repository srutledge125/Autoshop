
import React, { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import APPLOGO from '../assets/APPLOGO.png';
import { getAuth } from "firebase/auth"
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase"
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

export const AddVehicle = () => {

    var [isVehAddedEmpl, setIsVehAddedEmpl] = useState(false);
    var [isVehAddedAdmin, setIsVehAddedAdmin] = useState(false);

    const addVehicle = async (values) => {
        try {

            const user = auth.currentUser;
            const usersRef = collection(db, "users");

            // Creates document in Firestore with user data
            try {

                const auth = getAuth();
                const user = auth.currentUser;
                const dateObj = new Date();
                const date = (dateObj.getMonth() + 1) + "/" + dateObj.getDate() + "/" + dateObj.getFullYear()

                const docRef = await addDoc(collection(db, "vehicles"), {
                    make: values.make,
                    model: values.model,
                    modelYr: values.modelYr,
                    cusEmail: values.cusEmail,
                    cusPhone: values.cusPhone,
                    crBy: user.uid,
                    crDate: date
                });

                const q = query(usersRef, where("uid", "==", user.uid));
                const querySnapshot = await getDocs(q);
                var uid;
                var userType;
                querySnapshot.forEach((doc) => {
                    uid = doc.get("uid");
                    userType = doc.get("userType");
                });

                if (uid) {
                    console.log(querySnapshot)
                    console.log(q);
                    console.log(values.email + "   " + values.password);
                    if (userType == 2) {
                        await setIsVehAddedEmpl(true);
                    } else if (userType == 1) {
                        await setIsVehAddedAdmin(true);
                    }
                } else {
                    console.error("Bad user");
                }

            } catch (err) {
                console.error("Error adding document: ", err);
            }


        } catch (err) {
            console.error("Could not add vehicle", err);
        }
    };

    const initialValues = {
        make: '',
        model: '',
        modelYr: '',
        cusEmail: '',
        cusPhone: ''
    }

    const onSubmit = values => {
        console.log("Form Data", values)
        addVehicle(values)
    }

    const validationSchema = Yup.object({
        make: Yup.string().required("Required"),
        model: Yup.string().required("Required"),
        modelYr: Yup.string().required("Required"),
        cusEmail: Yup.string().required("Required").email('Invalid email format'),
        cusPhone: Yup.string().required("Required").matches("^\\(?([0-9]{3})\\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})$", "Invalid Phone #")
    })
    const errorStyle = {
        fontSize: '20px',
        color: 'darkred',
        marginBottom: '10px'
    }

    return (
        <div className="wrapper">
            <div className="auth-form-container">
                <img className="image"
                    src={APPLOGO}
                    alt="Company Logo"
                />
                <h2 style={{fontSize: '30px'}}>Add Vehicle</h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >

                    <Form className="login-form" style={{ display: 'flex', flexDirection: 'column', fontSize: '25px' }}>

                        <label htmlFor="make">Car Make</label>
                        <Field type="make" placeholder="Make" id="make" name="make" className="textfield" />
                        <ErrorMessage name="make" component='span' style={errorStyle} />

                        <label htmlFor="model">Car Model</label>
                        <Field type="model" placeholder="Model" id="model" name="model" className="textfield" />
                        <ErrorMessage name="model" component='span' style={errorStyle} />

                        <label htmlFor="modelYr">Model Year</label>
                        <Field type="modelYr" placeholder="Year" id="modelYr" name="modelYr" className="textfield" />
                        <ErrorMessage name="modelYr" component='span' style={errorStyle} />

                        <label htmlFor="cusEmail">Customer EMail</label>
                        <Field type="cusEmail" placeholder="EMail" id="cusEmail" name="cusEmail" className="textfield" />
                        <ErrorMessage name="cusEmail" component='span' style={errorStyle} />

                        <label htmlFor="cusPhone">Customer Phone #</label>
                        <Field type="cusPhone" placeholder="Phone #" id="cusPhone" name="cusPhone" className="textfield" />
                        <ErrorMessage name="cusPhone" component='span' style={errorStyle} />

                        <br />

                        <button type="submit" > Add New Vehicle</button>
                    </Form>
                </Formik>

                {isVehAddedAdmin && (
                    <Navigate replace to="/AdminHome" />
                )}
                {isVehAddedEmpl && (
                    <Navigate replace to="/EmplHome" />
                )}

            </div>
        </div>
    )
}