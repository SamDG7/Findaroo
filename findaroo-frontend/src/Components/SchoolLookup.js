import React, { useState, useEffect } from 'react';

import schools from '../schools';


const SchoolLookup = ({onChangeFunction}) => {

    const [query, setQuery] = useState('');
    const [filteredSchools, setFilteredSchools] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        // Filter schools based on query
        const results = schools.filter(school =>
            school.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredSchools(results);
        setShowDropdown(query.length > 0 && results.length > 0);
    }, [query]);

    

    return (
        <div style={{display: "flex", padding: "0.5vw"}}>
            <h3>School</h3>
            <input
                type="text"
                placeholder="Start typing your school..."
                className="InputStandard"
                style={{width: "250px"}}
                value={query}
                onChange={ocFunc}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
            />
            {showDropdown && (
                <ul
                    style={{
                        position: 'absolute',
                        listStyleType: 'none',
                        padding: 0,
                        margin: 0,
                        marginTop: '40px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: '#fff',
                        maxHeight: '400px', // Adjust this value as needed
                        overflowY: 'auto',
                        maxWidth: '300px',
                        zIndex: 1000,
                    }}
                >
                    {filteredSchools.map((school, index) => (
                        <li
                            key={index}
                            className="school-option"
                            onMouseDown={() => setQuery(school)}
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
