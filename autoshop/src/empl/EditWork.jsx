import React, { useState, useEffect } from "react"
import { Link, Navigate, useLocation } from "react-router-dom"
import APPLOGO from '../assets/APPLOGO.png';
import { getAuth } from "firebase/auth"
import { doc } from "firebase/firestore";
import { db, auth } from "../firebase"
import { Edit, ArrowForwardIos, Close } from '@mui/icons-material';
import * as Yup from 'yup'
import { Modal } from '@mui/material'
import { deletePart, updateWork, getPartsByWorkId, getWorkByRef, getVehicleByWorkRef, addPart, updateWorkStatus, updatePart, completeWork } from '../fun/VehicleFunctions'
import { EditWorkFormik, AddPartFormik, UpdatePartFormik } from "../components/Formiks";
import { TopBar } from "../components/Bars";


export const EditWork = () => {

    const [workInfo, setWorkInfo] = useState({});
    const [partsArr, setPartsArr] = useState();
    const [partsArrIndex, setPartsArrIndex] = useState(0)
    const [statusString, setStatusString] = useState('');
    const [vehInfo, setVehInfo] = useState({ modelYr: '', make: '', model: '' });
    const [errComplete, setErrComplete] = useState('')
    const [isComplete, setIsComplete] = useState(false)
    const location = useLocation();
    const userInfo = location.state.userInfo
    const workRef = doc(db, "work", location.state.id);

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

    //Set which modal the confirm is coming from
    const [confirm, setConfirm] = useState()

    //MODAL OPEN AND CLOSE FUNCTIONS
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const [open2, setOpen2] = useState(false)
    const handleOpen2 = () => setOpen2(true)
    const handleClose2 = () => setOpen2(false)

    const [open3, setOpen3] = useState(false)
    const handleOpen3 = () => setOpen3(true)
    const handleClose3 = async (status) => {
        if (status != workInfo.status && status != -1) {
            //Perform update based on selected status
            if (status == 0) {
                updateWorkStatus(workRef, status)
                setStatusString('Queued')
                workInfo.status = 0
            } else if (status == 1) {
                updateWorkStatus(workRef, status)
                setStatusString('In Progress')
                workInfo.status = 1
            } else if (status == 2) {
                setConfirm(1)
                handleOpenConfirm()
            }
        }
        setOpen3(false)
    }

    const [open4, setOpen4] = useState(false)
    const handleOpen4 = (partArrIndex) => {
        setPartsArrIndex(partArrIndex)
        console.log(partsArr[partArrIndex])
        setInitialValues3({
            partName: partsArr[partArrIndex].partName,
            partPrice: partsArr[partArrIndex].partPrice,
            partDesc: partsArr[partArrIndex].partDesc,
            partLink: partsArr[partArrIndex].partLink,
            quantity: partsArr[partArrIndex].quantity
        })
        setOpen4(true)
    }
    const handleClose4 = (close) => {
        try {
            if (close == 1) {
                //Delete Part
                setConfirm(2)
                handleOpenConfirm()
            } else {
                //Update Part Array
                getPartsByWorkId(location.state.id)
                    .then(data =>
                        setPartsArr(data)
                    );
            }
            setOpen4(false)
        } catch (e) {
            console.log(e)
        }
    }

    //Modal functions for complete confirmation
    const [openConfirm, setOpenConfirm] = useState(false)
    const handleOpenConfirm = () => setOpenConfirm(true)
    const handleCloseConfirm = async (choice) => {
        if (choice == 1) {
            if (confirm == 1) {
                const result = await completeWork(workInfo.id)
                if (result == 1) {
                    setOpenConfirm(false)
                    setIsComplete(true)
                    setConfirm()
                } else {
                    setErrComplete('Failed to Complete Work')
                }
            } else if (confirm == 2) {
                await deletePart(partsArr[partsArrIndex].id)
                //Update Part Array
                getPartsByWorkId(location.state.id)
                    .then(data =>
                        setPartsArr(data)
                    );
                setOpenConfirm(false)
                setConfirm()
            }
        } else if (choice == 0) {
            setConfirm()
            setOpenConfirm(false)
            setErrComplete('')
        }
        
    }

    useEffect(() => {
        let active = true
        load()
        return () => { active = false }

        async function load() {
            try {
                const workInfoRet = await getWorkByRef(workRef)
                const partsArrRet = await getPartsByWorkId(location.state.id)
                const vehInfoRet = await getVehicleByWorkRef(workRef)
                setWorkInfo(workInfoRet[0])
                setVehInfo(vehInfoRet)
                setPartsArr(partsArrRet)
                if (workInfoRet[0].status == 0) {
                    setStatusString('Queued')
                } else if (workInfoRet[0].status == 1) {
                    setStatusString('In Progress')
                } else if (workInfoRet[0].status == 2) {
                    setStatusString('Completed')
                }
            } catch (err) {
                console.log(err)
            }
            
            if (!active) { return }
        }
    }, [])

    //FORMIK FOR EDIT WORK
    const initialValues = {
        workName: workInfo.workName,
        workDesc: workInfo.workDesc,
        laborHours: workInfo.laborHours
    }
    const onSubmit = values => {
        updateWork(values, workRef)
        setWorkInfo({
            workName: values.workName,
            workDesc: values.workDesc,
            laborHours: values.laborHours
        })
        handleClose()
    }
    const validationSchema = Yup.object({
        workName: Yup.string().required("Required"),
        workDesc: Yup.string().required("Required"),
        laborHours: Yup.number().required("Required").min(0, "Min hours: 0").typeError("Must be numeric")
    })
    //FORMIK FOR ADD PART
    const initialValues2 = {
        partName: '',
        partPrice: 0,
        partDesc: '',
        partLink: '',
        quantity: 1
    }
    const onSubmit2 = values => {
        console.log(values)
        console.log(location.state.id)
        addPart(values, location.state.id)
        handleClose2()
        let active = true
        load()
        return () => { active = false }

        async function load() {
            try {
                const partsArrRet = await getPartsByWorkId(location.state.id)
                setPartsArr(partsArrRet)
            } catch (err) {
                console.log(err)
            }

            if (!active) { return }
        }
        
    }
    const validationSchema2 = Yup.object({
        partName: Yup.string().required("Required"),
        partPrice: Yup.number().required("Required").min(0, "Min price: 0").typeError("Must be numeric").test(
            "maxDigitsAfterDecimal",
            "Max 2 digits after decimal",
            (number) => Number.isInteger(number * (10 ** 2))
        ),
        quantity: Yup.number().required("Required").min(0, "Min quan: 0").typeError("Must be numeric")
    })
    //FORMIK FOR UPDATE PART
    const [initialValues3, setInitialValues3] = useState({
        partName: '',
        partPrice: '',
        partDesc: '',
        partLink: '',
        quantity: 1
    })
    const onSubmit3 = async values => {
        console.log(values)
        console.log(partsArr[partsArrIndex].id)
        const partRef = await doc(db, 'parts', partsArr[partsArrIndex].id);
        await updatePart(values, partRef)
        handleClose4()

    }
    const validationSchema3 = Yup.object({
        partName: Yup.string().required("Required"),
        partPrice: Yup.number().required("Required").min(0, "Min price: 0").typeError("Must be numeric").test(
            "maxDigitsAfterDecimal",
            "Max decimals: 2",
            (number) => Number.isInteger(number * (10 ** 2))
        ),
        quantity: Yup.number().required("Required").min(0, "Min quan: 0").typeError("Must be numeric")
    })
    //////////////////////////////


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



            {partsArr && (
                <div className="wrapper">
                    <h2 style={{ paddingLeft: '10px', paddingRight: '10px', fontSize: '30px' }}>{statusString} {workInfo.workName} for {vehInfo.modelYr} {vehInfo.make} {vehInfo.model}<br />
                        {userInfo.userType != 3 && workInfo.status != 2 && (
                            <Edit onClick={handleOpen} style={{ color: 'black', fontSize: 30 }} />
                        ) }
                    </h2>
                    {userInfo.userType != 3 && workInfo.status != 2 && (
                            <button className="navButton" onClick={handleOpen3}>Set Status</button>
                    )}
                    {userInfo.userType != 3 && workInfo.status != 2 && (
                        <button className="navButton" onClick={handleOpen2}>Add Part</button>
                    )}
                    <h3>Parts: </h3>
                    {partsArr && (
                        <div className="tableContainer">
                            <table>
                                <thead>
                                    <tr>
                                        <td>Name</td>
                                        <td>Price</td>
                                        <td>#</td>
                                        {userInfo.userType != 3 && workInfo.status != 2 && (
                                            <td>Edit</td>
                                        ) }
                                    </tr>
                                </thead>
                                <tbody>
                                    {partsArr.map((part, index) => (
                                        <tr key={index}>
                                            <td>
                                                <button onClick={() => {
                                                    if (part.partLink != '') {
                                                        window.open(part.partLink, "_blank")
                                                    }
                                                }} className="link-btn">{part.partName} </button>
                                            </td>
                                            <td>${part.partPrice}</td>
                                            <td>{part.quantity}</td>
                                            {userInfo.userType != 3 && workInfo.status != 2 && (
                                                <td><Edit onClick={() => {
                                                    handleOpen4(index)
                                                }} className="material-icons" /></td>
                                            ) }
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
            {isComplete && (
                <Navigate replace state={{ id: vehInfo.id, userInfo: userInfo }} to="/EditVehicle" />
            )}


            
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
                <div className="modal">
                    <div className="header">
                        Add Part
                        <Close
                            style={{ fontSize: '39px' }}
                            onClick={() => {
                                handleClose2()
                            }}
                        />
                    </div>
                    <div className="content">
                        <AddPartFormik
                            validationSchema={validationSchema2}
                            onSubmit={onSubmit2}
                            initialValues={initialValues2}
                        />
                    </div>
                </div>
            </Modal>
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
                        Edit Work
                        <Close
                            style={{ fontSize: '39px' }}
                            onClick={() => {
                                handleClose()
                            }}
                        /> </div>
                    <div className="content">
                        <EditWorkFormik
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                            initialValues={initialValues}
                        />
                    </div>
                </div>
            </Modal>
            <Modal
                open={open3}
                onClose={handleClose3}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                    padding: '0px',
                    width: '100vw'
                }}
            >
                <div className="modalStatusPicker">
                    <div className="header">
                        Set Status
                        <Close
                            style={{ fontSize: '39px' }}
                            onClick={() => {
                                handleClose3(-1)
                            }}
                        />
                    </div>
                    <div className="actions">
                        {workInfo.status != 0 && (
                            <button style={{ backgroundColor: 'rgba(46, 46, 46, 1)', height: '90px', fontSize: '25px' }} onClick={() => {
                                handleClose3(0)
                            }}>Set Queued</button>
                        )}
                        <br />
                        {workInfo.status != 1 && (
                            <button style={{ backgroundColor: 'rgba(166, 117, 65, 1)', height: '90px', fontSize: '25px' }} onClick={() => {
                                handleClose3(1)
                            }}>Set In Progress</button>
                        ) }
                        <br />
                        {workInfo.status != 2 && (
                            <button style={{ backgroundColor: 'rgba(92, 166, 65, 1)', height: '90px', fontSize: '25px' }} onClick={() => {
                                handleClose3(2)
                            }}>Set Completed</button>
                        ) }
                        <br />
                    </div>
                </div>
            </Modal>
            <Modal
                open={open4}
                onClose={handleClose4}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                    padding: '0px',
                    width: '100vw'
                }}
            >
                <div className="modal">
                    <div className="header">
                        Edit Part
                        <Close
                            style={{ fontSize: '39px' }}
                            onClick={() => {
                                handleClose4()
                            }}
                        />
                    </div>
                    <div className="content" style={{display: 'flex', flexDirection: 'column', margin: '10px'}}>
                        <UpdatePartFormik
                            validationSchema={validationSchema3}
                            onSubmit={onSubmit3}
                            initialValues={initialValues3}
                        />
                        <button
                            style={{ height: '60px', marginTop: '10px', backgroundColor: 'darkred', fontSize: '25px' }}
                            onClick={() => {
                                handleClose4(1)
                            }}
                        >
                            Delete Part
                        </button>
                    </div>
                </div>
            </Modal>
            <Modal
                open={openConfirm}
                onClose={handleCloseConfirm}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                    padding: '0px',
                    width: '100vw'
                }}
            >
                <div className="modalConfirm">
                    <div className="content">
                        {confirm == 1 && (
                            <h2 style={{ fontSize: '25px' }}>Confirm completed work? <br />(payment will be submitted to customer, changes will be prohibited)</h2>
                        )}
                        {confirm == 2 && (
                            <h2 style={{ fontSize: '25px' }}>Delete Part? Cannot be undone.</h2>
                        ) }
                        <button
                            className="navButton"
                            style={{width: '100%', marginBottom: '5px'}}
                            onClick={() => {
                                handleCloseConfirm(1)
                            }}
                        >
                            CONFIRM<ArrowForwardIos />
                        </button>
                        {errComplete != '' && (
                            <span className="errMsg" style={{fontSize: '16px'}}>{errComplete}</span>
                        ) }
                        <button
                            className="navButton"
                            style={{ width: '100%', marginTop: '20px' }}
                            onClick={() => {
                                handleCloseConfirm(0)
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