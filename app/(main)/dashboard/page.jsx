"use client";

import React, { useEffect, useState } from 'react'; // Added import for useEffect
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'; // Correct import
import { UsernameSchema } from "@/app/lib/validators";
import useFetch from '@/hooks/use-fetch';
import { updateusername } from '@/actions/user';
import { BarLoader } from 'react-spinners';
import { getLatestUpdates } from '@/actions/dashboard';
import { format } from 'date-fns';
const Dashboard = () => {
  const { isLoaded, user } = useUser();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(UsernameSchema),
  });

  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (isLoaded) {
      setValue("username", user?.username);
      setOrigin(window.location.origin); // Set the origin for later use
    }
  }, [isLoaded, user, setValue]);
  const { loading, error, data, fn: fnUpdateusername } = useFetch(updateusername);
  const onSubmit = async (data) => {
    await fnUpdateusername(data.username);
  };
  const { loading: loadingUpdates, data: upcomingMeetings, fn: fnUpdates } = useFetch(getLatestUpdates);
  useEffect(() => {
    (async () => await fnUpdates())();
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>; // Show loading state
  }


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>
            Welcome, {user?.firstName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!loadingUpdates ? (
            <div>
              {upcomingMeetings && upcomingMeetings.length > 0 ? (
                <ul>
                  {upcomingMeetings.map((meeting) => {
                    return <li key={meeting.id}>
                      - {meeting.event.title} on {" "}
                      {format(new Date(meeting.startTime), "MMM d, yyyy h:mm a")} {" "}
                      with {meeting.name}
                    </li>
                  })}
                </ul>
              ) : (<p>No Upcoming Meeting</p>)
              }
            </div>) : (<p>Loading Updates...</p>)}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Your Unique Link</CardTitle>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Combined Row: Origin and Input Field */}
              <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                <span className="whitespace-nowrap">{origin}/</span> {/* Use state variable here */}
                <Input
                  {...register("username", { required: "Username is required" })}
                  placeholder="username"
                  className="flex-grow min-w-0"
                />
              </div>

              {/* Error Handling */}
              {errors.username && (
                <p className='text-red-500 text-sm mt-1'>{errors.username.message}</p>
              )}
              {error && (
                <p className='text-red-500 text-sm mt-1'>{error.message}</p>
              )}
              {loading && <BarLoader className='mb-4' width={"100%"} />}

              {/* Submit Button */}
              <Button type="submit">Update Username</Button>
            </form>
          </CardContent>
        </CardHeader>
      </Card>


    </div>
  );
}

export default Dashboard;
