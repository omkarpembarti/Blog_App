import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API } from "../Services/api";


export const getMyBlogs = createAsyncThunk(
    'blogs/getMyBlogs',
    async (userInfo) => {
        const response = await API.getMyBlogs(userInfo.userName);
        return response
    });

const initialState = {
    myBlogs: [],
    loading: false
}

const myblogSlice = createSlice({
    'name': 'myblogs',
    'initialState': initialState,
    'reducers': {
        deleteMyBlog(state, action) {
            state.myBlogs = state.myBlogs.filter((blog) => {
                if (blog._id !== action.payload._id) {
                    return true;
                }
                return false;
            })
        },
        addMyBlog(state, action) {
            state.myBlogs.push(action.payload);
        },
        updateMyBlog(state, action) {
            state.myBlogs = state.myBlogs.map((blog) => {
                if (blog._id === action.payload.updatedBlog._id) {
                    return action.payload.updatedBlog;
                }
                return blog;
            })
        },
        resetMyblogSlice(state) {
            return initialState;
        }
    }, 'extraReducers': {
        [getMyBlogs.pending]: (state) => {
            state.loading = true;
        },

        [getMyBlogs.fulfilled]: (state, { payload }) => {
            state.myBlogs = payload.data;
            state.loading = false;
        },
        [getMyBlogs.rejected]: (state) => {
            state.loading = false;
        },
    },

});

export const { deleteMyBlog, addMyBlog, updateMyBlog, resetMyblogSlice } = myblogSlice.actions;
export default myblogSlice.reducer;
