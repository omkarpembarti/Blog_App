

import { Button, TextField, Typography } from '@mui/material'
import { useContext, useState } from 'react'
import HocCredentialContainer from '../components/HocCredentialContainer'
import { useNavigate } from 'react-router';
//import { API } from '../Services/api';
import { useDispatch } from 'react-redux';
import { setOpen } from '../slices/snackbarSlice';
import { UserContext } from '../contexts/UserDataContext';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { getBlogs } from '../slices/blogSlice';

const Register = ({ setUserAuthenticated }) => {

    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setloaderOpen, setUserInfo } = useContext(UserContext);
    const dispatch = useDispatch();


    const onSignUpClick = async () => {
        if (name.trim() === '') {
            dispatch(setOpen({ 'message': 'Enter Name', 'severity': 'error' }));
            return;
        }
        if (email.trim() === '') {
            dispatch(setOpen({ 'message': 'Enter Email', 'severity': 'error' }));
            return;
        }
        if (password.trim() === '') {
            dispatch(setOpen({ 'message': 'Enter Password', 'severity': 'error' }));
            return;
        }
        setloaderOpen(true);
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (res) => {

                const user = res.user;
                await updateProfile(user, {
                    'displayName': name
                });
                setUserAuthenticated(true);
                setUserInfo({ 'userName': user.displayName });
                sessionStorage.setItem('accessToken', `Bearer ${user.accessToken}`);
                dispatch(getBlogs());
                navigate('/');

            })
            .catch((err) => {
                console.log('createUserWithEmailAndPassword-->', err);
                dispatch(setOpen({ 'message': err.message, 'severity': 'error' }));

            })
            .finally(() => {
                setloaderOpen(false);
            })
        //let response //= await API.userRegister({ name, userName, password });

    }

    return (
        <HocCredentialContainer>
            <Typography variant='h3'>Blog-App</Typography>
            <TextField variant='standard' size='small' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
            <TextField variant='standard' size='small' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
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
