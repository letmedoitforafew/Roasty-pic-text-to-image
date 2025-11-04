/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { FilmIcon, FramesModeIcon, ReferencesModeIcon, TextModeIcon } from './icons';

const HowItWorksPage: React.FC = () => {
  return (
    <main className="w-full max-w-3xl mx-auto flex-grow p-8">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl w-full flex flex-col">
            <header className="p-6 border-b border-slate-700 shrink-0 text-center">
                <h2 className="text-2xl font-bold text-white">How RoastyPit Works</h2>
            </header>
            <div className="p-8 text-gray-300 space-y-8">
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
            </div>
        </div>
    </main>
  );
};

export default HowItWorksPage;