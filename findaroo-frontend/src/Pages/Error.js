import { useRouteError } from "react-router-dom";
import "./Page.css"
import Navbar from "../Components/Navbar";

export default function Error() {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="Page">
            <Navbar/>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    );
}