"use client";

import React, { useState } from 'react';
import { BarChart, Calendar, Users, Clock } from 'lucide-react';
import { usePathname } from 'next/navigation';
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
    const pathname = usePathname();
    const router = useRouter();

    const handleNavigation = async (url) => {
        setProgress(30); // Start the loading bar at 30%
        
        router.push(url); // Navigate to the new page

        // Delay the completion of the loading bar for visual feedback
        setTimeout(() => {
            setProgress(100);
        }, 500); // Adjust delay as needed
    };

    return (
        <>
            <LoadingBar
                color="#000000"
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            
            <div className="flex flex-col h-screen bg-blue-50 md:flex-row">
                <aside className='hidden md:block w-64 bg-white'>
                    <nav>
                        <ul>
                            {navItems.map((item) => (
                                <li 
                                    key={item.href} 
                                    className={`flex items-center px-4 py-4 text-gray-700 hover:bg-gray-100 ${pathname === item.href ? "bg-blue-100" : ""}`} 
                                    onClick={() => handleNavigation(item.href)}
                                >
                                    <item.icon className='w-5 h-5 mr-3' />
                                    {item.label}
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                <main className='flex-1 overflow-y-auto p-4 md:p-8'>
                    <header className='flex justify-between items-center mb-4'>
                        <h2 className='text-5xl md:text-6xl gradient-title pt-2 md:pt-0 text-center md:text-left w-full'>
                            {navItems.find((item) => item.href === pathname)?.label || "Dashboard"}
                        </h2>
                    </header>
                    {children}
                </main>
                
                <nav className='md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md'>
                    <ul className='flex justify-between'>
                        {navItems.map((item) => (
                            <li 
                                key={item.href} 
                                className={`flex flex-col items-center px-2 py-2 ${pathname === item.href ? "bg-blue-200" : "text-gray-600"}`} 
                                onClick={() => handleNavigation(item.href)}
                            >
                                <item.icon className='w-6 h-6' />
                                <span className="text-sm">{item.label}</span>
                            </li>
                        ))}
                    </ul>
                </nav> 
            </div>
        </>
    )
}

export default AppLayout;
