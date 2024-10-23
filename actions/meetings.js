"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { google } from "googleapis";
export async function getUserMeetings(type = "upcoming") {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { ClerkUserid: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const now = new Date();

  const meetings = await db.booking.findMany({
    where: {
      userId: user.id,
      startTime: type === "upcoming" ? { gte: now } : { lt: now }, // Fixed typo
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      event: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      startTime: type === "upcoming" ? "asc" : "desc",
    },
  });

  return meetings;
}

export async function deleteMeeting(meetingId) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const user = await db.user.findUnique({
    where: { ClerkUserid: userId },
  });
  if (!user) {
    throw new Error("User not found");
  }
  const event = await db.booking.findUnique({
    where: { id: meetingId },
  });
  if (!event || event.userId !== user.id) {
    throw new Error("Event not found or unautgorized");
  }
  console.log(event);
  const { data } = await clerkClient.users.getUserOauthAccessToken(
    userId,
    "oauth_google",
  );

  const token = data[0]?.token;
  console.log("Google OAuth Token:", token);

  if (!token) {
    throw new Error("Event creator has not connected their Google Calendar");
  }
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: token });
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  try {
    // Assuming `event.googleEventId` stores the Google Calendar event ID
    await calendar.events.delete({
      calendarId: "primary", // or another calendar ID
      eventId: event.googleEventId, // The Google event ID to be deleted
    });
  } catch (err) {
    console.error("Error deleting event from Google Calendar:", err);
    throw new Error("Failed to delete event from Google Calendar");
  }
  await db.booking.delete({
    where: { id: meetingId },
  });
  return { success: true };
}
