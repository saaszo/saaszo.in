"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { ChevronDown, Search } from "lucide-react";

type Option = { label: string; value: string };

type SearchableSelectProps = {
  label?: string;
  placeholder?: string;
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  emptyMessage?: string;
  disabled?: boolean;
  triggerClassName?: string;
};

export function SearchableSelect({
  label,
  placeholder = "Select...",
  options,
  value,
  onChange,
  emptyMessage = "No results found.",
  disabled = false,
  triggerClassName,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase()),
  );
  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <Label className="mb-1.5 block text-xs font-semibold text-slate-700">
          {label}
        </Label>
      )}

      <div
        className={[
          "flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 shadow-xs cursor-pointer transition-colors focus:outline-hidden focus:border-indigo-500 hover:border-slate-300",
          disabled ? "cursor-not-allowed opacity-60 bg-slate-50" : "",
          triggerClassName || "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span
          className={
            selectedOption
              ? "text-slate-900 font-medium truncate"
              : "text-slate-400 truncate"
          }
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? "rotate-180 text-indigo-600" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 z-[80] mt-1.5 max-h-64 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="p-2 border-b border-slate-100 bg-slate-50/50">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-2.5 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type to filter..."
                className="h-8 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-xs text-slate-800 focus:outline-hidden focus:border-indigo-500"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto p-1 divide-y divide-slate-50">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`flex w-full cursor-pointer select-none items-center rounded-lg py-2 px-3 text-xs font-medium transition-colors ${
                    option.value === value
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                  onClick={() => handleSelect(option.value)}
                >
                  <span className="truncate">{option.label}</span>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-xs text-slate-400 font-medium">
                {emptyMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
