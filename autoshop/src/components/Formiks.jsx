import React, { useState, useEffect } from "react"
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Modal } from '@mui/material'


function LoginFormik({ initialValues, onSubmit, validationSchema }) {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >

            <Form className="login-form" style={{ display: 'flex', flexDirection: 'column', fontSize: '25px' }}>

                <label htmlFor="email">Username</label>
                <Field type="email" placeholder="Email" id="email" name="email" className="textfield" />
                <ErrorMessage name="email" component='span' style={{ fontSize: '20px', marginBottom: '10px', color: 'darkred' }} />

                <label htmlFor="password">Password</label>
                <Field type="password" placeholder="Password" id="password" name="password" className="textfield" />
                <ErrorMessage name="password" component='span' style={{fontSize: '20px', color: 'darkred'}}/>

                <br />

                <button type="submit" > Log In</button>
            </Form>
        </Formik>
    )
}

function RegisterFormik({ initialValues, onSubmit, validationSchema }) {
    const errorStyle = {
        fontSize: '20px',
        color: 'darkred',
        marginBottom: '10px'
    }
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >

            <Form className="register-form" style={{ display: 'flex', flexDirection: 'column', fontSize: '25px' }}>

                <label htmlFor="firstname">First Name</label>
                <Field type="firstname" placeholder="First Name" id="firstname" name="firstname" className="textfield" />
                <ErrorMessage name="firstname" component='span' style={errorStyle} />

                <label htmlFor="lastname">Last Name</label>
                <Field type="lastname" placeholder="Last Name" id="lastname" name="lastname" className="textfield" />
                <ErrorMessage name="lastname" component='span' style={errorStyle} />

                <label htmlFor="email address">Email Address</label>
                <Field type="emailaddress" placeholder="Email Address" id="emailaddress" name="emailaddress" className="textfield" />
                <ErrorMessage name="emailaddress" component='span' style={errorStyle} />

                <label htmlFor="password">Password</label>
                <Field type="password" placeholder="Password" id="password" name="password" className="textfield" />
                <ErrorMessage name="password" component='span' style={errorStyle} />

                <br />

                <button type="submit" > Register</button>
            </Form>
        </Formik>
    )
}

function EditWorkFormik({ initialValues, onSubmit, validationSchema }) {
    const errorStyle = {
        fontSize: '20px',
        color: 'red',
        marginBottom: '10px'
    }
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >

            <Form className="login-form" style={{ display: 'flex', flexDirection: 'column', fontSize: '25px' }}>

                <label htmlFor="workName">Work name</label>
                <Field type="workName" placeholder="Name" id="workName" name="workName" className="textfield" />
                <ErrorMessage name="workName" component='span' style={errorStyle} />

                <label htmlFor="workDesc">Work Description</label>
                <Field type="workDesc" placeholder="Description" id="workDesc" name="workDesc" className="textfield" />
                <ErrorMessage name="workDesc" component='span' style={errorStyle} />

                <label htmlFor="laborHours">Labor (hours)</label>
                <Field type="laborHours" placeholder="Hours" id="laborHours" name="laborHours" className="textfield" />
                <ErrorMessage name="laborHours" component='span' style={errorStyle} />

                <br />

                <button type="submit"> Submit Changes</button>
            </Form>
        </Formik>
    )
}

function EditVehFormik({ initialValues, onSubmit, validationSchema }) {
    const errorStyle = {
        fontSize: '20px',
        color: 'red',
        marginBottom: '10px'
    }
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >

            <Form className="login-form" style={{ display: 'flex', flexDirection: 'column', fontSize: '25px' }}>

                <label htmlFor="make">Make</label>
                <Field type="make" placeholder="Make" id="make" name="make" className="textfield" />
                <ErrorMessage name="make" component='span' style={errorStyle} />

                <label htmlFor="model">Model</label>
                <Field type="model" placeholder="Model" id="model" name="model" className="textfield" />
                <ErrorMessage name="model" component='span' style={errorStyle} />

                <label htmlFor="modelYr">Model Year</label>
                <Field type="modelYr" placeholder="Year" id="modelYr" name="modelYr" className="textfield" />
                <ErrorMessage name="modelYr" component='span' style={errorStyle} />

                <label htmlFor="cusEmail">Customer Email</label>
                <Field type="cusEmail" placeholder="Email" id="cusEmail" name="cusEmail" className="textfield" />
                <ErrorMessage name="cusEmail" component='span' style={errorStyle} />

                <label htmlFor="cusPhone">Customer Phone #</label>
                <Field type="cusPhone" placeholder="Phone #" id="cusPhone" name="cusPhone" className="textfield" />
                <ErrorMessage name="cusPhone" component='span' style={errorStyle}  />

                <br />

                <button type="submit"> Submit Changes</button>
            </Form>
        </Formik>
    )
}

function AddPartFormik({ initialValues, onSubmit, validationSchema }) {
    const errorStyle = {
        fontSize: '20px',
        color: 'red',
        marginBottom: '10px'
    }
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >

            <Form className="login-form" style={{ display: 'flex', flexDirection: 'column', fontSize: '25px' }}>

                <label htmlFor="partName">Part Name</label>
                <Field type="partName" placeholder="Name" id="partName" name="partName" className="textfield" />
                <ErrorMessage name="partName" component='span' style={errorStyle} />

                <label htmlFor="partPrice">Part Price</label>
                <Field type="partPrice" placeholder="Price" id="partPrice" name="partPrice" className="textfield" />
                <ErrorMessage name="partPrice" component='span' style={errorStyle} />

                <label htmlFor="partDescription">Part Description</label>
                <Field type="partDescription" placeholder="Description" id="partDescription" name="partDescription" className="textfield" />
                <ErrorMessage name="partDescription" component='span' style={errorStyle} />

                <label htmlFor="partLink">Part Link</label>
                <Field type="partLink" placeholder="Link" id="partLink" name="partLink" className="textfield" />
                <ErrorMessage name="partLink" component='span' style={errorStyle} />

                <label htmlFor="quantity">Quantity</label>
                <Field type="quantity" placeholder="#" id="quantity" name="quantity" className="textfield" />
                <ErrorMessage name="quantity" component='span' style={errorStyle} />

                <br />

                <button type="submit"> Submit Changes</button>
            </Form>
        </Formik>
    )
}

function UpdatePartFormik({ initialValues, onSubmit, validationSchema }) {
    const errorStyle = {
        fontSize: '20px',
        color: 'red',
        marginBottom: '10px'
    }
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >

            <Form style={{display: 'flex', flexDirection: 'column', fontSize: '25px'}}>

                <label htmlFor="partName">Part Name</label>
                <Field type="partName" placeholder="Name" id="partName" name="partName" className="textfield" />
                <ErrorMessage name="partName" component='span' style={errorStyle} />

                <label htmlFor="partPrice">Part Price</label>
                <Field type="partPrice" placeholder="Price" id="partPrice" name="partPrice" className="textfield" />
                <ErrorMessage name="partPrice" component='span' style={errorStyle} />

                <label htmlFor="partDescription">Part Description</label>
                <Field type="partDescription" placeholder="Description" id="partDescription" name="partDescription" className="textfield" />
                <ErrorMessage name="partDescription" component='span' style={errorStyle} />

                <label htmlFor="partLink">Part Link</label>
                <Field type="partLink" placeholder="Link" id="partLink" name="partLink" className="textfield" />
                <ErrorMessage name="partLink" component='span' style={errorStyle} />

                <label htmlFor="quantity">Quantity</label>
                <Field type="quantity" placeholder="#" id="quantity" name="quantity" className="textfield" />
                <ErrorMessage name="quantity" component='span' style={errorStyle} />

                <br />

                <button type="submit" style={{ height: '60px', fontSize: '25px' }}> Submit Changes</button>
            </Form>
        </Formik>
    )
}

function AddWorkFormik({ initialValues, onSubmit, validationSchema }) {
    const errorStyle = {
        fontSize: '20px',
        color: 'red',
        marginBottom: '10px'
    }
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >

            <Form className="login-form" style={{ display: 'flex', flexDirection: 'column', fontSize: '25px' }}>

                <label htmlFor="workName">Work Name</label>
                <Field type="workName" placeholder="Work" id="workName" name="workName" className="textfield" />
                <ErrorMessage name="workName" component='span' style={errorStyle} />

                <label htmlFor="workDesc">Work Description</label>
                <Field type="workDesc" placeholder="Description" id="workDesc" name="workDesc" className="textfield" />
                <ErrorMessage name="workDesc" component='span' style={errorStyle} />

                <label htmlFor="laborHours">Labor (hours)</label>
                <Field type="laborHours" placeholder="Hours" id="laborHours" name="laborHours" className="textfield" />
                <ErrorMessage name="laborHours" component='span' style={errorStyle} />

                <br />

                <button type="submit" >Add New Work</button>
            </Form>
        </Formik>
    )
}

export { AddWorkFormik, EditVehFormik, RegisterFormik, LoginFormik, EditWorkFormik, AddPartFormik, UpdatePartFormik };