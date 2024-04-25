import React, { useState } from 'react';
import './RoomHistory.css'; // Import the CSS for styling

function RoomHistory() {
    // Sample data: List of rooms and their roommates
    const [rooms, setRooms] = useState([
        { id: 1, name: "Room A", roommates: ["Alice", "Bob"] },
        { id: 2, name: "Room B", roommates: ["Charlie", "David"] },
        { id: 3, name: "Room C", roommates: ["Eve", "Frank"] },
    ]);

    // State to manage the visibility of roommates for each room
    const [visibleRoommate, setVisibleRoommate] = useState(null);

    // Function to toggle roommates' visibility
    const toggleRoommates = (roomId) => {
        if (visibleRoommate === roomId) {
            setVisibleRoommate(null);
        } else {
            setVisibleRoommate(roomId);
        }
    };

    return (
        <div className="room-history">
            <h1>Room History</h1>
            <ul>
                {rooms.map(room => (
                    <li key={room.id} className="room-item">
                        <button className="room-button" onClick={() => toggleRoommates(room.id)}>
                            {room.name}
                            <span className="dropdown-arrow">{visibleRoommate === room.id ? '▲' : '▼'}</span>
                        </button>
                        {visibleRoommate === room.id && (
                            <ul className="roommate-list">
                                {room.roommates.map((roommate, index) => (
                                    <li key={index} className="roommate-item">
                                        <img src="https://via.placeholder.com/50" alt="Profile" className="profile-pic"/>
                                        {roommate}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RoomHistory;
