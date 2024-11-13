import React, { Suspense } from 'react';

const NotFoundPage = () => {
  return (
    <div className="text-3xl font-semibold place-items-center text-center pt-20 h-screen w-screen">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};

// Wrap the entire page in Suspense to handle any asynchronous operations
const SuspenseNotFoundPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <NotFoundPage />
  </Suspense>
);

export default SuspenseNotFoundPage;
