"use client";
import { useState, useRef, useEffect } from "react";

const MOROCCAN_CITIES = [
    "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger",
    "Agadir", "Meknès", "Oujda", "Kénitra", "Tétouan",
    "Salé", "Safi", "Mohammedia", "El Jadida", "Béni Mellal",
    "Essaouira", "Dakhla", "Laâyoune", "Ouarzazate", "Ifrane",
    "Chefchaouen", "Asilah", "Taroudant", "Tiznit", "Nador",
];

const MONTHS_FR = [
    "Janvier","Février","Mars","Avril","Mai","Juin",
    "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
];
const DAYS_FR = ["Lu","Ma","Me","Je","Ve","Sa","Di"];

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
    // 0=Sun..6=Sat → convert to Mon=0
    const d = new Date(year, month, 1).getDay();
    return (d + 6) % 7;
}

function Calendar({ value, onChange, minDate }) {
    const today = new Date();
    const initial = value ? new Date(value) : (minDate ? new Date(minDate) : today);
    const [viewYear, setViewYear] = useState(initial.getFullYear());
    const [viewMonth, setViewMonth] = useState(initial.getMonth());

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const selectedDate = value ? new Date(value) : null;

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return (
        <div className="p-4 w-72">
            <div className="flex items-center justify-between mb-3">
                <button onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <span className="font-semibold text-gray-900 text-sm">
          {MONTHS_FR[viewMonth]} {viewYear}
        </span>
                <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </div>
            <div className="grid grid-cols-7 mb-1">
                {DAYS_FR.map(d => (
                    <div key={d} className="text-center text-[11px] font-semibold text-gray-400 py-1">{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-y-1">
                {cells.map((day, idx) => {
                    if (!day) return <div key={`empty-${idx}`} />;
                    const dateObj = new Date(viewYear, viewMonth, day);
                    const isDisabled = minDate && dateObj < new Date(minDate);
                    const isSelected = selectedDate &&
                        dateObj.getDate() === selectedDate.getDate() &&
                        dateObj.getMonth() === selectedDate.getMonth() &&
                        dateObj.getFullYear() === selectedDate.getFullYear();
                    const isToday = dateObj.toDateString() === today.toDateString();

                    return (
                        <button
                            key={day}
                            disabled={isDisabled}
                            onClick={() => !isDisabled && onChange(dateObj.toISOString().split("T")[0])}
                            className={`
                text-center text-sm py-1.5 rounded-full transition-colors duration-150
                ${isSelected ? "bg-gray-900 text-white font-semibold" : ""}
                ${!isSelected && isToday ? "border border-gray-900 text-gray-900 font-semibold" : ""}
                ${!isSelected && !isToday && !isDisabled ? "hover:bg-gray-100 text-gray-700" : ""}
                ${isDisabled ? "text-gray-300 cursor-not-allowed" : "cursor-pointer"}
              `}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function formatDate(iso) {
    if (!iso) return "";
    const [year, month, day] = iso.split("-");
    return `${day} ${MONTHS_FR[parseInt(month) - 1].slice(0, 3)}. ${year}`;
}

const searchConfig = {
    logements: [
        { id: "destination", label: "Destination", placeholder: "Où allez-vous ?", type: "city" },
        { id: "checkin", label: "Arrivée", placeholder: "Ajouter une date", type: "date" },
        { id: "checkout", label: "Départ", placeholder: "Ajouter une date", type: "date" },
        { id: "guests", label: "Voyageurs", placeholder: "Ajouter des voyageurs", type: "guests" },
    ],
    experiences: [
        { id: "destination", label: "Destination", placeholder: "Où allez-vous ?", type: "city" },
        { id: "date", label: "Date", placeholder: "Choisir une date", type: "date" },
        { id: "guests", label: "Participants", placeholder: "Ajouter des participants", type: "guests" },
    ],
};

export default function SearchBar({ mode, suggestions = MOROCCAN_CITIES }) {
     const [activeField, setActiveField] = useState(null);
     const [values, setValues] = useState({});
     const [citySearch, setCitySearch] = useState("");
     const [highlightIndex, setHighlightIndex] = useState(-1);
     const barRef = useRef(null);
     const listRef = useRef(null);

     const fields = searchConfig[mode];

     useEffect(() => {
         const handleClick = (e) => {
             if (barRef.current && !barRef.current.contains(e.target)) {
                 setActiveField(null);
             }
         };
         document.addEventListener("mousedown", handleClick);
         return () => document.removeEventListener("mousedown", handleClick);
     }, []);

     const handleFieldClick = (id) => {
         setActiveField(prev => prev === id ? null : id);
         if (id === "destination") setCitySearch(values.destination || "");
         setHighlightIndex(-1);
     };

     const setValue = (id, val) => setValues(prev => ({ ...prev, [id]: val }));

    // filter suggestions (passed from HomePage) live as the user types
    const filteredCities = suggestions
        .filter(Boolean)
        .filter(c => c.toLowerCase().includes(citySearch.toLowerCase()))
        .slice(0, 50);

    useEffect(() => {
        // reset highlight when filteredCities changes
        setHighlightIndex(filteredCities.length ? 0 : -1);
    }, [citySearch]);

    // keyboard navigation for city list
    const onCityKeyDown = (e) => {
        if (filteredCities.length === 0) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = Math.min((highlightIndex !== -1 ? highlightIndex + 1 : 0), filteredCities.length - 1);
            setHighlightIndex(i => Math.min(i + 1, filteredCities.length - 1));
            listRef.current?.querySelectorAll('button')[nextIndex]?.scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = Math.max((highlightIndex !== -1 ? highlightIndex - 1 : 0), 0);
            setHighlightIndex(i => Math.max(i - 1, 0));
            listRef.current?.querySelectorAll('button')[prev]?.scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const pick = filteredCities[highlightIndex >= 0 ? highlightIndex : 0];
            if (pick) {
                setValue('destination', pick);
                setCitySearch(pick);
                setActiveField(null);
            }
        } else if (e.key === 'Escape') {
            setActiveField(null);
        }
    };

    return (
        <div className="w-full flex justify-center">
            <div ref={barRef} className="relative w-full max-w-5xl">
                {/* Main bar */}
                <div className={`
          flex items-stretch bg-white rounded-full border
          transition-all duration-300
          ${activeField
                    ? "border-gray-300 shadow-[0_8px_40px_rgba(0,0,0,0.18)]"
                    : "border-gray-200 shadow-[0_2px_20px_rgba(0,0,0,0.10)] hover:shadow-[0_4px_30px_rgba(0,0,0,0.15)]"
                }
        `}>
                    {fields.map((field, idx) => {
                        const isActive = activeField === field.id;
                        let displayValue = "";
                        if (field.type === "date") displayValue = formatDate(values[field.id]);
                        else if (field.type === "guests") displayValue = values.guests ? `${values.guests} voyageur${values.guests > 1 ? "s" : ""}` : "";
                        else displayValue = values[field.id] || "";

                        return (
                            <div key={field.id} className="flex items-stretch flex-1 min-w-0">
                                {idx > 0 && (
                                    <div className={`w-px self-stretch my-3 transition-opacity duration-200 ${activeField ? "bg-transparent" : "bg-gray-200"}`} />
                                )}
                                <button
                                    onClick={() => handleFieldClick(field.id)}
                                    className={`
                    flex-1 flex flex-col justify-center px-8 py-5 rounded-full text-left
                    transition-all duration-200 min-w-0 group
                    ${isActive ? "bg-white shadow-[0_2px_20px_rgba(0,0,0,0.12)]" : "hover:bg-gray-50"}
                  `}
                                >
                  <span className="text-[12px] font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                    {field.label}
                  </span>
                                    <span className={`text-[15px] truncate mt-1 ${displayValue ? "text-gray-800 font-medium" : "text-gray-400 font-normal"}`}>
                    {displayValue || field.placeholder}
                  </span>
                                </button>
                            </div>
                        );
                    })}

                    {/* Search button */}
                    <div className="flex items-center px-4 py-4 shrink-0">
                        <button className="rounded-full flex items-center gap-2 px-8 py-4 font-semibold text-sm text-white active:scale-95 transition-all duration-200 whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FF6090 100%)', boxShadow: '0 8px 24px rgba(233, 30, 99, 0.3)' }}>
                             <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white shrink-0" aria-hidden="true">
                                 <path d="M13 0C5.8 0 0 5.8 0 13s5.8 13 13 13c2.9 0 5.6-1 7.7-2.6l7.5 7.5 2.8-2.8-7.4-7.4C25 18.6 26 15.9 26 13 26 5.8 20.2 0 13 0zm0 4c5 0 9 4 9 9s-4 9-9 9-9-4-9-9 4-9 9-9z" />
                             </svg>
                             <span className="hidden sm:inline">Rechercher</span>
                         </button>
                     </div>
                 </div>

                 {/* ── DROPDOWNS ── */}
                 {/* City dropdown */}
                {activeField === "destination" && (
                    <div className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 bg-white rounded-2xl border border-gray-100 z-50 w-full max-w-md overflow-hidden card-elevated dropdown-animate" role="dialog" aria-modal="false">
                         <div className="p-3 border-b border-gray-100">
                             <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                                 <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                                     <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                                 </svg>
                                 <input
                                     autoFocus
                                     type="text"
                                     value={citySearch}
                                     onChange={e => setCitySearch(e.target.value)}
                                     onKeyDown={onCityKeyDown}
                                     placeholder="Rechercher une ville..."
                                     className="bg-transparent text-sm text-gray-800 outline-none w-full placeholder:text-gray-400"
                                 />
                             </div>
                         </div>
                         <div ref={listRef} className="max-h-64 overflow-y-auto py-2" role="listbox" aria-label="Suggestions de villes">
                             {filteredCities.length === 0 ? (
                                 <p className="px-4 py-3 text-sm text-gray-400 text-center">Aucune ville trouvée</p>
                             ) : filteredCities.map((city, i) => (
                                 <button
                                     key={city}
                                     role="option"
                                     aria-selected={i === highlightIndex}
                                     onMouseEnter={() => setHighlightIndex(i)}
                                     onClick={() => {
                                         setValue("destination", city);
                                         setCitySearch(city);
                                         setActiveField(null);
                                     }}
                                     className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left group ${i === highlightIndex ? 'bg-primary-2/10' : 'hover:bg-surface'}`}
                                 >
                 <span className={`flex items-center justify-center w-10 h-10 rounded-xl ${i === highlightIndex ? 'bg-primary-2 text-white' : 'bg-surface'} transition-colors shrink-0`}>
                   <svg viewBox="0 0 24 24" className="w-4 h-4 text-current" fill="none" stroke="currentColor" strokeWidth="2">
                     <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                   </svg>
                 </span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{city}</p>
                                        <p className="text-xs text-gray-400">Maroc</p>
                                    </div>
                                </button>
                            ))}
                         </div>
                     </div>
                 )}

                 {/* Check-in calendar */}
                {(activeField === "checkin" || activeField === "date") && (
                    <div className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 bg-white rounded-2xl border border-gray-100 z-50 overflow-hidden card-elevated dropdown-animate">
                         <Calendar
                             value={values[activeField]}
                             onChange={(val) => {
                                 setValue(activeField, val);
                                 if (activeField === "checkin") setActiveField("checkout");
                                 else setActiveField(null);
                             }}
                         />
                     </div>
                 )}

                 {/* Check-out calendar */}
                {activeField === "checkout" && (
                    <div className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 bg-white rounded-2xl border border-gray-100 z-50 overflow-hidden card-elevated dropdown-animate">
                         <Calendar
                             value={values.checkout}
                             minDate={values.checkin}
                             onChange={(val) => {
                                 setValue("checkout", val);
                                 setActiveField(null);
                             }}
                         />
                     </div>
                 )}

                 {/* Guests dropdown */}
                {activeField === "guests" && (
                    <div className="absolute top-[calc(100%+12px)] right-0 bg-white rounded-2xl border border-gray-100 z-50 w-72 p-5 card-elevated dropdown-animate">
                         <p className="text-sm font-semibold text-gray-900 mb-4">Nombre de voyageurs</p>
                         {[
                             { key: "adultes", label: "Adultes", sub: "13 ans et plus" },
                             { key: "enfants", label: "Enfants", sub: "2 à 12 ans" },
                             { key: "bebes", label: "Bébés", sub: "Moins de 2 ans" },
                         ].map((type) => {
                             const key = type.key;
                             const count = values[key] || 0;
                              return (
                                  <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                      <div>
                                          <p className="text-sm font-medium text-gray-900">{type.label}</p>
                                          <p className="text-xs text-gray-400">{type.sub}</p>
                                      </div>
                                      <div className="flex items-center gap-3">
                                          <button
                                              disabled={count === 0}
                                              onClick={() => {
                                                  const newCount = Math.max(0, count - 1);
                                                  setValue(key, newCount);
                                                  const total = (values.adultes || 0) + (values.enfants || 0) + (values.bebes || 0) - count + newCount;
                                                  setValue("guests", total);
                                              }}
                                              className={`w-8 h-8 rounded-full border flex items-center justify-center text-lg font-light transition-colors
                         ${count === 0 ? "border-gray-200 text-gray-200 cursor-not-allowed" : "border-gray-400 text-gray-700 hover:border-gray-900"}`}
                                         >−</button>
                                          <span className="text-sm font-medium text-gray-900 w-4 text-center">{count}</span>
                                          <button
                                              onClick={() => {
                                                  const newCount = count + 1;
                                                  setValue(key, newCount);
                                                  const total = (values.adultes || 0) + (values.enfants || 0) + (values.bebes || 0) - count + newCount;
                                                  setValue("guests", total);
                                              }}
                                              className="w-8 h-8 rounded-full border border-gray-400 text-gray-700 hover:border-gray-900 flex items-center justify-center text-lg font-light transition-colors"
                                          >+</button>
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  )}
              </div>
          </div>
      );
  }
