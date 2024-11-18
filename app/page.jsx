"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, LinkIcon } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Testimonialcarousel from "@/components/Testimonial-carousel";
import LoadingBar from "react-top-loading-bar";
import { useRouter } from "next/navigation";
import { useState } from "react";
const features = [
  {
    icon: Calendar,
    title: "Create Events",
    description: "Easily set up and customize your event types",
  },
  {
    icon: Clock,
    title: "Manage Availability",
    description: "Define your availability to streamline scheduling",
  },
  {
    icon: LinkIcon,
    title: "Custom Links",
    description: "Share your personalized scheduling link",
  },
];

const howItWorks = [
  { step: "Sign Up", description: "Create your free Meetly account" },
  {
    step: "Set Availability",
    description: "Define when you're available for meetings",
  },
  {
    step: "Share Your Link",
    description: "Send your mmeting link to clients or colleagues",
  },
  {
    step: "Get Booked",
    description: "Receive confirmations for new appointments automatically",
  },
];
const Home = () => {
  const [progress, setProgress] = useState(0);
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
    <main className="container mx-auto px-4 py-16">
      <LoadingBar
        color="#3B82F6"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-24">
        <div className="lg:w-1/2">
          <h1 className="text-7xl font-extrabold pb-6 gradient-title">Simplify your meeting</h1>
          <p className="text-xl text-gray-600 mb-10">Meetly helps you manage your time effectively. Create events, set
            your availability, and let others book time with you seamlessly.</p>
          {/* <Link href="/dashboard">
            <Button size="lg" className="text-lg">Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link> */}
          <Button size="lg" className="text-lg hover:text-black hover:bg-transparent" onClick={() => handleNavigation("/dashboard")}>
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        <div className="lg:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md aspect-square mt-5">
            <Image
              src='/poster.png'
              alt="meetlyposter"
              width={500}
              height={600}
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>
      <div className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-600">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">{features.map((feature, index) => {
          return (
            <Card key={index}>
              <CardHeader>
                <feature.icon className="w-12 h-12  text-blue-500 mb-4 mx-auto" />
                <CardTitle className="text-center text-blue-600">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>

          )
        })}</div>

      </div>
      <div className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-600">
          What our users says
        </h2>
        <Testimonialcarousel />
      </div>
      <div className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-600">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorks.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">
                  {index + 1}
                </span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.step}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}

        </div>
      </div>
      <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Simplify Your Meetings?</h2>
        <p className="text-xl mb-6">Join thousands of professionals who trust Bookitnow to ease their daily meetings</p>
        {/* <Link href="/dashboard">
          <Button size="lg" variant="secondary" className="text-blue-400">Start For Free<ArrowRight className="ml-2 h-5 w-5" /></Button>
        </Link> */}
        <Button size="lg" variant="secondary" className="text-blue-600 text-lg hover:font-semibold hover:text-white hover:bg-blue-500" onClick={() => handleNavigation("/dashboard")}>
          Start For Free
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

    </main>
  );
}
export default Home;