"use client";


import Image from "next/image";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { UserMenu } from "./user-menu";
import LoadingBar from "react-top-loading-bar";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Header = () => {
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const handleNavigation = (url) => {
    setProgress(30); // Start the loading bar
    router.push(url); // Navigate to the new page

    // Delay to simulate load time and finish the bar
    setTimeout(() => {
      setProgress(100);
    }, 500); // Adjust delay for visual effect
  };

  return (
    <>
      <LoadingBar
        color="#3B82F6"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <nav className="mx-auto py-2 px-4 flex justify-between items-center shadow-md border-b-2 bg-white">
        <div onClick={() => handleNavigation("/")} className="flex cursor-pointer">
          <Image src="/logo.png" width="150" height="70" alt="meetlylogo" className="h-16 w-auto" />
        </div>
        <div className="flex items-center gap-4">
          <Button className="flex items-center gap-2 text-lg hover:text-black hover:bg-white hover:rounded-md hover:shadow-md" onClick={() => handleNavigation("/events?create=true")}>
            <PenBox size={18} /> Create Event
          </Button>
          <div>
            <SignedOut>
              <SignInButton fallbackRedirectUrl="/dashboard">
                <Button variant="outline">Login</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserMenu />
            </SignedIn>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
