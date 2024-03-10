import React, { useState, useEffect } from 'react';

import schools from '../schools';


function SchoolLookup({defaultValue, onChangeFunction}) {
    const [query, setQuery] = useState('');
    const [filteredSchools, setFilteredSchools] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        // Filter schools based on query
        if (query) {
            const results = schools.filter(school =>
                school.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredSchools(results);
            setShowDropdown(query.length > 0 && results.length > 0);
        }
    }, [query]);

    

    return (
        <div style={{display: "flex", padding: "0.5vw", position: "relative"}}>
            <h3 style={{ width: "10vw", textAlign: "right" }}>School</h3>
            <input
                type="text"
                placeholder="Start typing your school..."
                className="InputStandard"
                style={{width: "100%"}}
                value={defaultValue}
                onChange={ocFunc}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
            />
            {showDropdown && (
                <ul
                    style={{
                        position: 'absolute',
                        left: '70%',
                        transform: 'translateX(-50%)',
                        listStyleType: 'none',
                        padding: 0,
                        margin: 0,
                        marginTop: '40px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: '#fff',
                        maxHeight: '400px', // Adjust this value as needed
                        overflowY: 'auto',
                        width: '90%',
                        maxWidth: '0.5hw',
                        zIndex: 1000,
                    }}
                >
                    {filteredSchools.map((school, index) => (
                        <li
                            key={index}
                            className="school-option"
                            onMouseDown={() => { setShowDropdown(false); setQuery(school); onChangeFunction(school); }}
                        >
                            {school}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

    function ocFunc(e) {
        setQuery(e.target.value);
        onChangeFunction(e.target.value);
    }
};

export default SchoolLookup;
