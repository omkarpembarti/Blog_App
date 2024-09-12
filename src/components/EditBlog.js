import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button, Container, Stack, TextField, Typography } from '@mui/material';
import { useContext, useState, useEffect, useRef } from 'react'
import { UserContext } from '../contexts/UserDataContext';
import { API } from '../Services/api';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getBlogs } from '../slices/blogSlice';
import { useNavigate, useParams } from 'react-router';
import { setOpen } from '../slices/snackbarSlice';
import { updateMyBlog } from '../slices/myBlogSlice';
import { getServerURL } from '../utils/comman';


const NewBlog = () => {
    const { userInfo } = useContext(UserContext);
    const initialBlogData = useRef({
        title: '',
        content: '',
        imageURL: '',
        userName: '',
        createdDate: new Date()
    });
    const [image, setImage] = useState('');
    const [imageName, setImageName] = useState('No file chosen');
    const [blogData, setBlogData] = useState(initialBlogData);
    const params = useParams();
    const { myBlogs } = useSelector(state => state.myBlogSlice);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginTop: '15px',
        padding: '10px 0px 10px 0px',
        boxShadow: 15,
        borderRadius: 3
    };

    useEffect(() => {
        const myBlog = myBlogs.find((blog) => {
            if (blog._id === params.id)
                return true;
            return false;
        });
        setBlogData(myBlog);
        initialBlogData.current = myBlog;

    }, [])
    useEffect(() => {
        const getImage = async () => {

            if (image) {
                const formdata = new FormData();
                formdata.append("name", imageName);
                formdata.append("file", image);
                const response = await axios.post(`${getServerURL()}/blog/publishImage`,
                    formdata,
                    {
                        'headers': {
                            'Access-Control-Allow-Origin': '*',
                            'content-Type': 'multipart/form-data'
                        }
                    });
                const imageURL = response.data;
                setBlogData((blogData) => ({ ...blogData, 'userName': userInfo.userName, imageURL }));
            }
        }
        getImage();
    }, [image]);


    const onImageUpload = (e) => {
        setImage(e.target.files[0]);
        setImageName(e.target.files[0].name);
    }

    const onClearClick = () => {
        setBlogData(initialBlogData.current);

    }

    const onPublishClick = async () => {
        try {

            if (blogData.title.trim().length === 0) {
                dispatch(setOpen({ 'message': 'Please Enter the Title', 'severity': 'error' }))
                return;
            }
            if (blogData.content.trim().length === 0) {
                dispatch(setOpen({ 'message': 'Please Enter the Content', 'severity': 'error' }))
                return;
            }

            const response = await API.updateBlog(blogData);
            if (response.data.success) {
                dispatch(updateMyBlog({ updatedBlog: blogData }));
                dispatch(getBlogs());
                navigate('/myblogs');
                dispatch(setOpen({ 'message': response.data.msg }));
            }
            else {
                dispatch(setOpen({ 'message': response.data.msg, 'severity': 'error' }));
            }


        }
        catch (e) { }
    }


    const handleTextChange = (e) => {
        setBlogData((blogData) => ({ ...blogData, [e.target.name]: e.target.value }))
    }

    return (

        <Container maxWidth='md' sx={containerStyle}>

            <TextField
                name='title'
                value={blogData.title}
                onChange={handleTextChange}
                label="Title"
                variant="outlined"

            />
            <TextField
                name='content'
                value={blogData.content}
                onChange={handleTextChange}
                label="Body"
                variant="outlined"
                multiline
                minRows={6}

            />

            <Stack direction='row'>
                <input
                    id='upload-photo'
                    type='file'
                    accept='image/*'
                    alt='image'
                    hidden
                    onChange={onImageUpload}
                />
                <label htmlFor='upload-photo' >
                    <Button variant='contained' sx={{ borderRadius: '20px' }} component="span" startIcon={<CloudUploadIcon fontSize='large' />}>
                        Image
                    </Button>
                </label>
                <Typography sx={{ display: 'flex', alignItems: 'center', marginLeft: '3px' }}>{imageName}</Typography>
            </Stack>

            <Stack direction='row' sx={{
                'justifyContent': 'flex-end',
                'gap': '15px'
            }}>
                <Button variant='contained' color='error' onClick={onClearClick}>
                    Reset
                </Button>
                <Button variant='contained' color='success' onClick={onPublishClick}>
                    Publish
                </Button>
            </Stack>


        </Container >

    )
}

export default NewBlog;
