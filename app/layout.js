import Header from "@/components/header";
import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import CreateEventDrawer from "@/components/create-events";
import Footer from "@/components/footer";
export const metadata = {
  title: "Meetly",
  description: "Schedule your meeting",
  icons: {
    icon: "/favicon.ico",
  },
};
const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </head>
        <body className={inter.className}>
          <Header />
          <div className="flex flex-col h-screen">
          <main className="flex-grow bg-gradient-to-b from-blue-50 to-white pb-16">
            {children}
          </main>
          {/* <footer className="hidden md:block bg-blue-200 p-4">
            <div className="container mx-auto px-4 text-center text-gray-800">
              <p>© 2024 Made with nextjs By Mustafa</p>
            </div>
          </footer> */}
          <Footer/>
          </div>
          <CreateEventDrawer />
        </body>
      </html>
    </ClerkProvider>
  );
}
