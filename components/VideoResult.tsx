/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import {
  ArrowPathIcon,
  DownloadIcon,
  PlusIcon,
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
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = 'roastypit_video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full flex flex-col items-center gap-8 p-8 bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700 shadow-2xl">
      <h2 className="text-2xl font-bold text-gray-200">
        Your Creation is Ready!
      </h2>
      <div className="w-full max-w-2xl aspect-video rounded-lg overflow-hidden bg-black shadow-lg">
        <video
          src={videoUrl}
          controls
          autoPlay
          loop
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
          <DownloadIcon className="w-5 h-5" />
          Download
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