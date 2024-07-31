"use client";

import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

const initialState = { from: undefined, to: undefined };

const ReservationContext = createContext(initialState);

export function ReservationProvider({ children }) {
  const [range, setRange] = useState(initialState);
  const resetRange = () => setRange(initialState);

  return (
    <ReservationContext.Provider
      value={{
        range,
        setRange,
        resetRange,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservation() {
  const context = useContext(ReservationContext);

  if (!context)
    throw new Error("useReservation must be used within a ReservationProvider");

  return context;
}
