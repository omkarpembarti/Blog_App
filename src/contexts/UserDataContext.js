import { Backdrop, CircularProgress } from '@mui/material';
import React, { createContext, useState } from 'react'

export const UserContext = createContext();

const UserDataContext = ({ children }) => {
    const [open, setloaderOpen] = useState(false);
    const [userInfo, setUserInfo] = useState({
        userName: ''
    });

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, setloaderOpen }}>
            {children}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </UserContext.Provider >


    )
}



export default UserDataContext;

