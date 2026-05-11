"use client";
import React from "react";
import SearchBar from "./SearchBar";

export default function Header() {
    return (
        <nav className="navbar">
            <div className="navbar-top">
                <a href="/" className="logo">
                    <img src="/logo.png" alt="alasBnb" className="logo-img" />
                </a>
                <div className="nav-tabs">
                    <a className="nav-tab active" href="/">Logements</a>
                    <a className="nav-tab" href="/experiences">
                        <span className="floating-badge">Nouveau</span>
                        Expériences
                    </a>
                </div>
                <div className="nav-right">
                    <a href="/host" className="become-host" style={{ textDecoration: 'none', color: '#222' }}>Devenir hôte</a>
                    <div className="globe-icon">
                        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm-.5 15.939A7.001 7.001 0 0 1 1.06 8.5H4.15a13.313 13.313 0 0 0 .524 4.544 14.887 14.887 0 0 0 2.825 2.895zM4.15 7.5H1.06A7.001 7.001 0 0 1 7.5.061v14.43A14.896 14.896 0 0 0 4.675 11.6 13.315 13.315 0 0 0 4.15 7.5zM8.5.061A7.001 7.001 0 0 1 14.94 7.5h-3.09a13.313 13.313 0 0 0-.525-4.544A14.889 14.889 0 0 0 8.5.061zM11.85 8.5h3.09a7.001 7.001 0 0 1-6.44 7.439v-14.43A14.893 14.893 0 0 0 11.325 4.4 13.314 13.314 0 0 0 11.85 8.5z" /></svg>
                    </div>
                    <div className="nav-icons" style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/compte'}>
                        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"><path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg>
                        <div className="avatar-circle">
                            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"><path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>
                        </div>
                    </div>
                </div>
            </div>
            <SearchBar />
        </nav>
    );
}
