/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {Video} from '@google/genai';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  AspectRatio,
  GenerateVideoParams,
  GenerationMode,
  ImageFile,
  Resolution,
  VeoModel,
} from '../types';
import {
  ArrowRightIcon,
  ChevronDownIcon,
  FilmIcon,
  FlameIcon,
  FramesModeIcon,
  MegaphoneIcon,
  PlusIcon,
  RectangleStackIcon,
  ReferencesModeIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  TextModeIcon,
  TvIcon,
  XMarkIcon,
} from './icons';

const aspectRatioDisplayNames: Record<AspectRatio, string> = {
  [AspectRatio.LANDSCAPE]: 'Landscape (16:9)',
  [AspectRatio.PORTRAIT]: 'Portrait (9:16)',
};

const modeIcons: Record<GenerationMode, React.ReactNode> = {
  [GenerationMode.TEXT_TO_VIDEO]: <TextModeIcon className="w-5 h-5" />,
  [GenerationMode.FRAMES_TO_VIDEO]: <FramesModeIcon className="w-5 h-5" />,
  [GenerationMode.REFERENCES_TO_VIDEO]: (
    <ReferencesModeIcon className="w-5 h-5" />
  ),
  [GenerationMode.EXTEND_VIDEO]: <FilmIcon className="w-5 h-5" />,
};

const fileToBase64 = <T extends {file: File; base64: string}>(
  file: File,
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      if (base64) {
        resolve({file, base64} as T);
      } else {
        reject(new Error('Failed to read file as base64.'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
const fileToImageFile = (file: File): Promise<ImageFile> =>
  fileToBase64<ImageFile>(file);

const CustomSelect: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  icon: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
}> = ({label, value, onChange, icon, children, disabled = false}) => (
  <div>
    <label
      className={`text-xs block mb-1.5 font-medium ${
        disabled ? 'text-gray-500' : 'text-gray-400'
      }`}>
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        {icon}
      </div>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-8 py-2.5 appearance-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-slate-700/50 disabled:border-slate-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors">
        {children}
      </select>
      <ChevronDownIcon
        className={`w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
          disabled ? 'text-slate-600' : 'text-slate-400'
        }`}
      />
    </div>
  </div>
);

const ImageUpload: React.FC<{
  onSelect: (image: ImageFile) => void;
  onRemove?: () => void;
  image?: ImageFile | null;
  label: React.ReactNode;
}> = ({onSelect, onRemove, image, label}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageFile = await fileToImageFile(file);
        onSelect(imageFile);
      } catch (error) {
        console.error('Error converting file:', error);
      }
    }
    // Reset input value to allow selecting the same file again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="flex-1">
      <label className="text-xs block mb-1.5 font-medium text-gray-400">
        {label}
      </label>
      <div className="w-full aspect-video bg-slate-800 border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center relative">
        {image ? (
          <>
            <img
              src={`data:image/png;base64,${image.base64}`}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            {onRemove && (
              <button
                onClick={onRemove}
                className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/80 text-white rounded-full">
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </>
        ) : (
          <div className="text-center text-slate-500">
            <PlusIcon className="w-8 h-8 mx-auto" />
            <span className="text-sm mt-1">Upload Image</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};

const instructionBoxes = [
  {
    icon: <SparklesIcon className="w-6 h-6 text-orange-400" />,
    title: 'Describe a Scene',
    description: 'Generate a video from text.',
    prompt: 'A cinematic shot of a robot grilling hamburgers on Mars.',
  },
  {
    icon: <FlameIcon className="w-6 h-6 text-orange-400" />,
    title: 'Roast a Friend',
    description: 'Create a funny roast video.',
    prompt: 'Roast my friend for thinking he can sing after one karaoke night.',
  },
  {
    icon: <MegaphoneIcon className="w-6 h-6 text-orange-400" />,
    title: 'Make a Meme',
    description: 'Create a funny, meme-style video.',
    prompt:
      "A dramatic movie trailer for a video about a cat who is slightly annoyed.",
  },
];

interface PromptFormProps {
  onGenerate: (params: GenerateVideoParams) => void;
  initialValues?: Partial<GenerateVideoParams> | null;
}

const PromptForm: React.FC<PromptFormProps> = ({
  onGenerate,
  initialValues,
}) => {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState<VeoModel>(VeoModel.VEO_FAST);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(
    AspectRatio.LANDSCAPE,
  );
  const [resolution, setResolution] = useState<Resolution>(Resolution.P720);
  const [mode, setMode] = useState<GenerationMode>(GenerationMode.TEXT_TO_VIDEO);
  const [startFrame, setStartFrame] = useState<ImageFile | null>(null);
  const [endFrame, setEndFrame] = useState<ImageFile | null>(null);
  const [referenceImages, setReferenceImages] = useState<ImageFile[]>([]);
  const [styleImage, setStyleImage] = useState<ImageFile | null>(null);
  const [isLooping, setIsLooping] = useState(false);
  const [inputVideoObject, setInputVideoObject] = useState<Video | null>(null);

  useEffect(() => {
    if (initialValues) {
      setPrompt(initialValues.prompt ?? '');
      setModel(initialValues.model ?? VeoModel.VEO_FAST);
      setAspectRatio(initialValues.aspectRatio ?? AspectRatio.LANDSCAPE);
      setResolution(initialValues.resolution ?? Resolution.P720);
      setMode(initialValues.mode ?? GenerationMode.TEXT_TO_VIDEO);
      setStartFrame(initialValues.startFrame ?? null);
      setEndFrame(initialValues.endFrame ?? null);
      setReferenceImages(initialValues.referenceImages ?? []);
      setStyleImage(initialValues.styleImage ?? null);
      setIsLooping(initialValues.isLooping ?? false);
      setInputVideoObject(initialValues.inputVideoObject ?? null);
    }
  }, [initialValues]);

  const handleInstructionClick = (promptText: string) => {
    setPrompt(promptText);
  };

  const isExtendMode = mode === GenerationMode.EXTEND_VIDEO;
  const isReferencesMode = mode === GenerationMode.REFERENCES_TO_VIDEO;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt && !startFrame && referenceImages.length === 0) {
      alert('Please enter a prompt or provide an image to get started.');
      return;
    }
    onGenerate({
      prompt,
      model: isReferencesMode ? VeoModel.VEO : model, // Force VEO for references mode
      aspectRatio,
      resolution: isReferencesMode ? Resolution.P720 : resolution, // Force 720p for references
      mode,
      startFrame,
      endFrame,
      referenceImages,
      styleImage,
      isLooping,
      inputVideoObject,
    });
  };

  return (
    <div className="w-full p-6 bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700 shadow-2xl">
      <div className="w-full mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {instructionBoxes.map((box, index) => (
            <button
                key={index}
                onClick={() => handleInstructionClick(box.prompt)}
                className="flex flex-col items-center text-center p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-orange-500 rounded-lg transition-all duration-200 transform hover:-translate-y-1"
            >
                {box.icon}
                <h4 className="font-semibold mt-2 text-sm text-slate-200">{box.title}</h4>
                <p className="text-xs text-slate-400">{box.description}</p>
            </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            isExtendMode
              ? 'Describe what should happen next...'
              : 'Roast me for...'
          }
          rows={3}
          className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder-slate-500"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CustomSelect
            label="Generation Mode"
            value={mode}
            onChange={(e) => setMode(e.target.value as GenerationMode)}
            icon={modeIcons[mode]}
            disabled={inputVideoObject != null}>
            {Object.values(GenerationMode).map((m) => (
              <option key={m} value={m} disabled={m === GenerationMode.EXTEND_VIDEO && inputVideoObject === null}>
                {m}
              </option>
            ))}
          </CustomSelect>
          <CustomSelect
            label="Model"
            value={isReferencesMode ? VeoModel.VEO : model}
            onChange={(e) => setModel(e.target.value as VeoModel)}
            icon={<TvIcon className="w-5 h-5" />}
            disabled={isExtendMode || isReferencesMode}>
            {Object.values(VeoModel).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </CustomSelect>
          <CustomSelect
            label="Aspect Ratio"
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
            icon={<RectangleStackIcon className="w-5 h-5" />}
            disabled={isExtendMode || isReferencesMode}>
            {Object.values(AspectRatio).map((ar) => (
              <option key={ar} value={ar}>
                {aspectRatioDisplayNames[ar]}
              </option>
            ))}
          </CustomSelect>
          <CustomSelect
            label="Resolution"
            value={isReferencesMode ? Resolution.P720 : resolution}
            onChange={(e) => setResolution(e.target.value as Resolution)}
            icon={<SlidersHorizontalIcon className="w-5 h-5" />}
            disabled={isExtendMode || isReferencesMode}>
            <option value={Resolution.P720}>720p</option>
            <option value={Resolution.P1080}>1080p</option>
          </CustomSelect>
        </div>

        {mode === GenerationMode.FRAMES_TO_VIDEO && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <ImageUpload
                label="Start Frame"
                image={startFrame}
                onSelect={setStartFrame}
                onRemove={() => setStartFrame(null)}
              />
              <ImageUpload
                label="End Frame (Optional)"
                image={endFrame}
                onSelect={setEndFrame}
                onRemove={() => setEndFrame(null)}
              />
            </div>
            {!endFrame && startFrame && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="looping"
                  checked={isLooping}
                  onChange={(e) => setIsLooping(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-500 bg-slate-700 border-slate-600 focus:ring-orange-600"
                />
                <label htmlFor="looping" className="text-sm text-gray-300">
                  Create a looping video
                </label>
              </div>
            )}
          </div>
        )}

        {isReferencesMode && (
          <p className="text-xs text-center text-slate-400 bg-slate-700/50 p-2 rounded-md">
            References mode requires the <strong>{VeoModel.VEO}</strong> model and is fixed to <strong>720p Landscape</strong>.
          </p>
        )}

        <div className="text-right">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors">
            {isExtendMode ? 'Extend Video' : 'Generate'}
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromptForm;