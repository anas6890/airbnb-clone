"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Home, Hotel, Building2, TreePine, Warehouse, LayoutGrid } from "lucide-react";

export const categories = [
  { label: "Tout", value: "", icon: LayoutGrid },
  { label: "Appartements", value: "apartment", icon: Building2 },
  { label: "Maisons", value: "house", icon: Home },
  { label: "Villas", value: "villa", icon: Hotel },
  { label: "Cabanes", value: "cabin", icon: TreePine },
  { label: "Studios", value: "studio", icon: Warehouse },
];

export default function Categories() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentType = searchParams.get("type") || "";

  const handleClick = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
        params.set("type", value);
    } else {
        params.delete("type");
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
      <div className="pt-4 flex flex-row items-center justify-start overflow-x-auto hide-scrollbar gap-8">
        {categories.map((item) => (
          <div 
            key={item.label} 
            onClick={() => handleClick(item.value)}
            className={`flex flex-col items-center justify-center gap-2 p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer ${currentType === item.value ? "border-black text-neutral-800" : "border-transparent text-neutral-500"}`}
          >
            <item.icon size={26} />
            <div className="text-sm font-medium whitespace-nowrap">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


