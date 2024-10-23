import { getUserMeetings } from "@/actions/meetings";
import MeetingList from "@/components/meeting-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";
import React from 'react'; 
export const metadata = {
  title: "Your Meeting || Meetly",
  description: "View your upcoming and past meetings.",
};

const MeetingPage = () => {
  return (
    <Tabs defaultValue="upcoming">
      <TabsList>
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="past">Past</TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming">
        <Suspense fallback={<div>Loading Upcoming Meetings...</div>}>
          <UpcomingMeetings />
        </Suspense>
      </TabsContent>
      <TabsContent value="past">
        <Suspense fallback={<div>Loading Past Meetings...</div>}>
          <PastMeetings />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
};

async function UpcomingMeetings() {
  const meetings = await getUserMeetings("upcoming");
  return <MeetingList meetings={meetings} type={"upcoming"} />;
}
async function PastMeetings() {
  const meetings = await getUserMeetings("past");
  return <MeetingList meetings={meetings} type={"past"} />;
}
export default MeetingPage;
