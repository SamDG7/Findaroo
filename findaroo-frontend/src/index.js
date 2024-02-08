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
import Messages from "./Pages/Messages"
import Search from "./Pages/Search"
import Error from "./Pages/Error";
import Profile from "./Pages/Profile";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import ForgotPassword from "./Pages/ForgotPassword";

const authenticated = false;

// This is where the site layout is created
const router = createBrowserRouter(authenticated ? [
    {
        path: "/",
        element: <Home />,
        errorElement: <Error />,
    },
    {
        path: "/Messages",
        element: <Messages />,
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
        path: "/ForgotPassword",
        element: <ForgotPassword />,
        errorElement: <Error />,
    }
] : [
    // This makes it so if someone is not logged in, it refuses to load other pages and makes them login or sign up
    {
        path: "/",
        element: <Login />,
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
