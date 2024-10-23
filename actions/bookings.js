"use server";
import { db } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { google } from "googleapis";

export async function createBooking(bookingData) {
    try {
        // Fetch event details
        const event = await db.event.findUnique({
            where: { id: bookingData.eventId },
            include: { user: true },
        });
        if (!event) {
            throw new Error("Event not found");
        }

        // Fetch user's Google OAuth token from Clerk
        const { data } = await clerkClient.users.getUserOauthAccessToken(
            event.user.ClerkUserid,
            "oauth_google"
        );
        
        const token = data[0]?.token;

        if (!token) {
            throw new Error("Event creator has not connected their Google Calendar");
        }

        // Setup Google OAuth client
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: token });
        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        // Create a Google Calendar event
        // const meetResponse = await calendar.events.insert({
        //     calendarId: "primary",
        //     conferenceDataVersion: 1,
        //     requestBody: {
        //         summary: `${bookingData.name} - ${event.title}`,
        //         description: bookingData.additionalInfo,
        //         start: { dateTime: bookingData.startTime },
        //         end: { dateTime: bookingData.endTime },
        //         attendees: [
        //             { email: bookingData.email },
        //             { email: event.user.email }
        //         ],
        //         conferenceData: {
        //             createRequest: { requestId: `${event.id}-${Date.now()}` },
        //         }
        //     },
        // });
        const meetResponse = await calendar.events.insert({
            calendarId: "primary",
            conferenceDataVersion: 1,
            requestBody: {
                summary: `${bookingData.name} - ${event.title}`,
                description: bookingData.additionalInfo,
                start: { dateTime: bookingData.startTime },
                end: { dateTime: bookingData.endTime },
                attendees: [
                    { email: bookingData.email },
                    { email: event.user.email }
                ],
                conferenceData: {
                    createRequest: { requestId: `${event.id}-${Date.now()}` },
                },
                organizer: {
                    email: event.user.email, // Set the organizer explicitly
                    displayName: event.user.name, // Add display name for clarity
                },
                creator: {
                    email: event.user.email, // The creator should also be the event owner
                }
            },
        });
        

        // Extract meeting link and event ID
        const meetLink = meetResponse.data.hangoutLink;
        const googleEventId = meetResponse.data.id;

        // Create a booking in the database
        const booking = await db.booking.create({
            data: {
                eventId: event.id,
                userId: event.userId,
                name: bookingData.name,
                email: bookingData.email,
                startTime: bookingData.startTime,
                endTime: bookingData.endTime, // Fixed: should be bookingData.endTime
                additionalInfo: bookingData.additionalInfo,
                meetLink,
                googleEventId,
            },
        });

        // Return success response
        return { success: true, booking, meetLink };
    } catch (error) {
        // Return error response
        return { success: false, error: error.message };
    }
}
