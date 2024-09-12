import { Avatar, Container, Divider, IconButton, InputAdornment, Stack, TextField, Tooltip, Typography } from '@mui/material'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import ClearIcon from '@mui/icons-material/Clear';
import SendIcon from '@mui/icons-material/Send';
import { UserContext } from '../contexts/UserDataContext';
import { API } from '../Services/api'
import { deepOrange } from '@mui/material/colors';
import { useDispatch } from 'react-redux';
import { setOpen } from '../slices/snackbarSlice';
const containerStyle = {
    'display': 'flex',
    'flexDirection': 'column',
    'gap': '10px',
    'marginTop': '15px',
    'padding': '10px 10px 10px 10px',
    'boxShadow': 5,
    'borderRadius': 2,
    'textAlign': 'start'
};

const initialValue = {
    'name': '',
    'postID': '',
    'comment': ''
}

const Comments = ({ blog }) => {
    const [newComment, setNewComment] = useState(initialValue);
    const { userInfo, setloaderOpen } = useContext(UserContext);
    const [comments, setComments] = useState([]);
    const dispatch = useDispatch();

    const getInitials = (username) => {
        const words = username.split(' ');
        const initial = words.map(word => { return word[0] });
        return initial.join('');
    }

    useEffect(() => {
        //API Call
        const getAllComments = async () => {
            setloaderOpen(true);
            const response = await API.getComments(blog._id);
            setloaderOpen(false);

            setComments(response.data);
        }
        getAllComments()
    }, [blog._id])

    const handleCommentChange = (e) => {
        const text = e.target.value;
        setNewComment((prevState) => ({
            ...prevState, 'comment': text, 'postID': blog._id,
            'name': userInfo.userName
        }));
    }
    const handleClearBtnClick = () => {
        setNewComment((prevState) => ({ ...prevState, 'comment': '' }));
    }
    const HandleSubmitComment = async () => {

        if (newComment.comment.trim().length === 0) {
            return;
        }
        setloaderOpen(true);
        const response = await API.addComment(newComment);
        setloaderOpen(false);
        if (response.data.success) {
            dispatch(setOpen({ 'message': response.data.msg }));
            setComments((prevComments) => ([response.data.newComment, ...prevComments]));
            setNewComment(initialValue);
        } else {
            console.log('');
        }
    }


    return (
        <Container
            maxWidth='md'
            sx={containerStyle}>
            <Typography
                variant='h4'>
                Comments
            </Typography>
            <Divider />
            <div
                className='commentInput'
                style={{
                    'display': 'flex',
                    'flexDirection': 'row',
                    'alignItems': 'center',
                    'gap': 4
                }}>
                <TextField
                    name='newComment'
                    value={newComment.comment}
                    onChange={handleCommentChange}
                    placeholder="Write a comment..."
                    variant="outlined"
                    multiline
                    minRows={1}
                    required
                    style={{ flex: '1' }}
                    InputProps={{
                        endAdornment:
                            <InputAdornment position='end'>
                                {newComment.comment.length > 0 && (<>
                                    <Tooltip title='Clear'>
                                        <IconButton
                                            color='error'
                                            onClick={handleClearBtnClick}>
                                            <ClearIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <IconButton
                                        color='primary'
                                        onClick={HandleSubmitComment}>
                                        <SendIcon />
                                    </IconButton></>)}
                            </InputAdornment>
                    }}
                >
                </TextField>
            </div>


            {comments.length > 0 && comments.map(comment => {
                return (
                    <React.Fragment key={comment._id}>
                        <Stack
                            direction='row'
                            sx={{
                                'display': 'flex',
                                'gap': '5px',
                                'textAlign': 'justify'

                            }}
                            key={comment._id}>
                            <Avatar
                                sx={{ bgcolor: deepOrange[500] }}>
                                {getInitials(comment.name)}
                            </Avatar>
                            <Stack direction='column'>
                                <Typography
                                    gutterBottom={true}
                                    sx={{ 'fontWeight': 'bold' }}>
                                    {comment.name}
                                </Typography>
                                <Typography sx={{ 'width': '100%', 'overflowWrap': 'anywhere' }}>{comment.comment} </Typography>
                            </Stack>

                        </Stack>
                        <Divider variant='middle' />
                    </React.Fragment>
                )
            }

            )}

        </Container>
    )
}

export default Comments
