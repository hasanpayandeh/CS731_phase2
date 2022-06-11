/**
 *  FileName: App.js (Client-Side)
 *  Author: MohammadHasan Payandeh <mpu236@uregina.ca>
 *  Course: CS7314
 *  Version: 1.0
*/

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import Home from './components/home';
import Signup from './components/signup';
import Login from './components/login';
import Logout from './components/logout';
import Restaurants from './components/restaurants';
import ViewRestaurant from './components/viewrestaurant';
import ViewFood from './components/viewfood';
import Manage from './components/manage';
import AddPost from './components/addpost';
import ReviewComments from './components/reviewcomments';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';

import { ThemeProvider, createTheme } from '@mui/material/styles';

// definition of the app's theme. you can change the app colors here.
const theme = createTheme({
  palette: {
    primary: {
      main: "#c70000",
    },
    secondary: {
      main: "#444",
    },
    tertiary: {
      main: "#fff",
    },
  },
});

// this const keeps the user's information if they logged in.
const userobj=(localStorage.getItem('user')!=""&&localStorage.getItem('user')!=null ? JSON.parse(localStorage.getItem('user')) : {});

// the main App component which contains different routes(pages)
const App = () => {
  return (
    <>
      <Helmet>
          <meta charSet="utf-8" />
          <title>Food Social Media</title>
          <style>{"body { background-color: #ddd; }"}</style>
      </Helmet>
      <ThemeProvider theme={theme}>
        <Router>
            <Routes>
              <Route path='/' element={<Home user={userobj}/>} />
              <Route path='/signup' element={<Signup user={userobj} />} />
              <Route path='/login' element={<Login user={userobj} />} />
              <Route path='/logout' element={<Logout user={userobj}/>} />
              <Route path='/restaurants' element={<Restaurants user={userobj} />} />
              <Route path='/viewrestaurant' element={<ViewRestaurant user={userobj} />} />
              <Route path='/viewfood' element={<ViewFood user={userobj} />} />
              <Route path='/manage' element={<Manage user={userobj} />} />
              <Route path='/addpost' element={<AddPost user={userobj} />} />
              <Route path='/reviewcomments' element={<ReviewComments user={userobj} />} />
            </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
