/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import {GalleryThumbnailsIcon} from './icons';

const previewImages = [
  'https://placehold.co/150x100/1e293b/fb923c?text=Roast',
  'https://placehold.co/150x100/1e293b/f97316?text=Roast',
  'https://placehold.co/150x100/1e293b/ea580c?text=Roast',
  'https://placehold.co/150x100/1e293b/d97706?text=Roast',
];

interface GalleryPreviewProps {
  onShowGallery: () => void;
}

const GalleryPreview: React.FC<GalleryPreviewProps> = ({onShowGallery}) => {
  return (
    <div
      className="relative cursor-pointer group"
      onClick={onShowGallery}>
      <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden border-2 border-slate-700 group-hover:border-orange-500 transition-colors">
        {previewImages.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Gallery preview ${index + 1}`}
            className="w-full h-auto aspect-[3/2] object-cover"
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <GalleryThumbnailsIcon className="w-8 h-8 text-white mb-2" />
        <span className="text-white font-semibold">View Gallery</span>
      </div>
    </div>
  );
};

export default GalleryPreview;
