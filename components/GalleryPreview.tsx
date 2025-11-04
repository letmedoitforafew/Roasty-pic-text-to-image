/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { GalleryThumbnailsIcon, PlayIcon } from './icons';

const galleryVideos = [
  { id: 1, title: 'Epic Roast of a Toaster', thumbnail: 'https://placehold.co/400x225/1e293b/fb923c?text=RoastyPit' },
  { id: 2, title: 'Squirrel vs. Skyscraper', thumbnail: 'https://placehold.co/400x225/1e293b/f97316?text=RoastyPit' },
  { id: 3, title: 'A Cat\'s Dramatic Monologue', thumbnail: 'https://placehold.co/400x225/1e293b/ea580c?text=RoastyPit' },
];

interface GalleryPreviewProps {
  onViewAll: () => void;
}

const GalleryPreview: React.FC<GalleryPreviewProps> = ({ onViewAll }) => {
  return (
    <div>
      <h3 className="flex items-center gap-3 text-lg font-semibold text-white mb-4">
        <GalleryThumbnailsIcon className="w-5 h-5 text-orange-400" />
        From the Gallery
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {galleryVideos.map((video) => (
          <div
            key={video.id}
            className="group relative rounded-md overflow-hidden aspect-video cursor-pointer"
            onClick={onViewAll}>
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <PlayIcon className="w-6 h-6 text-white" />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onViewAll}
        className="text-sm text-orange-400 hover:underline mt-4">
        View Full Gallery →
      </button>
    </div>
  );
};

export default GalleryPreview;
