

import { Button, TextField, Typography } from '@mui/material'
import { useContext, useState } from 'react'
import HocCredentialContainer from '../components/HocCredentialContainer'
import { useNavigate } from 'react-router';
import { API } from '../Services/api';
import { useDispatch } from 'react-redux';
import { setOpen } from '../slices/snackbarSlice';
import { UserContext } from '../contexts/UserDataContext';

const Register = () => {

    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const { setloaderOpen } = useContext(UserContext);
    const dispatch = useDispatch();
    const onSignUpClick = async () => {
        setloaderOpen(true);
        let response = await API.userRegister({ name, userName, password });
        setloaderOpen(false);
        if (response.data.success) {
            dispatch(setOpen({ 'message': response.data.msg, 'severity': 'info' }));
            dispatch(setOpen({ 'message': "Routing to Login Screen", 'severity': 'info' }));
            navigate('/login');
        }
        console.log(response);
    }

    return (
        <HocCredentialContainer>
            <Typography variant='h3'>Blog-App</Typography>
            <TextField variant='standard' size='small' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
            <TextField variant='standard' size='small' placeholder='Username' value={userName} onChange={(e) => setUserName(e.target.value)} />
            <TextField variant='standard' size='small' placeholder='Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button variant='contained' color='info' onClick={onSignUpClick}>Sign-Up</Button>
            <Typography variant='h7'>OR</Typography>
            <Button
                variant='contained'
                color='success'
                onClick={() => navigate('/login')}
            >Already a User? Login</Button>
        </HocCredentialContainer>
    )
}

export default Register
