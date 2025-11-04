/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Baseline,
  ChevronDown,
  Download,
  Film,
  GalleryThumbnails,
  Image,
  KeyRound,
  Layers,
  Menu,
  Newspaper,
  Play,
  Plus,
  RefreshCw,
  Send,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Tv,
  X,
} from 'lucide-react';

const defaultProps = {
  strokeWidth: 1.5,
};

export const KeyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <KeyRound {...defaultProps} {...props} />
);

export const ArrowPathIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <RefreshCw {...defaultProps} {...props} />;

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Sparkles {...defaultProps} {...props} />
);

export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Plus {...defaultProps} {...props} />
);

export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <ChevronDown {...defaultProps} {...props} />;

export const SlidersHorizontalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <SlidersHorizontal {...defaultProps} {...props} />;

export const ArrowRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <ArrowRight {...defaultProps} {...props} />;

export const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <ArrowLeft {...defaultProps} {...props} />;

export const RectangleStackIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <Layers {...defaultProps} {...props} />;

export const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <X {...defaultProps} {...props} />
);

export const TextModeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Baseline {...defaultProps} {...props} />
);

export const FramesModeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <Image {...defaultProps} {...props} />;

export const ReferencesModeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <Film {...defaultProps} {...props} />;

export const TvIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Tv {...defaultProps} {...props} />
);

export const FilmIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Film {...defaultProps} {...props} />
);

// This icon had a different stroke width in the original file, so we preserve it.
export const CurvedArrowDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <ArrowDown {...props} strokeWidth={3} />;

export const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <Download {...defaultProps} {...props} />;

export const ShareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Share2 {...defaultProps} {...props} />
);

export const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Send {...defaultProps} {...props} />
);

export const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Play {...defaultProps} {...props} />
);

export const NewspaperIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <Newspaper {...defaultProps} {...props} />;

export const GalleryThumbnailsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => <GalleryThumbnails {...defaultProps} {...props} />;

export const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Menu {...defaultProps} {...props} />
);

export const RoastyPitLogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" fill="none" />
    <path
      fill="currentColor"
      stroke="none"
      transform="scale(0.65) translate(6, 4)"
      d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
    />
  </svg>
);
