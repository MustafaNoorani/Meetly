import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserByUsername } from "@/actions/user";
import Eventcard from '@/components/event-card';

export async function generateMetadata({params}) {
  const user = await getUserByUsername(params.username);
  if (!user){
    return {
      title : "User Not Found",
    };
  }
  return {
    title: `${user.name}'s Profile | Meetly`,
    description: `Book an event with ${user.name}. View available public events and meetings.`, 
  };
}
const UserPage = async ({ params }) => {
  const user = await getUserByUsername(params.username);
  if (!user) {
    notFound();
  }
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className="flex flex-col items-center mb-8">
        <Avatar className="h-24 w-24 mb-4 mt-4">
          <AvatarImage src={user.imageUrl} alt={user.name} />
          <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
        <p className="text-gray-600 text-center">
          Welcome to my meetings page. Please select an event below to book a meeting with me.
        </p>

      </div>
      {user.events.length === 0?(<p className='text-center text-gray-800'>No public events available.</p>) :
      (
        <div className='grid lg:grid-cols-3 md:grid-cols-2 gap-6'>{user.events.map((event)=>{
          return <Eventcard
          key={event.id}
          event={event}
          username={params.username}
          isPublic
          />
        })}</div>
      )
      }
    </div>
  )
}

export default UserPage