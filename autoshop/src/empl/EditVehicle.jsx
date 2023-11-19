import React, { useState, useEffect } from "react"
import { Link, Navigate, useLocation } from "react-router-dom"
import APPLOGO from '../assets/APPLOGO.png'
import { getAuth } from "firebase/auth"
import { doc } from "firebase/firestore"
import { db, auth } from "../firebase"
import { Edit, ArrowForwardIos, Close } from '@mui/icons-material'
import * as Yup from 'yup'
import { Modal } from '@mui/material'
import { getVehicleById, updateVehicle, getWorkByVeh, addWork, getPaymentStatus } from '../fun/VehicleFunctions'
import { AddWorkFormik, EditVehFormik } from '../components/Formiks'
import { TopBar } from "../components/Bars"


export const EditVehicle = () => {

    const [vehInfo, setVehInfo] = useState({
        make: '',
        model: '',
        modelYr: '',
        cusEmail: '',
        cusPhone: ''
    });
    const [workArr, setWorkArr] = useState()
    const [paymentStatus, setPaymentStatus] = useState()
    const [paymentStatusColor, setPaymentStatusColor] = useState()
    const location = useLocation()
    const vehId = location.state.id
    const userInfo = location.state.userInfo
    const vehicleRef = doc(db, "vehicles", vehId)

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

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [open2, setOpen2] = useState(false);
    const handleOpen2 = () => setOpen2(true);
    const handleClose2 = () => setOpen2(false);

    useEffect(() => {
        getVehicleById(vehId)
            .then(data =>
                setVehInfo(data[0])
        );

        getWorkByVeh(vehId)
            .then(data => {
                console.log(data)
                setWorkArr(data)
            }
        );

        getPaymentStatus(vehId)
            .then(data => {
                if (data == 'Payment Required') {
                    setPaymentStatusColor('darkred')
                } else {
                    setPaymentStatusColor('green')
                }
                console.log(data)
                setPaymentStatus(data)
            }
        );
    }, [])

    //FORMIK FOR EDIT VEHICLE
    const initialValues = {
        make: vehInfo.make,
        model: vehInfo.model,
        modelYr: vehInfo.modelYr,
        cusEmail: vehInfo.cusEmail,
        cusPhone: vehInfo.cusPhone
    }

    const onSubmit = values => {
        console.log("Form Data: ", values)
        updateVehicle(values, vehicleRef)
        setVehInfo({
            make: values.make,
            model: values.model,
            modelYr: values.modelYr,
            cusEmail: values.cusEmail,
            cusPhone: values.cusPhone
        })
        handleClose()
    }

    const validationSchema = Yup.object({
        make: Yup.string().required("Required"),
        model: Yup.string().required("Required"),
        modelYr: Yup.number().min(0, "Invalid Year").typeError("Must be numeric"),
        cusEmail: Yup.string().required("Required").email('Invalid email format')
    })

    //FORMIK FOR ADD WORK
    const initialValues2 = {
        workName: '',
        workDesc: '',
        laborHours: 0
    }

    const onSubmit2 = async values => {
        const result = await addWork(values, vehId)
        console.log(result)
        if (result) {
            workArr.push({
                id: result.id,
                workName: values.workName,
                status: 0
            })
            handleClose2()
        }
    }

    const validationSchema2 = Yup.object({
        workName: Yup.string().required("Required"),
        workDesc: Yup.string().required("Required"),
        laborHours: Yup.number().required("Required").min(0, "Min hours: 0").typeError("Must be numeric")
    })


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

            {workArr && paymentStatus && (
                <div className="wrapper">
                    <h2 style={{ paddingLeft: '20px', paddingRight: '20px', marginBottom: '5px', fontSize: '30px' }}>{vehInfo.modelYr} {vehInfo.make} {vehInfo.model}</h2>
                    
                    {userInfo.userType != 3 && (
                        <div>
                            <span style={{ marginBottom: '15px' }}><Edit onClick={handleOpen} style={{ color: 'black', fontSize: 30 }} /> </span><br/><br/>
                            <button onClick={handleOpen2} className="navButton">Add Work<ArrowForwardIos /></button>
                        </div>
                    )}

                    {paymentStatus != '0' && (
                        <span style={{marginTop: '10px', fontFamily: 'RalewayBold', fontSize: '25px', color: paymentStatusColor}}>{paymentStatus}</span>
                    ) }

                    <h2>Work:</h2>
                    {workArr && (
                        <div className="tableContainer">
                            <table>
                                <thead>
                                    <tr>
                                        <td>Name</td>
                                        <td>Status</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {workArr.map((work, index) => (
                                        <tr key={index}>
                                            <td>
                                                <Link to="/EditWork" state={{ id: work.id, userInfo: userInfo }}>
                                                    <button className="link-btn">{work.workName} </button>
                                                </Link>
                                            </td>
                                            {work.status == 0 &&
                                                <td>Waiting</td>
                                            }
                                            {work.status == 1 &&
                                                <td>In Progress</td>
                                            }
                                            {work.status == 2 &&
                                                <td>Complete</td>
                                            }
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) }
            
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
                    <div className="header">
                        Edit Vehicle
                        <Close
                            style={{ fontSize: '39px' }}
                            onClick={() => {
                                handleClose()
                            }}
                        />
                    </div>
                    <div className="content">
                        <EditVehFormik
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                            initialValues={initialValues}
                        />
                    </div>
                </div>
            </Modal>
            <Modal
                open={open2}
                onClose={handleClose2}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                    padding: '0px',
                    width: '100vw'
                }}
            >
                <div className="modal" style={{ height: '60%' }}>
                    <div className="header">
                        Add Work
                        <Close
                            style={{ fontSize: '39px' }}
                            onClick={() => {
                                handleClose2()
                            }}
                        />
                    </div>
                    <div className="content">
                        <AddWorkFormik
                            validationSchema={validationSchema2}
                            onSubmit={onSubmit2}
                            initialValues={initialValues2}
                        />
                    </div>
                </div>
            </Modal>
        </div>
        
    )
}