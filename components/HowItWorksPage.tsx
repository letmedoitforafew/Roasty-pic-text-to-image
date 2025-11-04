/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { FilmIcon, FramesModeIcon, ReferencesModeIcon, TextModeIcon, XMarkIcon } from './icons';

interface HowItWorksPageProps {
  onClose: () => void;
}

const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onClose }) => {
  // Handle keydown for accessibility
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-it-works-page-title"
    >
      <div
        className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl max-w-3xl w-full flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-6 border-b border-slate-700 shrink-0">
          <h2 id="how-it-works-page-title" className="text-2xl font-bold text-white">How RoastyPit Works</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            aria-label="Close dialog"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="p-8 overflow-y-auto text-gray-300 space-y-8">
            <section>
                <h3 className="flex items-center gap-3 text-xl font-semibold text-orange-400 mb-3">
                    <TextModeIcon className="w-6 h-6" />
                    Text to Video
                </h3>
                <p className="text-slate-400">This is the simplest way to create a video. Just type a description of the scene you want to create in the prompt box. Be as descriptive as possible for the best results! The AI will interpret your text and generate a video from scratch.</p>
                <p className="mt-2 text-sm text-slate-500"><strong>Example:</strong> "A cinematic shot of a robot grilling hamburgers on Mars."</p>
            </section>
            
            <section>
                <h3 className="flex items-center gap-3 text-xl font-semibold text-orange-400 mb-3">
                    <FramesModeIcon className="w-6 h-6" />
                    Frames to Video
                </h3>
                <p className="text-slate-400">This mode gives you more control by letting you define the start and end points of your video. Upload a starting image and an optional ending image. The AI will generate the motion between them. If you only provide a start frame, you can also choose to create a seamless looping video.</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400 text-sm">
                    <li><strong>Start Frame:</strong> The first frame of your video.</li>
                    <li><strong>End Frame (Optional):</strong> The last frame of your video.</li>
                    <li><strong>Looping Video (Optional):</strong> If no end frame is provided, this creates a video that starts and ends with the start frame.</li>
                </ul>
            </section>

            <section>
                <h3 className="flex items-center gap-3 text-xl font-semibold text-orange-400 mb-3">
                    <ReferencesModeIcon className="w-6 h-6" />
                    References to Video
                </h3>
                <p className="text-slate-400">Use this mode to guide the AI with visual examples. You can upload up to three reference images to define characters, objects, or environments. Your text prompt will then direct the action using these references.</p>
                <p className="mt-2 text-sm text-slate-500"><strong>Note:</strong> This mode requires the 'veo-3.1-generate-preview' model and is fixed to 16:9 aspect ratio and 720p resolution.</p>
            </section>
            
            <section>
                <h3 className="flex items-center gap-3 text-xl font-semibold text-orange-400 mb-3">
                    <FilmIcon className="w-6 h-6" />
                    Extend Video
                </h3>
                <p className="text-slate-400">Already generated a video you love? Use this mode to add more to it! After generating a 720p video, an "Extend" button will appear. Clicking it sets up the prompt to continue the story. Just describe what happens next, and the AI will generate a seamless extension.</p>
                <p className="mt-2 text-sm text-slate-500"><strong>Note:</strong> This feature only works for videos generated at 720p resolution.</p>
            </section>
        </main>
      </div>
    </div>
  );
};

export default HowItWorksPage;
