import React, { useState, useEffect } from "react"
import { Link, Navigate, useLocation } from "react-router-dom"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { db, auth } from "./../firebase"
import { TopBar } from "../components/Bars"
import { Modal } from '@mui/material'
import { getUserInfo, setUserType } from '../fun/VehicleFunctions'
import { Edit, ArrowForwardIos } from '@mui/icons-material'

export const Accounts = () => {

    //USER VERIFICATION
    onAuthStateChanged(auth, (user) => {
        if (user) {
            //
        } else {
            //Sign out if invaid user
        }
    });

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

    //EDIT ACCOUNT MODAL
    const [open, setOpen] = useState(false)
    const handleOpen = (index) => {
        setSelAcc(accArr[index])
        setOpen(true)
    }
    const handleClose = () => {
        getUserInfo(userInfo.userType, userInfo.uid)
            .then(data =>
                setAccArr(data)
            );
        setOpen(false);
    }

    //VARIABLES
    const [accArr, setAccArr] = useState([])
    const [selAcc, setSelAcc] = useState({
        firstName: '',
        lastName: '',
        emailAddress: '',
        userType: ''
    })
    const location = useLocation();
    const userInfo = location.state.userInfo;
    const userType = location.state.userType
    const setTypeStyles = {
        marginBottom: '10px',
        height: '80px',
        fontFamily: 'RalewayLight',
        fontSize: '23px'
    }

    //PAGE LOAD
    useEffect(() => {

        getUserInfo(userInfo.userType, userInfo.uid)
            .then(data =>
                setAccArr(data)
        );

    }, [])

    //Setting user type logic
    const setUserTypeLoc = async (userType) => {
        const success = await setUserType(userType, selAcc.uid)
        if (success == 1) {
            handleClose()
        } else {
            console.log(success)
        }
    }

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



            <div className="wrapper">
                <h2 style={{fontSize: '30px'}} >Viewing All Accounts</h2>
                <div className="tableContainer">
                    <table style={{tableLayout: 'fixed'}}>
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th style={{width: '5%'}}>Email</th>
                                <th style={{width: '0.01%'}}>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accArr.map((acc, index) => (
                                <tr key={index}>
                                    <td className="ellipsis"><span>{acc.firstName}</span></td>
                                    <td className="ellipsis"><span>{acc.lastName}</span></td>
                                    <td className="ellipsis"><span>{acc.emailAddress}</span></td>
                                    <td className="ellipsis"><Edit onClick={() => {
                                        handleOpen(index)
                                    }} className="material-icons" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>



            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                    padding: '0px',
                    width: '100vw'
                }}
            >
                <div className="modal">
                    <div className="header"> Edit Account </div>
                    <div className="content" style={{textAlign: 'center'}}>
                        <span className="bodySpan">{selAcc.firstName} {selAcc.lastName}<br/></span>
                        <span className="bodySpan">{selAcc.emailAddress}</span><br/>
                        {selAcc.userType == 1 &&
                            <span className="bodySpan">Administrator<br /></span>
                        }
                        {selAcc.userType == 2 &&
                            <span className="bodySpan">Employee<br /></span>
                        }
                        {selAcc.userType == 3 &&
                            <span className="bodySpan">Customer<br/></span>
                        }
                        
                    </div>
                    <div className="actionsEditAccount">
                        {selAcc.userType != 3 && (
                            <button
                                style={setTypeStyles}
                                onClick={() => {
                                    setUserTypeLoc(3)
                                } }
                            >Set to Customer</button>
                        )}
                        {selAcc.userType != 2 && (
                            <button
                                style={setTypeStyles}
                                onClick={() => {
                                    setUserTypeLoc(2)
                                }}
                            >Set to Employee</button>
                        )}
                        {selAcc.userType != 1 && (
                            <button
                                style={setTypeStyles}
                                onClick={() => {
                                    setUserTypeLoc(1)
                                }}
                            >Set to Admin</button>
                        )}
                        <button
                            style={setTypeStyles}
                            className="button"
                            onClick={() => {
                                handleClose()
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}