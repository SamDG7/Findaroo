import "./Page.css"
import Navbar from "../Components/Navbar";

export default function Home() {
    return (
        <div className="Page">
            <Navbar/>
            <h1>
                Home page!
            </h1>
        </div>
    );
}