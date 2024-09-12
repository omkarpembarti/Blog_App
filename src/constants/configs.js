// API NOTIFICATION MESSAGES
export const API_NOTIFICATION_MESSAGES = {
    loading: {
        title: "Loading...",
        message: "Data is being loaded. Please wait"
    },
    success: {
        title: "Success",
        message: "Data successfully loaded"
    },
    requestFailure: {
        title: "Error!",
        message: "An error occur while parsing request data"
    },
    responseFailure: {
        title: "Error!",
        message: "An error occur while fetching response from server. Please try again"
    },
    networkError: {
        title: "Error!",
        message: "Unable to connect to the server. Please check internet connectivity and try again."
    }
}

export const SERVICE_URLS = {
    userLogin: { url: '/users/login', method: 'POST' },
    userRegister: { url: '/users/register', method: 'POST' },
    publishBlog: { url: '/blogs', method: 'POST' },
    uploadImage: { url: '/blogs/image', method: 'POST' },
    getAllBlogs: { url: '/blogs/all', method: 'GET' },
    getMyBlogs: { url: '/blogs', method: 'GET', query: true },
    addComment: { url: '/comments/new', method: 'POST' },
    getComments: { url: '/comments', method: 'GET', query: true },
    updateBlog: { url: '/blogs', method: 'PUT' },
    deleteBlog: { url: '/deleteBlog', method: 'DELETE', query: true },

}