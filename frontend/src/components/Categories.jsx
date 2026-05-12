"use client";
import React from "react";
import { Trees, MountainSnow, Waves, Campfire, Castle, Flame, Ship, Palmtree, Tent } from "lucide-react";
export const categories = [
  { label: "Plage", icon: Palmtree, selected: false },
  { label: "Campagne", icon: Trees, selected: true },
  { label: "Piscines", icon: Waves, selected: false },
  { label: "Chalets", icon: Tent, selected: false },
  { label: "Châteaux", icon: Castle, selected: false },
  { label: "Ski", icon: MountainSnow, selected: false },
  { label: "Tendance", icon: Flame, selected: false },
  { label: "Bateaux", icon: Ship, selected: false },
];
export default function Categories() {
  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
      <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto hide-scrollbar gap-10">
        {categories.map((item) => (
          <div key={item.label} className={`flex flex-col items-center justify-center gap-2 p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer ${item.selected ? "border-black text-neutral-800" : "border-transparent text-neutral-500"}`}>
            <item.icon size={26} />
            <div className="text-sm font-medium">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

