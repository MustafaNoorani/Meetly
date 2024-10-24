"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Calendar, Trash2, Video } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import useFetch from '@/hooks/use-fetch';
import { deleteMeeting } from '@/actions/meetings';
import { useState } from "react";

const MeetingList = ({ meetings, type }) => {
    const router = useRouter();
    const [loadingMeetingId, setLoadingMeetingId] = useState(null);
    const { loading, fn: fnDeleteMeeting } = useFetch(deleteMeeting);
    const handleDelete = async (meetingId) => {
        if (window?.confirm("Are you sure you want to delete this event?")) {
            setLoadingMeetingId(meetingId);
            await fnDeleteMeeting(meetingId);
            setLoadingMeetingId(null);
            router.refresh();
        }
    }
    if (meetings.length === 0) {
        return <p>No {type} meeting found.</p>
    }
    return (

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {meetings.map((meeting) => {
                return (
                    <Card key={meeting} className="flex flex-col justify-between">
                        <CardHeader>
                            <CardTitle>{meeting.event.title}</CardTitle>
                            <CardDescription>with {meeting.name}</CardDescription>
                            <CardDescription>&quot;{meeting.additionalInfo}&quot;</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='flex items-center mb-2'>
                                <Calendar className='mr-2 h-4 w-4' />
                                <span>
                                    {format(new Date(meeting.startTime), "MMMM d,yyyy")}
                                </span>
                            </div>
                            <div className='flex items-center mb-2'>
                                <Calendar className='mr-2 h-4 w-4' />
                                <span>
                                    {format(new Date(meeting.startTime), "h:mm a")}-{" "}
                                    {format(new Date(meeting.endTime), "h:mm a")}
                                </span>
                            </div>
                            {meeting.meetLink && (
                                <div className='flex items-center mb-2'>
                                    <Video className='mr-2 h-4 w-4' />
                                    <a href={meeting.meetLink} target='_blank' rel='noopener noreferer' className='text-blue-500 hover:underline'>
                                        Join Meeting
                                    </a>

                                </div>
                            )

                            }
                        </CardContent>
                        <CardFooter>
                            <Button variant="destructive" onClick={() => handleDelete(meeting.id)} disabled={loadingMeetingId === meeting.id}>
                                <Trash2 className='mr-2 h-4 w-4' />
                                {loadingMeetingId === meeting.id ? "Deleting..." : "Cancel Meeting"}
                            </Button>
                        </CardFooter>
                    </Card>

                );
            })
            }
        </div>
    )
}

export default MeetingList;