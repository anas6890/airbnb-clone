"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { listings } from "../data/mockData";

const moroccanCities = [
    "Casablanca", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Oujda",
    "Kenitra", "Rabat", "Tétouan", "Safi", "Mohammedia", "Khouribga", "El Jadida",
    "Béni Mellal", "Nador", "Taza", "Settat", "Salé", "Ksar El Kebir", "Larache",
    "Khemisset", "Guelmim", "Berrechid", "Taourirt", "Berkane", "Sidi Slimane",
    "Sidi Kacem", "Khenifra", "Taroudant", "Essaouira", "Tiznit", "Ouarzazate",
    "Al Hoceima", "Fnideq", "Oued Zem", "Sidi Bennour", "Errachidia", "Guercif",
    "Midelt", "Azrou", "Chefchaouen", "Dakhla", "Tinghir", "Ifrane", "Zagora",
    "Asilah", "Imouzzer", "El Hajeb", "Sefrou", "Ouezzane"
].sort();

export default function SearchBar() {
    const [destination, setDestination] = useState("");
    const [filteredDestinations, setFilteredDestinations] = useState([]);
    const [showDestinations, setShowDestinations] = useState(false);
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    // Voyageurs state
    const [showGuests, setShowGuests] = useState(false);
    const [adults, setAdults] = useState(1);
    const [childrenCount, setChildrenCount] = useState(0);

    const handleDestinationChange = (e) => {
        const input = e.target.value;
        setDestination(input);
        if (input) {
            setFilteredDestinations(
                moroccanCities.filter(c => c.toLowerCase().includes(input.toLowerCase()))
            );
        } else {
            setFilteredDestinations(moroccanCities);
        }
    };

    const handleFocusDestination = () => {
        if (!destination) {
            setFilteredDestinations(moroccanCities);
        }
        setShowDestinations(true);
    };

    const selectDestination = (selected) => {
        setDestination(selected);
        setShowDestinations(false);
    };

    return (
        <div className="search-section">
            <div className="search-bar">
                <div className="search-field" style={{ position: "relative" }}>
                    <label>Destination</label>
                    <input
                        type="text"
                        placeholder="Rechercher une destination"
                        value={destination}
                        onChange={handleDestinationChange}
                        onFocus={handleFocusDestination}
                        onBlur={() => setTimeout(() => setShowDestinations(false), 200)}
                    />
                    {showDestinations && filteredDestinations.length > 0 && (
                        <div className="dropdown-menu">
                            <ul className="destinations-list">
                                {filteredDestinations.map(d => (
                                    <li key={d} onClick={() => selectDestination(d)}>
                                        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style={{ marginRight: '8px' }}><path d="M16 2a10 10 0 0 0-10 10c0 5 8 18 10 18s10-13 10-18A10 10 0 0 0 16 2zm0 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" /></svg>
                                        {d}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="divider" />
                <div className="search-field">
                    <label>Dates</label>
                    <DatePicker
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => {
                            setDateRange(update);
                        }}
                        placeholderText="Arrivée - Départ"
                        className="date-picker"
                    />
                </div>
                <div className="divider" />
                <div className="search-field" style={{ position: "relative" }}>
                    <div onClick={() => setShowGuests(!showGuests)} style={{ cursor: "pointer" }}>
                        <label style={{ cursor: "pointer" }}>Voyageurs</label>
                        <span>{adults + childrenCount > 0 ? `${adults + childrenCount} voyageur(s)` : "Ajouter des voyageurs"}</span>
                    </div>

                    {showGuests && (
                        <div className="dropdown-menu guests-dropdown">
                            <div className="guest-row">
                                <div>
                                    <strong>Adultes</strong>
                                    <span style={{ display: 'block', fontSize: '12px', color: '#717171' }}>13 ans et plus</span>
                                </div>
                                <div className="guest-controls">
                                    <button onClick={() => setAdults(Math.max(1, adults - 1))} disabled={adults <= 1}>-</button>
                                    <span>{adults}</span>
                                    <button onClick={() => setAdults(adults + 1)}>+</button>
                                </div>
                            </div>
                            <div className="guest-row">
                                <div>
                                    <strong>Enfants</strong>
                                    <span style={{ display: 'block', fontSize: '12px', color: '#717171' }}>De 2 à 12 ans</span>
                                </div>
                                <div className="guest-controls">
                                    <button onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))} disabled={childrenCount <= 0}>-</button>
                                    <span>{childrenCount}</span>
                                    <button onClick={() => setChildrenCount(childrenCount + 1)}>+</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <button className="search-btn">
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"><path d="M13 3a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm15.7 20.3-6.3-6.3a9.8 9.8 0 0 0 1.6-5A10 10 0 0 0 13 4a10 10 0 0 0-10 10 10 10 0 0 0 10 10 9.8 9.8 0 0 0 5-1.6l6.3 6.3a1 1 0 0 0 1.4-1.4z"/></svg>
                    <span style={{ marginLeft: "8px" }}>Rechercher</span>
                </button>
            </div>
        </div>
    );
}