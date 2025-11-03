/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Roasting your prompt to perfection...",
  "Turning up the heat...",
  "Stoking the creative flames...",
  "This might take a moment, the pit is hot today.",
  "Forging your video in the embers of AI...",
  "Don't get burned, it's almost ready.",
  "Adding extra spice...",
  "Making sure it's well-done.",
  "Consulting with the AI muse...",
  "Applying cinematic lighting...",
  "Adding a touch of movie magic...",
  "Composing the final cut...",
  "Polishing the masterpiece...",
];

const LoadingIndicator: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700 w-full max-w-lg">
      <h2 className="text-2xl font-semibold text-gray-200">Generating Your Video</h2>
      <p className="mt-2 mb-8 h-5 text-gray-400 text-center transition-opacity duration-500">
        {loadingMessages[messageIndex]}
      </p>
      <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden border border-slate-600">
        <div className="progress-bar-fill h-full rounded-full"></div>
      </div>
    </div>
  );
};

export default LoadingIndicator;