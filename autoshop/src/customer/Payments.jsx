import React, { useState, useEffect } from "react"
import { Link, Navigate, useLocation } from "react-router-dom"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { db, auth } from "./../firebase"
import { TopBar } from "../components/Bars"
import { Modal } from '@mui/material'
import { getPaymentByUser } from '../fun/VehicleFunctions'
import { ArrowForwardIos, Close } from '@mui/icons-material'

export const Payments = () => {

    const location = useLocation();
    const userInfo = location.state.userInfo
    const [paymentObj, setPaymentObj] = useState()
    const [paymentIndex, setPaymentIndex] = useState()

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

    //MODAL OPEN AND CLOSE FUNCTIONS
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => {
        setPaymentIndex()
        setOpen(false)
    }


    //Get payment list on load
    useEffect(() => {

        getPaymentByUser(userInfo.emailAddress, userInfo.userType)
            .then(data =>
                setPaymentObj(data)
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


            {paymentObj && (
                <div className="wrapper">
                    <h2 style={{ paddingLeft: '20px', paddingRight: '20px', marginBottom: '5px', fontSize: '35px' }}>Pending Payments</h2>
                    {userInfo.userType == 3 && (
                        <span style={{ textAlign: 'right', marginRight: '30vw', fontSize: '23px' }}>
                            Subtotal: ${paymentObj.total}<br />
                            Tax: ${paymentObj.taxes}<br />
                            Total: ${paymentObj.grandTotal}
                        </span>
                    ) }<br />
                    <div className="tableContainer">
                        <table>
                            <thead>
                                <tr>
                                    <th>Vehicle</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentObj.payArr &&
                                    paymentObj.payArr.map((pay, index) => (
                                        <tr key={index} style={{fontSize: '20px'}}>
                                            <td>{pay.modelYr} {pay.make}</td>
                                            <td>
                                                {userInfo.userType != 3 ? (
                                                    pay.paid == 0 ?
                                                        <button onClick={() => {
                                                            setPaymentIndex({ index, status: 0 })
                                                            handleOpen()
                                                        }}>Process</button>
                                                        :
                                                        <button onClick={() => {
                                                            setPaymentIndex({ index, status: 1 })
                                                            handleOpen()
                                                        }}>Paid</button>
                                                ) : (
                                                    <button>${pay.amount}</button>
                                                ) }
                                            </td>
                                        </tr>
                                    ))
                                }

                            </tbody>
                        </table>
                    </div>
                </div>
            )}




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
                <div className="modal" style={{ height: '500px' }}>
                    <div className="header">
                        Adjust Payment Status
                        <Close
                            style={{ fontSize: '39px' }}
                            onClick={() => {
                                handleClose()
                            }}
                        />
                    </div>
                    {paymentIndex && (
                        <div style={{marginTop: '10px'}}>
                            {paymentIndex.status == 1 ? (
                                <div className="content">
                                    <span style={{ fontSize: '20px' }}>
                                        User: {paymentObj.payArr[paymentIndex.index].cusEmail}<br />
                                        Vehicle: {paymentObj.payArr[paymentIndex.index].make}<br />
                                        Amount paid: ${paymentObj.payArr[paymentIndex.index].amount}<br />
                                    </span>
                                </div>
                            ) : (
                                <div className="content">
                                    <span style={{ fontSize: '20px' }}>
                                        User: {paymentObj.payArr[paymentIndex.index].cusEmail}<br />
                                        Vehicle: {paymentObj.payArr[paymentIndex.index].make}<br />
                                        Amount to pay: ${paymentObj.payArr[paymentIndex.index].amount}<br />
                                    </span>
                                </div>
                            )}
                        </div>
                    ) }
                </div>
            </Modal>
        </div>
    )
}