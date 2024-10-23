import { getUserEvents } from "@/actions/events";
import Eventcard from "@/components/event-card";
import { Suspense } from "react";
import React from 'react'; 
export default function EventsPage() {
  return (
    <Suspense fallback={<div>Loading Events...</div>}>
      <Events />
    </Suspense>
  );
}

const Events = async () => {
  const { events, username } = await getUserEvents();

  if (events.length === 0) {
    return <p>You haven&apos;t any events yet</p>;
  }
  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      {events.map((event) => (
        <Eventcard key={event.id} event={event} username={username} />
      ))}
    </div>
  );
};
