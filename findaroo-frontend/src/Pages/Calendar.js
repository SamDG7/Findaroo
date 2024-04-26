import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import { useNavigate } from "react-router-dom";
import { useState, useEffect} from "react";
import {
    add,
    eachDayOfInterval,
    endOfMonth,
    format,
    getDay,
    isEqual,
    isSameDay,
    isSameMonth,
    isToday,
    parse,
    parseISO,
    startOfToday,
} from 'date-fns';
import Popup from "../Components/Popup";

var events = GlobalVariables.events;
  
const colStartClasses = [
    '',
    'col-start-2',
    'col-start-3',
    'col-start-4',
    'col-start-5',
    'col-start-6',
    'col-start-7',
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

function CreateEventForm({ onSubmit }) {

    const [isAdding, setAdding] = useState(true);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, description, date });
        setName('');
        setDescription('');
        setDate('');
    };

    const toggleAdding = () => {
        setAdding(!isAdding);
    };

    return (
        <div>
            <Popup isOpen={isAdding} closePopup={toggleAdding}>
                <h2>Add Event</h2>
                <form onSubmit={handleSubmit}>
                    <div className="Column Center">
                        <input
                        type="text"
                        placeholder="Event Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        />
                        <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        />
                        <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        />
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </Popup>
        </div>
    );
}

function Event({ event }) {

    const [isEditing, setEditing] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');

    const toggleEditing = () => {
        setEditing(!isEditing);
    };

    const modifyEvent = () => {
        setEditing(true);
    };

    const deleteEvent = () => {
        var index = events.indexOf(event);
        if (index != -1)
        {
            events.splice(index, 1);
        }
        else
        {
            console.log("Attempt to delete an event that does not exist");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        event.name = name;
        event.date = date;
        event.description = description;
        toggleEditing();
    };

    return (
        <div>
            <Popup isOpen={isEditing} closePopup={toggleEditing}>
                <h2>Modify Event</h2>
                <form onSubmit={handleSubmit}>
                    <div className="Column Center">
                        <input
                        type="text"
                        placeholder="Event Name"
                        value={name}
                        defaultValue={event.name}
                        onChange={(e) => setName(e.target.value)}
                        />
                        <input
                        type="date"
                        value={date}
                        defaultValue={event.date}
                        onChange={(e) => setDate(e.target.value)}
                        />
                        <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        defaultValue={event.description}
                        onChange={(e) => setDescription(e.target.value)}
                        />
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </Popup>

            <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
                <img
                src={event.imageUrl}
                alt=""
                className="flex-none w-10 h-10 rounded-full"
                />
                <div className="flex-auto">
                    <b className="text-black-1000">{event.name}</b>
                    <p className="text-gray-400">{event.description}</p>
                </div>
                <div
                  onClick={modifyEvent}
                >
                  Edit
                </div>
                <div
                  onClick={deleteEvent}
                >
                  Delete
                </div>
            </li>
        </div>
    );
}

const styles = {
    addButton: {
    backgroundColor: 'pink', // Changed to pink color
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    position: 'fixed', // Changed to fixed to move to the right
    right: '10px', // Positioned to the right
    top: '10px', // Positioned at the top
    },
    addButtonHover: {
    backgroundColor: '#ff85a2', // Lighter pink on hover
    },
};

export default function CalendarPage() {
    // This redirects to the login page if not logged in
    const navigate = useNavigate();

    useEffect(() => {
        if (!GlobalVariables.authenticated) {
            navigate("/Login");
        }
    }, []);

    const today = startOfToday();
    const [selectedDay, setSelectedDay] = useState(today);
    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
    const [showCreateEventForm, setShowCreateEventForm] = useState(false);
    const [hovered, setHovered] = useState(false);

    const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

    const days = eachDayOfInterval({
        start: firstDayCurrentMonth,
        end: endOfMonth(firstDayCurrentMonth),
    });

    const selectedDayEvents = events.filter((event) =>
        isSameDay(parseISO(event.startDatetime), selectedDay)
    );

    function previousMonth() {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
    }

    function nextMonth() {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
    }

    const [isAdding, setAdding] = useState(false);

    const addNewEvent = ({ name, description, date }) => {
        const newEvent = {
            id: events.length + 1,
            name: name,
            description: description,
            imageUrl: 'https://via.placeholder.com/256',
            startDatetime: date,
            endDatetime: date,
        };
        events = [...events, newEvent];
        setShowCreateEventForm(false); // Hide form after submission
    };

    return (
        <div
        className="Page"
        style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}
        >
            <Navbar/>

            <div className="pt-16">
                <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
                    <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
                        <div className="md:pr-14">
                            <div className="flex items-center">
                            <h2 className="flex-auto font-semibold text-gray-900">
                                {format(firstDayCurrentMonth, 'MMMM yyyy')}
                            </h2>
                            <button
                                type="button"
                                onClick={previousMonth}
                                className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                            >
                                <p>&larr;</p>
                            </button>
                            <button
                                onClick={nextMonth}
                                type="button"
                                className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                            >
                                <p>&rarr;</p>
                            </button>
                            </div>
                            <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
                            <div>S</div>
                            <div>M</div>
                            <div>T</div>
                            <div>W</div>
                            <div>T</div>
                            <div>F</div>
                            <div>S</div>
                            </div>
                            <div className="grid grid-cols-7 mt-2 text-sm">
                            {days.map((day, dayIdx) => (
                                <div
                                key={day.toString()}
                                className={classNames(
                                    dayIdx === 0 && colStartClasses[getDay(day)],
                                    'py-1.5'
                                )}
                                >
                                <button
                                    type="button"
                                    onClick={() => setSelectedDay(day)}
                                    className={classNames(
                                    isEqual(day, selectedDay) && 'text-white',
                                    !isEqual(day, selectedDay) &&
                                        isToday(day) &&
                                        'text-red-500',
                                    !isEqual(day, selectedDay) &&
                                        !isToday(day) &&
                                        isSameMonth(day, firstDayCurrentMonth) &&
                                        'text-gray-900',
                                    !isEqual(day, selectedDay) &&
                                        !isToday(day) &&
                                        !isSameMonth(day, firstDayCurrentMonth) &&
                                        'text-gray-400',
                                    isEqual(day, selectedDay) && isToday(day) && 'bg-red-500',
                                    isEqual(day, selectedDay) &&
                                        !isToday(day) &&
                                        'bg-gray-900',
                                    !isEqual(day, selectedDay) && 'hover:bg-gray-200',
                                    (isEqual(day, selectedDay) || isToday(day)) &&
                                        'font-semibold',
                                    'mx-auto flex h-8 w-8 items-center justify-center rounded-full'
                                    )}
                                >
                                    <time dateTime={format(day, 'yyyy-MM-dd')}>
                                    {format(day, 'd')}
                                    </time>
                                </button>

                                <div className="w-1 h-1 mx-auto mt-1">
                                    {events.some((event) =>
                                    isSameDay(parseISO(event.startDatetime), day)
                                    ) && (
                                    <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                                    )}
                                </div>
                                </div>
                            ))}
                            </div>
                        </div>
                        <section className="mt-12 md:mt-0 md:pl-14">
                            <h2 className="font-semibold text-gray-900">
                            Schedule for{' '}
                            <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                                {format(selectedDay, 'MMM dd, yyyy')}
                            </time>
                            </h2>
                            <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
                            {selectedDayEvents.length > 0 ? (
                                selectedDayEvents.map((event) => (
                                <Event event={event} key={event.id} />
                                ))
                            ) : (
                                <p>No events found.</p>
                            )}
                            </ol>
                        </section>
                    </div>
                </div>

                <button
                onClick={() => setShowCreateEventForm(true)}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                >
                    Add New Event
                </button>
                {showCreateEventForm && <CreateEventForm onSubmit={addNewEvent} />}
            </div>
        </div>
    );
}