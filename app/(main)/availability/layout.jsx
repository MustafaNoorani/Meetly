import { Suspense } from "react";
import React from 'react'; 
export default function AvailabilityLayout({ children }) {
  return (
    <div className="mx-auto">
      {" "}
      <Suspense fallback={<div>Loading Availibility...</div>}>
        {children}
      </Suspense>
    </div>
  );
}
