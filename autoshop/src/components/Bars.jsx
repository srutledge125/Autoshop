import React, { useState, useEffect } from "react"
import APPLOGOTEXTONLY from '../assets/APPLOGOTEXT2.png';
import { Link, Navigate, useLocation } from "react-router-dom"
import { Edit, List } from '@mui/icons-material';
import { Button, Menu, MenuItem, Modal } from '@mui/material'


function TopBar({ openMenu, handleClick, anchorEl, handleCloseMenu, handleCloseMenuAcc, userInfo}) {


    return (
        <div>
            <div className="topBar">
                <div className="imageContainer">
                    <img
                        src={APPLOGOTEXTONLY}
                        alt="Company Logo"
                    />
                </div>
                <Button
                    id="basic-button"
                    sx={{
                        color: 'white',
                        cursor: 'pointer'
                    }}
                    aria-controls={openMenu ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <List
                        sx={{ fontSize: '50px' }}
                    />
                </Button>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleCloseMenu}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    sx={{ marginLeft: '10px' }}
                >

                    <Link to="/AdminHome" state={{ userInfo }}>
                        <MenuItem
                            onClick={handleCloseMenu}
                            sx={{ color: 'black' }}
                        >Home</MenuItem>
                    </Link>
                    <MenuItem
                        onClick={handleCloseMenuAcc}
                        sx={{ color: 'black' }}
                    >Account</MenuItem>
                    <Link to="/login">
                        <MenuItem onClick={handleCloseMenu}>Logout</MenuItem>
                    </Link>

                </Menu>
                
            </div>
        </div>
        
    )
    
}

export { TopBar }