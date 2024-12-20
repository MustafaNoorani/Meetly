import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock } from "lucide-react";

const EventDetails = ({ event }) => {
  return (
    <div className="p-4 lg:p-10 w-full lg:w-1/3 bg-white">
      <h1 className="text-2xl lg:text-3xl font-bold mb-4">{event.title}</h1>
      <div className="flex items-center mb-4">
        <Avatar className="h-12 w-12 mb-4">
          <AvatarImage src={event.user.imageUrl} alt={event.user.name} />
          <AvatarFallback>{event.user.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="ml-2">
          <h2 className="text-xl font-semibold">{event.user.name}</h2>
          <p className="text-gray-600">@{event.user.username}</p>
        </div>
      </div>
      <div className="flex items-center mb-2">
        <Clock className="mr-2" />
        <span>{event.duration} minutes</span>
      </div>
      <div className="flex items-center mb-4">
        <Calendar className="mr-2" />
        <span>Google Meet</span>
      </div>
      <div className="flex items-center mb-4">
        <span>{event.description}</span>
      </div>
    </div>
  );
}

export default EventDetails;
