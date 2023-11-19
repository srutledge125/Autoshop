import React, { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import APPLOGO from '../assets/APPLOGO.png';
import { getAuth } from "firebase/auth"
import { getDoc, doc } from "firebase/firestore"
import { db, auth } from "./../firebase"

export const CusHome = () => {



    return (
        <div>
            <img className="image"
                src={APPLOGO}
                alt="Company Logo"
            />
            <Link to="/login">
                <button >Log Out</button>
            </Link>
            <h2>In Progress:</h2>
        </div>
        
    )
}