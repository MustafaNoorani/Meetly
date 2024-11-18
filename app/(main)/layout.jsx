"use client";

import React, { useState, Suspense } from "react";
import { BarChart, Calendar, Users, Clock } from "lucide-react";
import LoadingBar from "react-top-loading-bar";
import { useRouter, usePathname } from "next/navigation";

// Define the navigation items with labels and icons
const navItems = [
    { 
        href: "/dashboard", 
        label: "Dashboard", 
        icon: BarChart,
        description: "Overview of your activities" 
    },
    { 
        href: "/events", 
        label: "Events", 
        icon: Calendar,
        description: "Manage your upcoming events" 
    },
    { 
        href: "/meetings", 
        label: "Meetings", 
        icon: Users,
        description: "Schedule and track meetings" 
    },
    { 
        href: "/availability", 
        label: "Availability", 
        icon: Clock,
        description: "Set your availability preferences" 
    },
];

const AppLayout = ({ children }) => {
    const [progress, setProgress] = useState(0);
    const pathname = usePathname();
    const router = useRouter();

    const handleNavigation = async (url) => {
        setProgress(30); // Start the loading bar at 30%

        // Use Next.js router for page navigation
        router.push(url);

        // Simulate loading bar completion with a delay for visual feedback
        setTimeout(() => {
            setProgress(100);
        }, 500); // Adjust delay as needed
    };
    const getCurrentPageTitle = () => {
        const currentPage = navItems.find((item) => 
            pathname.startsWith(item.href)
        );
        return currentPage ? currentPage.label : "Dashboard";
    };

    return (
        <>
            {/* Loading bar at the top of the page */}
            <LoadingBar
                color="#3B82F6"
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />

            <div className="flex flex-col h-screen bg-blue-100 md:flex-row">
                {/* Sidebar for navigation */}
                <aside className="hidden md:block w-64 bg-white shadow-md">
                    <div className="p-4">
                        <nav>
                            <ul className="space-y-2">
                                {navItems.map((item) => (
                                    <li
                                        key={item.href}
                                        className={`
                                        flex items-center 
                                        px-4 py-3 
                                        rounded-lg 
                                        cursor-pointer 
                                        transition-all 
                                        duration-200
                                        ${pathname === item.href
                                                ? "bg-blue-100 text-blue-600"
                                                : "hover:bg-gray-100"
                                            }
                                    `}
                                        onClick={() => handleNavigation(item.href)}
                                    >
                                        <item.icon className="w-5 h-5 mr-3" />
                                        <div>
                                            <p className="font-medium">{item.label}</p>
                                            <p className="text-xs text-gray-500">
                                                {item.description}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </aside>

                {/* Main content area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-white">
                    {/* Page Header */}
                    <header className="mb-6">
                        <h2 className="text-4xl md:text-5xl font-bold text-blue-500">
                            <React.Suspense fallback={null}>
                            {getCurrentPageTitle()}
                            </React.Suspense>
                        </h2>
                    </header>

                    {/* Enhanced Suspense Handling */}
                    <React.Suspense 
                        fallback={
                            <div className="flex justify-center items-center h-full">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
                            </div>
                        }
                    >
                       
                        {children}
                    </React.Suspense>
                </main>

                {/* Mobile navigation bar */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md">
                    <ul className="flex justify-around py-2">
                        {navItems.map((item) => (
                            <li
                                key={item.href}
                                className={`
                                    flex flex-col 
                                    items-center 
                                    p-2 
                                    rounded-lg
                                    ${pathname === item.href 
                                        ? "text-blue-600" 
                                        : "text-gray-500"
                                    }
                                `}
                                onClick={() => handleNavigation(item.href)}
                            >
                                <item.icon className="w-6 h-6" />
                                <span className="text-xs mt-1">{item.label}</span>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default AppLayout;
