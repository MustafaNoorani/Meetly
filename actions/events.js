"use server";

import { auth } from "@clerk/nextjs/server";
import {db} from '@/lib/prisma';
import { eventSchema } from "@/app/lib/validators";

export async function CreateEvent(data) {
    const {userId} = await auth();
    if (!userId){
        throw new Error("Unauthorized");
    }
    const validateData = eventSchema.parse(data);
    const user = await db.User.findUnique({
        where: {ClerkUserid:userId},
    });
    if (!user){
        throw new Error("User not found");
    }
    const event = await db.event.create({
        data:{
            ...validateData,
            userId:user.id,

        },
    });
    return event;
    
}

export async function getUserEvents() {
    const {userId} = await auth();
    if (!userId){
        throw new Error("Unauthorized");
    }
    const user = await db.User.findUnique({
        where: {ClerkUserid:userId},
    });
    if (!user){
        throw new Error("User not found");
    }
    const events = await db.event.findMany({
       where: {userId: user.id},
       orderBy: {createdAt: "desc"},
       include:{
        _count:{
            select:{bookings:true},
        },
       },
    });
    return {events , username: user.username};

    
}
export async function deleteEvent(eventId) {
    const {userId} = await auth();
    if (!userId){
        throw new Error("Unauthorized");
    }
    const user = await db.User.findUnique({
        where: {ClerkUserid:userId},
    });
    if (!user){
        throw new Error("User not found");
    }
    const event = await db.event.findUnique({
        where : {id: eventId},
      
    });
    if(!event || event.userId !== user.id){
        throw new Error("Event not found or unautgorized");
    }
    await db.event.delete({
        where: {id:eventId},
    });
    return { success:true };

    
}
export async function getEventDetails(username,eventId) {
    const event = await db.event.findFirst({
        where : {id: eventId,
        user:{
            username : username,
        },
    },
      include:{
        user:{
            select:{
                name:true,
                email:true,
                username:true,
                imageUrl:true,
            }
        }
      }
    });

    return event;
    
}