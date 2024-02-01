import React from 'react';
import logo from '../Findaroo.png';

const Navbar = () => {
    return (
        <nav className="bg-gray-800 p-4 fixed w-full z-10 top-0">
            <div className="container mx-auto">
                {/* Your navbar content goes here */}
                <div className="flex items-center justify-between">
                    <img src={logo} alt="Findaroo"/>
                    <div className="flex space-x-4">
                        <a href="#" className="text-white">Home</a>
                        <a href="#" className="text-white">About</a>
                        <a href="#" className="text-white">Services</a>
                        <a href="#" className="text-white">Contact</a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;