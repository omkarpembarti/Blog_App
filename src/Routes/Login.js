
import { Button, TextField, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import HocCredentialContainer from '../components/HocCredentialContainer'
import { useNavigate } from 'react-router';
import { UserContext } from '../contexts/UserDataContext';
import { useDispatch } from 'react-redux';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { setOpen } from '../slices/snackbarSlice';
import { getBlogs } from '../slices/blogSlice';
const Login = ({ setUserAuthenticated }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userNameError, setUserNameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const dispatch = useDispatch();

    const { setloaderOpen, setUserInfo } = useContext(UserContext);
    const onLoginClick = async () => {
        if (email.trim() === '') {
            setUserNameError(true);
            return;
        }
        if (password.trim() === '') {
            setPasswordError(true);
            return;
        }


        setloaderOpen(true);
        signInWithEmailAndPassword(auth, email, password)
            .then((response) => {

                setUserNameError(false);
                setPasswordError(false);
                setUserAuthenticated(true);
                setUserInfo({ 'userName': response.user.displayName });
                sessionStorage.setItem('accessToken', `Bearer ${response.user.accessToken}`);
                //sessionStorage.setItem('refreshToken', `Bearer ${response.data.refreshToken}`);
                dispatch(getBlogs());
                navigate('/');

            })
            .catch((err) => {
                console.log(err);
                dispatch(setOpen({
                    'message': err.message,
                    'severity': 'error'
                }));
            })
            .finally(() => { setloaderOpen(false); })
        //setloaderOpen(false);
        // if (response.data.msg === 'Invalid Credentials') {
        //     setUserNameError(true);

        // } else {
        //     if (response.data.msg === 'Incorrect password') {
        //         setPasswordError(true);
        //     } else {
        //         setUserNameError(false);
        //         setPasswordError(false);
        //         setUserAuthenticated(true);
        //         sessionStorage.setItem('accessToken', `Bearer ${response.data.accessToken}`);
        //         sessionStorage.setItem('refreshToken', `Bearer ${response.data.refreshToken}`);
        //         dispatch(getBlogs());
        //         setUserInfo((prevState) => ({ ...prevState, userName: response.data.userName, name: response.data.name }))
        //         navigate('/');
        //     }
        // }
    }

    return (
        <HocCredentialContainer >
            <Typography variant='h3' sx={{ 'fontFamily': 'Dancing Script, cursive', 'fontWeight': 'bold' }}>Blog-App</Typography>
            <TextField
                type='email'
                error={userNameError}
                variant='standard'
                size='small'
                placeholder='Email'
                helperText={`${userNameError ? "Incorrect Email" : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)} />
            <TextField
                error={passwordError}
                variant='standard'
                size='small'
                placeholder='Password'
                type='password'
                helperText={`${passwordError ? "Incorrect Password" : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)} />
            <Button variant='contained' onClick={onLoginClick}>Login</Button>
            <Typography>OR</Typography>
            <Button
                variant='outlined'
                onClick={() => { navigate('/register') }}
            >New User? Register</Button>
        </HocCredentialContainer>
    )
}

export default Login
