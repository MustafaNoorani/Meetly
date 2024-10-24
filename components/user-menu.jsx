"use client";
import { UserButton } from "@clerk/nextjs"
import {  ChartNoAxesGantt} from "lucide-react"

export const UserMenu = () => {
  return (
    <UserButton
       appearance={{elements:{avatarBox:"h-10 w-10"}}}
        >
          <UserButton.MenuItems>
            <UserButton.Link label="My Events" labelIcon={<ChartNoAxesGantt size={15}/>} href="/events">
            </UserButton.Link>
            <UserButton.Action label="manageAccount"/>
          </UserButton.MenuItems>
    </UserButton>
  )
}
