import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import '../GlobalCss_MUI.css';
import { CardActionArea, CardMedia, ListItemIcon, ListItemText } from '@mui/material';
import './BlogStyle.css';
import { useLocation, useNavigate } from 'react-router';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch } from 'react-redux';
import { getBlogs } from '../slices/blogSlice';
import { setOpen } from '../slices/snackbarSlice';
import { deleteMyBlog } from '../slices/myBlogSlice';
import { ThemeContext } from '../contexts/Themecontext';
import { getAccessToken, getServerURL } from '../utils/comman';
import { UserContext } from '../contexts/UserDataContext';
import axios from 'axios';




const BlogMenu = (props) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { setloaderOpen } = React.useContext(UserContext);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const open = Boolean(anchorEl);
    const id = props.id;
    const handleClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (event) => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    const onDeleteBlog = (event) => {
        async function deleteBlog(id) {
            setloaderOpen(true);
            //const response = await API.deleteBlog(id);
            const response = await axios.delete(`${getServerURL()}/blogs/${id}`,
                {
                    'headers': {
                        'authorization': getAccessToken(),
                        'Access-Control-Allow-Origin': '*',
                    }
                });
            setloaderOpen(false);
            if (response.data.success) {

                dispatch(deleteMyBlog({ '_id': id }));
                dispatch(setOpen({ 'message': 'Deleted Successfully' }));
                dispatch(getBlogs());
            }
        }
        handleClose(event);
        deleteBlog(id);
    }
    const onEditBlog = (event) => {
        handleClose(event);
        navigate(`/editBlog/${id}`);

    }

    //Logic to show action buttons only on my blogs screen.
    if (location.pathname !== '/myblogs') {
        return;
    } else {
        return (
            <div>
                <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? 'long-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    MenuListProps={{
                        'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                >

                    <MenuItem key='edit' onClick={onEditBlog}>
                        <ListItemIcon><EditNoteIcon /></ListItemIcon>
                        <ListItemText>Edit</ListItemText>
                    </MenuItem>
                    <MenuItem key='delete' onClick={onDeleteBlog}>

                        <ListItemIcon><DeleteIcon /></ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                    </MenuItem>

                </Menu>
            </div>
        );
    }

}

export default function Blog(props) {

    const navigate = useNavigate();
    const { isDarkMode } = React.useContext(ThemeContext);
    const cardStyle = {
        'width': '100%', /* Set the width of the container */
        'display': 'flex',
        "flexDirection": 'column'
    }
    let createdDate = new Date(props.createdDate);
    createdDate = createdDate.toDateString();
    const serverURL = getServerURL();

    function stringToColor(string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }

    function stringAvatar(name) {
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }
    //    background-image: linear-gradient(to top, rgb(196 11 11 / 82%), rgb(50 43 43));
    return (
        <Card
            variant='elevation'
            sx={{
                'borderRadius': '16px',
                'maxHeight': '400px',
                'width': '330px',
                'backgroundImage': `${isDarkMode ? ' linear-gradient(to top,rgb(203 17 17 / 34%), rgb(209 207 232 / 19%))' : ''}`
            }} raised={true}>
            <CardActionArea onClick={() => { navigate(`/blog/${props._id}`) }}>
                <CardHeader
                    avatar={
                        <Avatar {...stringAvatar(`${props.userName} Random`)} >
                            {props.userName[0].toUpperCase()}
                        </Avatar>
                    }
                    action={
                        <BlogMenu id={props._id} setBlogs={props.setBlogs} />
                    }

                    title={props.title}
                    subheader={createdDate}
                    subheaderTypographyProps={{ textAlign: 'start' }}
                />
                <CardMedia
                    component="img"
                    sx={{ width: '100%', height: '150px' }}
                    image={`${serverURL + props.imageURL}`}
                    alt="Live from space album cover"
                    loading='lazy'
                />
                <CardContent sx={cardStyle}>
                    <Typography
                        align='justify'
                        component='div'
                        variant='body2'
                        className='cardContent-body'>
                        {props.content}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card >
    );
}