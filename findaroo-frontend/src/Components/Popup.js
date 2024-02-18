import React from "react";
import { ButtonImportant, ButtonDelete, ButtonStandard } from './Buttons';


// The Popup component that can be used to display modal content
const Popup = ({ isOpen, closePopup, yesText, noText, yesFunc, noFunc, children }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000, // Ensuring the popup is in the front
        }}>
            <div style={{
                padding: 20,
                background: '#fff',
                borderRadius: '5px',
                display: 'inline-block',
                minHeight: '100px',
                margin: '1rem',
                position: 'relative',
                minWidth: '300px',
                maxWidth: '600px', // Limiting the width of the popup
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                justifySelf: 'center',
            }}>
                <button onClick={closePopup} style={{
                    position: 'absolute',
                    top: 0,
                    right: 10,
                    background: 'transparent',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                }}>×</button>
                {children}
                
            </div>
        </div>
    );
};

export default Popup;
