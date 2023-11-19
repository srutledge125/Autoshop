import React, { useState, useEffect } from "react"
import { Link, Navigate, useLocation } from "react-router-dom"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { db, auth } from "./../firebase"
import { TopBar } from "../components/Bars"
import { Modal } from '@mui/material'
import { getVehicleAll } from '../fun/VehicleFunctions'
import { ArrowForwardIos, Edit, Visibility } from '@mui/icons-material'

export const AllVehicles = () => {

    const location = useLocation();
    const userInfo = location.state;

    const [vehArr, setVehArr] = useState()

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

    //PAGE LOAD
    useEffect(() => {
        getVehicleAll(userInfo.userType, userInfo.emailAddress)
            .then(data => {
                setVehArr(data)
            }
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
                        <button style={buttonStyling}>Update Account<ArrowForwardIos style={{ position: 'absolute', right: '30px' }} /></button>
                        <button style={buttonStyling}>Work History<ArrowForwardIos style={{ position: 'absolute', right: '30px' }} /></button>
                        <button style={buttonStyling}>Payment History<ArrowForwardIos style={{ position: 'absolute', right: '30px' }} /></button>
                        <button
                            className="button"
                            style={{ marginTop: '20px' }}
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
                    <h2 style={{ fontSize: '30px' }}>Viewing All Vehicles</h2>
                    <div className="tableContainer">
                        <table>
                            <thead>
                                <tr>
                                    <th>Vehicle</th>
                                    {userInfo.userType == 3 ?
                                        <th>View</th>
                                        :
                                        <th>Edit</th>
                                    }
                                </tr>
                            </thead>
                            <tbody>

                                {vehArr.map((veh, index) => (
                                    <tr key={index}>
                                            <td style={{ fontSize: '24px', backgroundColor: vehArr[index].color }}>{veh.modelYr} {veh.make}</td>
                                        <td style={{ backgroundColor: vehArr[index].color }}>
                                                {userInfo.userType == 3 ?
                                                    <Link to="/EditVehicle" state={{ id: vehArr[index].id, userInfo: userInfo }}>
                                                        <Visibility onClick={() => { }} className="material-icons" style={{ color: 'black', fontSize: '40px' }} />
                                                    </Link>
                                                    :
                                                    <Link to="/EditVehicle" state={{ id: vehArr[index].id, userInfo: userInfo }}>
                                                        <Edit onClick={() => { }} className="material-icons" style={{ color: 'black', fontSize: '40px' }} />
                                                    </Link>
                                                }
                                            </td>
                                        </tr>
                                    ))}

                            </tbody>
                        </table>
                    </div>
                </div>
            ) }
        </div>
    )
}