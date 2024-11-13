"use server";

import { auth } from "@clerk/nextjs/server";
import {db} from '@/lib/prisma';
export async function getLatestUpdates() {
    const { userId } = await auth();
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
    const upcomingmeetings = await db.booking.findMany({
        where: {
            userId: user.id,
            startTime: { gte: now }, // Fixed typo
        },
        include: {
            event: {
                select: {
                    title: true,
                },
            },
        },
        orderBy: {
            startTime: "asc",
        },
    });

    return upcomingmeetings;
    
}