import { getEventAvailability } from "@/actions/availability";
import { getEventDetails } from "@/actions/events";
import BookingForm from "@/components/booking-form";
import EventDetails from "@/components/event-details";
import { notFound } from "next/navigation";
import { Suspense } from "react";
export async function generateMetadata({ params }) {
  const event = await getEventDetails(params.username, params.EventId);
  if (!event) {
    return {
      title: "Event Not Found",
    };
  }
  return {
    title: `Book ${event.title} with ${event.user.username} || Meetly`,
    description: `Schedule an  ${event.duration} (minutes) ${event.title} event with ${event.user.name}`,
  };
}
const EventPage = async ({ params }) => {
  const event = await getEventDetails(params.username, params.EventId);
  const availibility = await getEventAvailability(params.EventId);
  if (!event) {
    notFound();
  }
  return (
    <div className="flex flex-col lg:flex-row justify-center px-4 py-8">
      <EventDetails event={event} />
      <Suspense fallback={<div>Loading Booking Form...</div>}>
        <BookingForm event={event} availibility={availibility} />
      </Suspense>
    </div>
  );
};

export default EventPage;
