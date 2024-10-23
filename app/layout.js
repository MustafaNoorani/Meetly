import Header from "@/components/header";
import "./globals.css";
import {Inter} from 'next/font/google'
import { ClerkProvider } from "@clerk/nextjs";
import CreateEventDrawer  from "@/components/create-events";

export const metadata = {
  title: "Meetly",
  description: "Schedule your meeting",
  icons: {
    icon: "/favicon.ico", 
  },
};
const inter = Inter({subsets:['latin']});
export default function RootLayout({ children }) {
  return (
      <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        <Header/>

        <main className="min-h-screen bg-gradient-to-b from-blue-50 to to-white">
        {children}
        </main>
        <footer className="bg-blue-200 py-10">
          <div className="container mx-auto px-4 text-center text-gray-800">
            <p>
              Made with nextjs By Mustafa
            </p>

          </div>
        </footer>
        <CreateEventDrawer/>
      </body>
    </html>
    </ClerkProvider>
  );
}
