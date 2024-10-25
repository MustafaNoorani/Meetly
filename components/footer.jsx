'use client'; // Make sure this component is treated as a client component

import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();

  // Specify the routes where you do NOT want to display the footer
  const routesWithoutFooter = ['/dashboard', '/events', '/meetings', '/availability']; // Add your undesired routes here

  // Check if the current route is NOT in the specified routes
  const shouldRenderFooter = !routesWithoutFooter.includes(pathname);

  return shouldRenderFooter ? (
    <footer className="bg-blue-200 p-4">
      <div className="container mx-auto px-4 text-center text-gray-800">
        <p>© 2024 Made with Next.js by Mustafa</p>
      </div>
    </footer>
  ) : null; // Render nothing if on specified routes
};

export default Footer;
