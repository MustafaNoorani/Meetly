"use server";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import {db} from './prisma';
export const CheckUser = async () => {
    const user = await currentUser();
    const client = await clerkClient();
    if(!user){
        return null;
    }

    try{
        const loggedInUser = await db.user.findUnique({
            where: {
                ClerkUserid: user.id,
            },

        });
        if (loggedInUser){
            return loggedInUser;
        }
        const name = `${user.firstName} ${user.lastName}`;
        client.users.updateUser(user.id,{
            username: name.split(" ").join("-") + user.id.slice(-4),
        });
        const newUser = await db.user.create({
            data: {
                ClerkUserid: user.id,
                name,
                imageUrl : user.imageUrl,
                email: user.emailAddresses[0].emailAddress,
                username: name.split(" ").join("-") + user.id.slice(-4),
            },
        });
    }
    catch(error){
        console.log(error)
    }
    };
