"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { listings } from "../data/mockData";

const destinations = [...new Set(listings.map(listing => listing.location.split(',')[0]))];

export default function SearchBar() {
    const [destination, setDestination] = useState("");
    const [filteredDestinations, setFilteredDestinations] = useState([]);
    const [showDestinations, setShowDestinations] = useState(false);
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const handleDestinationChange = (e) => {
        const input = e.target.value;
        setDestination(input);
        if (input) {
            setFilteredDestinations(
                destinations.filter(d => d.toLowerCase().startsWith(input.toLowerCase()))
            );
            setShowDestinations(true);
        } else {
            setShowDestinations(false);
        }
    };

    const selectDestination = (selected) => {
        setDestination(selected);
        setShowDestinations(false);
    };

    return (
        <div className="search-section">
            <div className="search-bar">
                <div className="search-field">
                    <label>Destination</label>
                    <input
                        type="text"
                        placeholder="Rechercher une destination"
                        value={destination}
                        onChange={handleDestinationChange}
                        onFocus={() => setShowDestinations(true)}
                    />
                    {showDestinations && filteredDestinations.length > 0 && (
                        <ul className="destinations-list">
                            {filteredDestinations.map(d => (
                                <li key={d} onClick={() => selectDestination(d)}>
                                    {d}
                                </li>
                            ))}
                        </ul>
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
                <div className="search-field">
                    <label>Voyageurs</label>
                    <span>Ajouter des ...</span>
                </div>
                <button className="search-btn">🔍 Rechercher</button>
            </div>
        </div>
    );
}