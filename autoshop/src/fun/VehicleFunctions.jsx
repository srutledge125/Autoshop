import React, { useState, useEffect } from "react"
import { collection, updateDoc, query, where, getDocs, getDoc, doc, addDoc, setDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase"
import { useId } from "react";

const getUserInfo = async (userType, uid) => {
    var userInfo = []
    if (userType == 1) {
        const querySnapshot = await getDocs(collection(db, "users"));

        querySnapshot.forEach((doc) => {

            if (doc.id != uid) {
                userInfo.push({
                    id: doc.id,
                    ...doc.data()
                });
            }
        });
    } else if (userType == 2) {
        const userRef = collection(db, "users");
        const q = query(userRef, where("userType", "==", 3))
        const querySnapshot = await getDocs(q)

        querySnapshot.forEach((doc) => {
            userInfo.push(doc.data())
        });
    }
    

    return userInfo
}

const setUserType = async (userType, uid) => {
    try {
        const userRef = doc(db, 'users', uid);
        await setDoc(userRef, {
            userType: userType
        }, { merge: true });
        return 1
    } catch (e) {
        return e
    }
}

const addWork = async (values, vehId) => {
    try {

        const user = auth.currentUser;
        const uid = user.uid

        // Creates document in Firestore with work data
        try {

            const dateObj = new Date();
            const date = (dateObj.getMonth() + 1) + "/" + dateObj.getDate() + "/" + dateObj.getFullYear()

            const docRef = await addDoc(collection(db, "work"), {
                crBy: uid,
                crDate: date,
                vehId: vehId,
                workName: values.workName,
                workDesc: values.workDesc,
                laborHours: values.laborHours,
                status: 0
            });

            return docRef

        } catch (err) {
            return null
        }


    } catch (err) {
        console.error("Could not add work", err);
    }
}

const getVehicleById = async (vehId) => {
    const vehRef = collection(db, "vehicles");
    const q = query(vehRef, where("__name__", "==", vehId))
    const querySnapshot = await getDocs(q)
    const vehInfo = []

    querySnapshot.forEach((doc) => {
        vehInfo.push(doc.data())
    });

    return vehInfo
}

const updateVehicle = async (values, vehicleRef) => {
    await updateDoc(vehicleRef, {
        make: values.make,
        model: values.model,
        modelYr: values.modelYr,
        cusEmail: values.cusEmail,
        cusPhone: values.cusPhone
    })
}

const updateWork = async (values, workRef) => {
    await updateDoc(workRef, {
        workName: values.workName,
        workDesc: values.workDesc,
        laborHours: values.laborHours
    })
}

const getWorkByVeh = async (vehId) => {
    const workRef = collection(db, "work");
    const q = query(workRef, where("vehId", "==", vehId))
    const querySnapshot = await getDocs(q)
    const workArr = []

    querySnapshot.forEach((doc) => {
        workArr.push({
            id: doc.id,
            ...doc.data()})
    });

    return workArr
}

const getWorkById = async (workId) => {
    const workRef = collection(db, "work");
    const q = query(workRef, where("__name__", "==", workId))
    const querySnapshot = await getDocs(q)
    const workArr = []

    querySnapshot.forEach((doc) => {
        workArr.push(doc.data())
    });

    return workArr
}

const getWorkByRef = async (workRef) => {
    const querySnapshot = await getDoc(workRef)
    const workArr = []
    workArr.push({ id: querySnapshot.id, ...querySnapshot.data() })
    return workArr
}

const getVehicleByWorkRef = async (workRef) => {
    const querySnapshot = await getDoc(workRef)
    const data = querySnapshot.data()
    const vehRef = doc(db, "vehicles", data.vehId)
    const querySnapshot2 = await getDoc(vehRef)
    return { id: querySnapshot2.id, ...querySnapshot2.data() }
}

const getVehicleAll = async (userType, email) => {


    if (userType == 1 || userType == 2) {

        //Get all work
        const querySnapshotWork = await getDocs(collection(db, "work"));
        const work = [];

        querySnapshotWork.forEach(async (doc) => {
            work.push({
                id: doc.id,
                ...doc.data()
            });
        });

        //Get all vehicles
        const querySnapshot = await getDocs(collection(db, "vehicles"));
        const arr = [];

        querySnapshot.forEach(async (doc) => {
            arr.push({
                id: doc.id,
                statusArr: [],
                status: 0,
                color: '#919191',
                ...doc.data()
            });
        });

        //Loop through vehicles and get status based on looping through work
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < work.length; j++) {
                if (work[j].vehId == arr[i].id) {
                    arr[i].statusArr.push(work[j].status)
                }
            }
            //Check work statuses and return overall status for vehicle
            if (arr[i].statusArr.find((status) => status == 1)) {
                arr[i].status = 1
                arr[i].color = '#d69745'
            } else if ((arr[i].statusArr.find((status) => status == 0)) && (arr[i].statusArr.find((status) => status == 2))) {
                arr[i].status = 1
                arr[i].color = '#d69745'
            } else if (!(arr[i].statusArr.find((status) => status == 0)) && (arr[i].statusArr.find((status) => status == 2))) {
                arr[i].status = 2
                arr[i].color = '#46a35f'
            }
        }
        return arr;
    } else if (userType == 3) {

        //Get vehicles by user email
        const vehRef = collection(db, "vehicles");
        const q = query(vehRef, where("cusEmail", "==", email))
        const querySnapshot = await getDocs(q)
        const arr = [];

        querySnapshot.forEach(async (doc) => {
            arr.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return arr;
    }

    
}

const getPartsByWorkId = async (workId) => {
    const partsRef = collection(db, "parts");
    const q = query(partsRef, where("workId", "==", workId))
    const querySnapshot = await getDocs(q)
    const partsArr = []

    querySnapshot.forEach((doc) => {
        partsArr.push({
            id: doc.id,
            ...doc.data()
        })
    });

    return partsArr
}

const addPart = async (values, workId) => {
    await addDoc(collection(db, "parts"), {
        workId: workId,
        partName: values.partName,
        partPrice: values.partPrice,
        partDesc: values.partDesc,
        partLink: values.partLink,
        quantity: values.quantity
    })
}

const deletePart = async (partId) => {
    console.log('deleting ' + partId)
}

const updateWorkStatus = async (workRef, status) => {
    await setDoc(workRef, { status: status }, { merge: true });
}

const updatePart = async (values, partRef) => {
    await setDoc(partRef, {
        partName: values.partName,
        partPrice: values.partPrice,
        partDesc: values.partDesc,
        partLink: values.partLink,
        quantity: values.quantity
    }, { merge: true });
}

const getInProgressVeh = async (userType, email) => {
    const vehArr = []
    if (userType == 3) {
        //Get all non-completed vehicles for specific user
        const vehRef = collection(db, "vehicles");
        const vehIdArr = []
        const querySnapshot = await getDocs(collection(db, "work"));

        querySnapshot.forEach((doc) => {
            const workInfo = doc.data()
            if (workInfo.status != 2) {
                vehIdArr.push(workInfo.vehId);
            }

        });
        const q2 = query(vehRef, where('__name__', 'in', vehIdArr));
        const querySnapshot2 = await getDocs(q2)
        querySnapshot2.forEach((doc) => {
            const vehInfo = doc.data()
            if (vehInfo.cusEmail == email) {
                vehArr.push({
                    id: doc.id,
                    ...doc.data()
                })
            }
        });
    } else {
        //Get all non-completed vehicles
        const vehRef = collection(db, "vehicles");
        const vehIdArr = []
        const querySnapshot = await getDocs(collection(db, "work"));

        querySnapshot.forEach((doc) => {
            const vehInfo = doc.data()
            if (vehInfo.status != 2) {
                vehIdArr.push(vehInfo.vehId);
            }
            
        });
        const q2 = query(vehRef, where('__name__', 'in', vehIdArr));
        const querySnapshot2 = await getDocs(q2)
        querySnapshot2.forEach((doc) => {
            vehArr.push({
                id: doc.id,
                ...doc.data()
            })
        });
    }
    return vehArr
}

const getPaymentByUser = async (email, userType) => {

    const payArr = []
    var total = 0
    var tax
    var grandtotal
    var taxes = {}

    if (userType == 3) {
        try {
            //Get payments for user email & unpaid
            const payRef = collection(db, "payments")
            const q = query(payRef, where('cusEmail', '==', email), where('paid', '==', 0))
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach((doc) => {
                console.log(doc.id)
                payArr.push({
                    id: doc.id,
                    ...doc.data()
                })
            });

            //Get tax rate settings
            const taxSnapshot = await getDocs(collection(db, "settings"));
            taxSnapshot.forEach((doc) => {
                const { stateTax, localTax } = doc.data();
                taxes = {
                    stateTax: stateTax,
                    localTax: localTax
                }
            });

            for (let i = 0; i < payArr.length; i++) {
                total += payArr[i].amount
            }
            //Calculate tax with correct decimal places and rounding
            tax = Math.round(((total * (taxes.stateTax / 100)) + (total * (taxes.localTax / 100))) * 100) / 100
            grandtotal = total + tax
            console.log("total: " + total + "   grand: " + grandtotal)
        } catch (e) {
            //
        }
    } else if(userType == 2 || userType == 1) {
        try {
            //Get payments for user email & unpaid
            const payRef = collection(db, "payments")
            const q = query(payRef)
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach((doc) => {
                const { vehId, amount } = doc.data()
                const vehIndex = payArr.findIndex((status) => status.vehId == vehId)
                if (payArr.find((status) => status.vehId == vehId)) {
                    payArr[vehIndex].amount += amount
                } else {
                    payArr.push({
                        id: doc.id,
                        ...doc.data()
                    })
                }
            });

            //Get tax rate settings
            const taxSnapshot = await getDocs(collection(db, "settings"));
            taxSnapshot.forEach((doc) => {
                const { stateTax, localTax } = doc.data();
                taxes = {
                    stateTax: stateTax,
                    localTax: localTax
                }
            });

            //Calculate tax with correct decimal places and rounding
            tax = Math.round(((total * (taxes.stateTax / 100)) + (total * (taxes.localTax / 100))) * 100) / 100
            grandtotal = total + tax
            console.log("total: " + total + "   grand: " + grandtotal)

            for (let i = 0; i < payArr.length; i++) {
                payArr[i].amount += Math.round(((payArr[i].amount * (taxes.stateTax / 100)) + (payArr[i].amount * (taxes.localTax / 100))) * 100) / 100
            }
        } catch (e) {
            //
        }
    }
    
    return {
        payArr: payArr,
        total: total,
        taxes: tax,
        grandTotal: grandtotal
    }
}

const completeWork = async (workId) => {
    var paymentId
    try {
        var labor = 0
        var partsTotal = 0
        var totalAmount = 0
        var vehIdLoc

        //Get work info
        const workRef = collection(db, "work");
        const q = query(workRef, where('__name__', '==', workId));
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
            const { laborHours, vehId } = doc.data()
            labor = Number(laborHours)
            vehIdLoc = vehId
        });

        //Get Vehicle info
        const vehInfo = await getVehicleById(vehIdLoc)

        //Get parts prices
        const partsArr = await getPartsByWorkId(workId)
        for (let i = 0; i < partsArr.length; i++) {
            partsTotal += Number(partsArr[i].partPrice)
        }

        //Get labor rate
        var rate = {}
        const taxSnapshot = await getDocs(collection(db, "settings"));
        taxSnapshot.forEach((doc) => {
            const { shopRate } = doc.data();
            rate = Number(shopRate)
        });

        //Add it up
        totalAmount = (labor * rate) + partsTotal

        //Create payment entry
        const timestamp = serverTimestamp()
        const paymentAddRef = await addDoc(collection(db, "payments"), {
            vehId: vehIdLoc,
            workId: workId,
            laborHours: labor,
            laborRate: rate,
            partsTotal: partsTotal,
            amount: totalAmount,
            paid: 0,
            cusEmail: vehInfo[0].cusEmail,
            make: vehInfo[0].make,
            model: vehInfo[0].model,
            modelYr: vehInfo[0].modelYr,
            crDate: timestamp
        })
        paymentId = paymentAddRef.id

        //Set status of work
        const workRefId = doc(db, "work", workId);
        await updateWorkStatus(workRefId, 2)

        return 1
    } catch (e) {
        console.log(e)
        //Delete payment doc & reset work status if it failed
        await deleteDoc(doc(db, "payments", paymentId));
        const workRefId = doc(db, "work", workId);
        await updateWorkStatus(workRefId, 1)

        return 0
    }
    
}

export const getPaymentStatus = async (vehId) => {
    //Get payment info
    const payRef = collection(db, "payments");
    const q = query(payRef, where('vehId', '==', vehId));
    const querySnapshot = await getDocs(q)
    var paymentStatus = '0'
    querySnapshot.forEach((doc) => {
        const { paid } = doc.data()
        if (paid == 0) {
            paymentStatus = 'Payment Required'
        } else if (paid == 1 && paymentStatus == '') {
            paymentStatus = 'Payment Complete'
        }
    });
    return paymentStatus

}

export {
    deletePart, completeWork, getPaymentByUser, setUserType, getInProgressVeh, addWork, getVehicleAll, getUserInfo, getVehicleById, updateVehicle, getWorkByVeh, getWorkById, getPartsByWorkId, updateWork, getWorkByRef, getVehicleByWorkRef, addPart, updateWorkStatus, updatePart
};