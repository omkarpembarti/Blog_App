import { CssBaseline, createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { Provider } from 'react-redux';
import React, { Suspense, lazy, useContext, useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router';
import './App.css';
import Header from './components/Header';
import { ThemeContext } from './contexts/Themecontext';
import BlogsContainer from './components/BlogsContainer';
import Register from './Routes/Register';
import Login from './Routes/Login';
import UserDataContext from './contexts/UserDataContext';
import BlogDetails from './Routes/BlogDetails';
import store from './store';
import CustomSnackbar from './components/CustomSnackbar';
import MyBlogs from './Routes/MyBlogs';
import EditBlog from './components/EditBlog';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { auth } from './firebase';
const LazyNewBlog = lazy(() => import('./components/NewBlog'));

function App() {
  const { isDarkMode } = useContext(ThemeContext);
  const [online, setOnline] = useState(true);
  const [isUserAuthenticated, setUserAuthenticated] = useState(false);

  const themeMode = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
    },
    typography: {
      fontFamily: [
        'Nunito',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif'
      ].join(','),
    }
  });

  const PrivateRoute = ({ isUserAuthenticated }) => {
    if (isUserAuthenticated)
      return <Outlet />
    else
      return <Navigate to='/login' replace={true} />
  }

  useEffect(() => {

    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserAuthenticated(true);

      } else {
        setUserAuthenticated(false);
      }

      console.log(user);
    })

    window.addEventListener('offline', () => {
      console.warn('YOU ARE OFFLINE');
      setOnline(false);
    });
    window.addEventListener('online', () => {
      setOnline(true);
    })
    return () => {
      window.removeEventListener('offline', () => {
        console.warn('YOU ARE OFFLINE');
      });
      window.addEventListener('online', () => {
        setOnline(true);
      })
    }
  }, [])


  return (
    <div className="App">
      <span className="status"
        style={{
          'position': 'fixed',
          'color': 'white',
          'bottom': 0,
          'left': 0,
          'zIndex': 9000
        }}
      >{online ? <WifiIcon sx={{ 'color': 'green' }} /> : <WifiOffIcon sx={{ 'color': 'red' }} />}
      </span>
      <Provider store={store}>
        <ThemeProvider theme={themeMode}>
          <UserDataContext>
            <CssBaseline />
            {isUserAuthenticated && <Header setUserAuthenticated={setUserAuthenticated} />}
            <Routes>
              <Route path='/login' element={<Login setUserAuthenticated={setUserAuthenticated} />} exact />
              <Route path='/register' element={<Register setUserAuthenticated={setUserAuthenticated} />} exact />
              <Route path='/' element={<PrivateRoute isUserAuthenticated={isUserAuthenticated} />}>
                <Route path='/' element={<BlogsContainer />} exact />
                <Route path='/addBlog' element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <LazyNewBlog />
                  </Suspense>}
                  exact
                />
                <Route path='/editBlog/:id' element={<EditBlog />} exact />
                <Route path='/myblogs' element={<MyBlogs />} exact />
                <Route path='/blog/:id' element={<BlogDetails />} exact />
              </Route>
            </Routes>
            <CustomSnackbar></CustomSnackbar>

          </UserDataContext>
        </ThemeProvider>
      </Provider>
    </div>
  );
}

export default App;
