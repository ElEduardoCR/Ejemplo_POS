"use client";

import { useState, useEffect } from "react";
import { Delete, X } from "lucide-react";

interface KeypadProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

const keys = [
  "7", "8", "9", "DEL",
  "4", "5", "6", "C",
  "1", "2", "3", "OK",
  "0", "00", ".", "",
];

export function Keypad({ value, onChange, className = "" }: KeypadProps) {
  const [display, setDisplay] = useState(String(value || 0));

  useEffect(() => {
    setDisplay(String(value || 0));
  }, [value]);

  const handle = (k: string) => {
    if (k === "DEL") {
      setDisplay((d) => (d.length > 1 ? d.slice(0, -1) : "0"));
    } else if (k === "C") {
      setDisplay("0");
    } else if (k === "OK") {
      onChange(parseFloat(display) || 0);
    } else if (k === ".") {
      if (!display.includes(".")) setDisplay((d) => d + ".");
    } else {
      setDisplay((d) => (d === "0" ? k : d + k));
    }
  };

  useEffect(() => {
    onChange(parseFloat(display) || 0);
  }, [display, onChange]);

  return (
    <div className={`grid grid-cols-4 gap-1.5 ${className}`}>
      {keys.map((k, i) => {
        if (!k) return <div key={i} />;
        const style =
          k === "DEL"
            ? "bg-danger-soft text-danger"
            : k === "C"
            ? "bg-danger-soft text-danger"
            : k === "OK"
            ? "bg-primary text-topbar"
            : k === "0" || k === "00"
            ? "col-span-1"
            : "bg-bg-soft hover:bg-border";
        return (
          <button
            key={i}
            onClick={() => handle(k)}
            className={`${style} rounded-lg py-3 text-lg font-semibold transition min-h-[52px] flex items-center justify-center`}
            type="button"
          >
            {k === "DEL" ? <Delete className="w-4 h-4" /> : k === "C" ? <X className="w-4 h-4" /> : k}
          </button>
        );
      })}
    </div>
  );
}
