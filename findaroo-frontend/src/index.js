import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';

// All pages should be imported here:
import Home from "./Pages/Home"
import Conversations from "./Pages/Conversations"
import Conversation from "./Pages/Conversation"
import Search from "./Pages/Search"
import Error from "./Pages/Error";
import Profile from "./Pages/Profile";
import EditProfile from "./Pages/EditProfile";
import EditPreferences from "./Pages/EditPreferences";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Questions from "./Pages/Questions";
import MyConnections from './Pages/MyConnections';
import AccountSetup from "./Pages/AccountSetup";
import EditPhoto from "./Pages/EditPhoto";
import MyConnectionRequests from './Pages/MyConnectionRequest';
import User from './Pages/User';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC02A6JRXCWfrfw63_S0cRz0uPBhmJlmOI",
    authDomain: "findaroo-19063.firebaseapp.com",
    projectId: "findaroo-19063",
    storageBucket: "findaroo-19063.appspot.com",
    messagingSenderId: "606372407306",
    appId: "1:606372407306:web:d75f3e34a095d643df97f3",
    measurementId: "G-L1K080NSWL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// This is where the site layout is created
const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Home />,
            errorElement: <Error />,
        },
        {
            path: "/AccountSetup",
            element: <AccountSetup />,
            errorElement: <Error />,
        },
        {
            path: "/Conversations",
            element: <Conversations />,
            errorElement: <Error />,
        },
        {
            path: "/Conversations/:cid",
            element: <Conversation />,
            errorElement: <Error />,
        },
        {
            path: "/Search",
            element: <Search />,
            errorElement: <Error />,
        },
        {
            path: "/Profile",
            element: <Profile />,
            errorElement: <Error />,
        },
        {
            path: "/Profile/Edit",
            element: <EditProfile />,
            errorElement: <Error />,
        },
        {
            path: "/Profile/Photo",
            element: <EditPhoto />,
            errorElement: <Error />,
        },
        {
            path: "/Profile/Preferences",
            element: <EditPreferences />,
            errorElement: <Error />,
        },
        {
            path: "/Profile/Questions",
            element: <Questions />,
            errorElement: <Error />,
        },
        {
            path: "/User/:uid",
            element: <User />,
            errorElement: <Error />,
        },
        {
            path: "/Login",
            element: <Login />,
            errorElement: <Error />,
        },
        {
            path: "/SignUp",
            element: <SignUp />,
            errorElement: <Error />,
        },
        {
            path: "/Profile/MyConnections",
            element: <MyConnections />,
            errorElement: <Error />,
        },
        {
            path: "/Profile/MyConnectionRequests",
            element: <MyConnectionRequests />,
            errorElement: <Error />,
        }
    ]
);

// https://reactrouter.com/en/main/start/tutorial

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
