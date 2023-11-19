import React, { useState, useEffect } from "react"
import { Link, Navigate, useLocation } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import { db, auth } from "./../firebase"
import { TopBar } from "../components/Bars"
import { Modal } from '@mui/material'
import { getInProgressVeh } from '../fun/VehicleFunctions'
import { ArrowForwardIos } from '@mui/icons-material'

export const AdminHome = () => {

    onAuthStateChanged(auth, (user) => {
        if (user) {
            //
        } else {
            //Sign out if invaid user
        }
    });

    const location = useLocation();
    const userInfo = location.state.userInfo;

    const [vehArr, setVehArr] = useState();

    //TOP BAR FUNCTIONS AND VARIABLES
    const [anchorEl, setAnchorEl] = useState(null)
    const openMenu = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    const handleCloseMenuAcc = async () => {
        handleOpenAccModal()
        setAnchorEl(null);
    };
    const [openAccModal, setOpenAccModal] = useState(false);
    const handleOpenAccModal = () => {
        setOpenAccModal(true);
    }
    const handleCloseAccModal = () => setOpenAccModal(false);
    const buttonStyling = {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        height: '60px',
        fontSize: '20px',
        marginBottom: '10px'
    }
    ////////////////////////////////

    //Get in-progress list on load
    useEffect(() => {

        getInProgressVeh(userInfo.userType, userInfo.emailAddress)
            .then(data =>
                setVehArr(data)
            );
    }, [])

    return (
        <div>
            <TopBar
                openMenu={openMenu}
                handleClick={handleClick}
                anchorEl={anchorEl}
                handleCloseMenu={handleCloseMenu}
                handleCloseMenuAcc={handleCloseMenuAcc}
                userInfo={userInfo}
            />
            <Modal
                open={openAccModal}
                onClose={handleCloseAccModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                    padding: '0px',
                    width: '100vw',
                    height: '500px'
                }}
            >
                <div className="modal">
                    <div className="header"> Hello, {userInfo.firstName}</div>
                    <div className="actions" style={{ display: 'flex', flexDirection: 'column' }}>
                        <button style={buttonStyling}>Update Account<ArrowForwardIos style={{position: 'absolute', right: '30px'}} /></button>
                        <button style={buttonStyling}>Work History<ArrowForwardIos style={{ position: 'absolute', right: '30px' }} /></button>
                        <button style={buttonStyling}>Payment History<ArrowForwardIos style={{ position: 'absolute', right: '30px' }} /></button>
                        <button
                            style={buttonStyling}
                            onClick={() => {
                                handleCloseAccModal()
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>


            {vehArr && (
                <div className="wrapper">
                    <h2 style={{ fontSize: '35px' }}>Welcome, {userInfo.firstName}!</h2>

                    <Link to="/Payments" state={{ userInfo }}>
                        <button className="navButton">Payments<ArrowForwardIos /></button>
                    </Link>
                    {userInfo.userType != 3 && (
                        <Link to="/AddVehicle" state={{ userInfo }}>
                            <button className="navButton">Add Vehicle<ArrowForwardIos /></button>
                        </Link>
                    )}
                    {userInfo.userType == 1 && (
                        <Link to="/Accounts" state={{ userInfo }}>
                            <button className="navButton">Accounts<ArrowForwardIos /></button>
                        </Link>
                    ) }

                    <Link to="/AllVehicles" state={userInfo}>
                        <button className="navButton">All Vehicles<ArrowForwardIos /></button>
                    </Link>

                    <h2>In Progress:</h2>



                    {vehArr && (
                        <div className="tableContainer" style={{ height: 'max(30vh, 300px)' }}>
                            <table>
                                <tbody>
                                    {vehArr.map((car, index) => (
                                        <tr key={index}>
                                            <td>
                                                <Link to="/EditVehicle" state={{ id: car.id, userInfo: userInfo }}>
                                                    <button className="link-btn" style={{ fontSize: '20px' }}>{car.modelYr} {car.make} {car.model}</button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}


        </div>
        
    )
}