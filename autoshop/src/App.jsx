import './App.css'
import { Login } from "./user/Login"
import { CusHome } from "./customer/CusHome"
import { Register } from "./user/Register"
import { EmplHome } from "./empl/EmplHome"
import { EditWork } from "./empl/EditWork"
import { Accounts } from "./empl/Accounts"
import { Payments } from "./customer/Payments"
import { AdminHome } from "./admin/AdminHome"
import { AddVehicle } from "./empl/AddVehicle"
import { EditVehicle } from "./empl/EditVehicle"
import { AllVehicles } from "./empl/AllVehicles"
import { Route, Routes } from "react-router-dom"

function App() {

    return (
        <div className="App">
            <Routes>
                <Route exact path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/CusHome" element={<CusHome />} />
                <Route path="/EditWork" element={<EditWork />} />
                <Route path="/Accounts" element={<Accounts />} />
                <Route path="/Payments" element={<Payments />} />
                <Route path="/EmplHome" element={<EmplHome />} />
                <Route path="/register" element={<Register />} />
                <Route path="/AdminHome" element={<AdminHome />} />
                <Route path="/AddVehicle" element={<AddVehicle />} />
                <Route path="/EditVehicle" element={<EditVehicle />} />
                <Route path="/AllVehicles" element={<AllVehicles />} />
            </Routes>
        </div>
    );
}
export default App