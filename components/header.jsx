import Link from "next/link"
import Image from "next/image"
import { Button } from "./ui/button"
import { PenBox } from "lucide-react"
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { UserMenu } from "./user-menu"
import { CheckUser } from "@/lib/checkuser"

const Header = async () => {
  await CheckUser();
  return (
    <nav className="mx-auto py-2 px-4 flex justify-between items-center shadow-md border-b-2 bg-white">
      <Link href={"/"} className="flex items-center">
        <Image src='/logo.png'
          width="150"
          height="70"
          alt="meetlylogo"
          className="h-16 w-auto ml-3"
        />
      </Link>
      <div className="flex items-center gap-4">
        <Link href={"/events?create=true"} >
          <Button className="flex items-center gap-2">
            <PenBox size={18} />Create Event</Button>
        </Link>
        <div> 
        <SignedOut className="justify-center">
          <SignInButton fallbackRedirectUrl="/dashboard">
            <Button variant="outline">Login</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserMenu/>
        </SignedIn>
        </div>
      </div>
    </nav >
  )
}

export default Header