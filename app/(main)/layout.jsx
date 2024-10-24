"use client";

import React,{ useState } from 'react';
import { BarChart, Calendar, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import LoadingBar from "react-top-loading-bar";
import { useRouter } from "next/navigation";
const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/meetings", label: "Meetings", icon: Users },
    { href: "/availability", label: "Availability", icon: Clock },
];

const AppLayout = ({ children }) => {
    const [progress, setProgress] = useState(0);
    const { isLoaded } = useUser();
    const pathname = usePathname();
    const router = useRouter();
    const handleNavigation = (url) => {
        setProgress(40); // Start the loading bar
        router.push(url); // Navigate to the new page
        setProgress(100); // Finish the loading bar
    };
    return (
        <>
            {!isLoaded && <LoadingBar
                color="#000000"
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />}
            <div className="flex flex-col h-screen bg-blue-50 md:flex-row">
                <aside className='hidden md:block w-64 bg-white'>
                    <nav>
                        <ul>
                            {navItems.map((item) => (
                                <li key={item.href} className={`flex items-center px-4 py-4 text-gray-700 hover:bg-gray-100 ${pathname == item.href ? "bg-blue-100" : " "}`} onClick={() => handleNavigation(item.href)}>
                                    {/* <Link href={item.href} className={`flex items-center px-4 py-4 text-gray-700 hover:bg-gray-100 ${pathname == item.href ? "bg-blue-100" : " "}`} >
                                        <item.icon className='w-5 h-5 mr-3' />
                                        

                                    </Link> */}
                                   
                                    <item.icon className='w-5 h-5 mr-3' />
                                    {item.label}

                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                <main className='flex-1 overflow-y-auto p-4 md:p-8'>
                    <header className='flex justify-between items-center mb-4'>
                        <h2 className='text-5xl  md:text-6xl gradient-title pt-2 md:pt-0 text-center md:text-left w-full'>
                            {navItems.find((item) => item.href == pathname).label || "Dashboard"}
                        </h2>
                    </header>
                    {children}
                </main>
                <nav className='md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md'>
                    <ul>
                        {navItems.map((item) => (
                            <li key={item.href} lassName={`flex flex-col items-center px-4 py-2 ${pathname == item.href ? "bg-blue-600" : "text-gray-600"}`} onClick={() => handleNavigation(item.href)}>
                                {/* <Link href={item.href} className={`flex flex-col items-center px-4 py-2 ${pathname == item.href ? "bg-blue-600" : "text-gray-600"}`} >
                                    <item.icon className='w-5 h-5 ' />
                                    {item.label}

                                </Link> */}
                                <item.icon className='w-5 h-5 ' />
                                {item.label}
                            </li>
                            
                        ))}
                    </ul>
                </nav>
            </div>

        </>
    )
}

export default AppLayout;

