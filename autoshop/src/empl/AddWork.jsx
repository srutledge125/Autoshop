import React, { useState, useEffect } from "react"
import { Link, Navigate, useLocation } from "react-router-dom"
import APPLOGO from '../assets/APPLOGO.png';
import { getAuth } from "firebase/auth"
import { collection, addDoc, query, where, getDocs, doc } from "firebase/firestore";
import { db, auth } from "../firebase"
import { Edit } from '@mui/icons-material';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Modal } from '@mui/material'
import { addWork } from '../fun/VehicleFunctions'

export const AddWork = () => {

    const [isFormFilled, setIsFormFilled] = useState(false)
    const location = useLocation();
    const vehId = location.state;
    const vehRef = collection(db, "vehicles");
    const vehicleRef = doc(db, "vehicles", vehId.id);

    const initialValues = {
        workName: '',
        workDesc: '',
        laborHours: 0
    }

    const onSubmit = values => {
        console.log("Form Data", values)
        addWork(values, vehId)
    }

    const validationSchema = Yup.object({
        workName: Yup.string().required("Required"),
        workDesc: Yup.string().required("Required"),
        laborHours: Yup.number().min(0, "Min hours: 0").typeError("Must be numeric")
    })

    return (
        <div className="wrapper">
            <h2 >Add Work</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >

                <Form className="login-form">

                    <label htmlFor="workName">Work Name</label>
                    <Field type="workName" placeholder="Work" id="workName" name="workName" />
                    <ErrorMessage name="workName" />

                    <label htmlFor="workDesc">Work Description</label>
                    <Field type="workDesc" placeholder="Description" id="workDesc" name="workDesc" />
                    <ErrorMessage name="workDesc" />

                    <label htmlFor="laborHours">Labor (hours)</label>
                    <Field type="laborHours" placeholder="Hours" id="laborHours" name="laborHours" />
                    <ErrorMessage name="laborHours" />

                    <br />

                    <button type="submit" >Add New Work</button>
                </Form>
            </Formik>
            {isFormFilled && (
                <Navigate replace state={vehId} to="/EditVehicle" /> 
            )}
        </div>
    )
}