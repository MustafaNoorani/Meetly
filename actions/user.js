"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import {db} from '@/lib/prisma'

export async function updateusername(username) {
    const {userId} = await auth();
    const client = await clerkClient();
    if (!userId){
        throw new Error("Unauthorized");
    }
    const existingUsername = await db.User.findUnique({
        where: {username},
    });
    if (existingUsername && existingUsername.id !== userId){
        throw new Error ("Username is already taken");
    }
    await db.User.update({
        where: {ClerkUserid: userId},
        data:{username},
    });
    client.users.updateUser(userId,{
        username,
    });
    return {success:true}
    
}
export async function getUserByUsername(username) {
    const user = await db.User.findUnique({
        where: {username},
        select:{
            id:true,
            name:true,
            email:true,
            imageUrl:true,
            events:{
                where:{
                    isPrivate:false,
                },
                orderBy:{
                    createdAt: "desc",
                },
                select:{
                    id:true,
                    title:true,
                    description:true,
                    duration:true,
                    isPrivate:true,
                    _count:{
                        select:{bookings:true},
                    }
                }
            }
        }
    });
    return user;
    
}
