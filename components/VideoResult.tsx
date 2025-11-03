/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import {
  ArrowPathIcon,
  DownloadIcon,
  PlusIcon,
  RoastyPitLogoIcon,
  ShareIcon,
  SparklesIcon,
} from './icons';

interface VideoResultProps {
  videoUrl: string;
  videoBlob: Blob | null;
  onRetry: () => void;
  onNewVideo: () => void;
  onExtend: () => void;
  canExtend: boolean;
}

const VideoResult: React.FC<VideoResultProps> = ({
  videoUrl,
  videoBlob,
  onRetry,
  onNewVideo,
  onExtend,
  canExtend,
}) => {
  const [copyStatus, setCopyStatus] = useState('Share');

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = 'roastypit_video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus('Share'), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setCopyStatus('Failed');
      setTimeout(() => setCopyStatus('Share'), 2000);
    }
  };


  return (
    <div className="w-full flex flex-col items-center gap-8 p-8 bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700 shadow-2xl">
      <h2 className="text-2xl font-bold text-gray-200">
        Your Creation is Ready!
      </h2>
      <div className="relative w-full max-w-2xl aspect-video rounded-lg overflow-hidden bg-black shadow-lg group">
        <video
          src={videoUrl}
          controls
          autoPlay
          loop
          className="w-full h-full object-contain"
        />
        <div className="absolute bottom-2 right-2 flex items-center gap-2 bg-black/60 text-white py-1 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-xs">
          <RoastyPitLogoIcon className="w-5 h-5" />
          <span className="font-semibold">Made with RoastyPit</span>
        </div>
      </div>


      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
          <DownloadIcon className="w-5 h-5" />
          Download
        </button>
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors w-32">
          <ShareIcon className="w-5 h-5" />
          {copyStatus}
        </button>
        {canExtend && (
          <button
            onClick={onExtend}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors">
            <SparklesIcon className="w-5 h-5" />
            Extend
          </button>
        )}
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors">
          <ArrowPathIcon className="w-5 h-5" />
          Retry
        </button>
        <button
          onClick={onNewVideo}
          className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors">
          <PlusIcon className="w-5 h-5" />
          New Video
        </button>
      </div>
    </div>
  );
};

export default VideoResult;
