/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {Video} from '@google/genai';
import React, {useCallback, useState} from 'react';
import Footer from './components/Footer';
import {
  RoastyPitLogoIcon,
  ShareIcon,
  SlidersHorizontalIcon,
  TextModeIcon,
} from './components/icons';
import InfoDialog from './components/InfoDialog';
import LoadingIndicator from './components/LoadingIndicator';
import PromptForm from './components/PromptForm';
import VideoResult from './components/VideoResult';
import {generateVideo} from './services/geminiService';
import {
  AppState,
  GenerateVideoParams,
  GenerationMode,
  Resolution,
  VideoFile,
} from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<React.ReactNode | null>(
    null,
  );
  const [lastConfig, setLastConfig] = useState<GenerateVideoParams | null>(
    null,
  );
  const [lastVideoObject, setLastVideoObject] = useState<Video | null>(null);
  const [lastVideoBlob, setLastVideoBlob] = useState<Blob | null>(null);
  const [infoDialogContent, setInfoDialogContent] = useState<{
    title: string;
    content: React.ReactNode;
  } | null>(null);

  const [initialFormValues, setInitialFormValues] =
    useState<GenerateVideoParams | null>(null);

  const showStatusError = (message: React.ReactNode) => {
    setErrorMessage(message);
    setAppState(AppState.ERROR);
  };

  const handleGenerate = useCallback(async (params: GenerateVideoParams) => {
    setAppState(AppState.LOADING);
    setErrorMessage(null);
    setLastConfig(params);
    setInitialFormValues(null);

    try {
      const {objectUrl, blob, video} = await generateVideo(params);
      setVideoUrl(objectUrl);
      setLastVideoBlob(blob);
      setLastVideoObject(video);
      setAppState(AppState.SUCCESS);
    } catch (error) {
      console.error('Video generation failed:', error);
      let finalErrorMessage: React.ReactNode = 'An unknown error occurred.';

      if (error instanceof Error) {
        const errorMessageContent = error.message;
        if (
          errorMessageContent.includes('404') ||
          errorMessageContent
            .toLowerCase()
            .includes('requested entity was not found')
        ) {
          finalErrorMessage = (
            <>
              The provided API key appears to be invalid or lacks permissions
              for Veo.
              <p className="mt-4 text-sm text-red-400/80">
                Please ensure your API key is from a Google Cloud project with
                billing enabled. For instructions, visit the{' '}
                <a
                  href="https://ai.google.dev/gemini-api/docs/billing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline hover:text-orange-300">
                  billing documentation
                </a>
                .
              </p>
            </>
          );
        } else {
          finalErrorMessage = `Video generation failed: ${errorMessageContent}`;
        }
      }
      setErrorMessage(finalErrorMessage);
      setAppState(AppState.ERROR);
    }
  }, []);

  const handleRetry = useCallback(() => {
    if (lastConfig) {
      handleGenerate(lastConfig);
    }
  }, [lastConfig, handleGenerate]);

  const handleNewVideo = useCallback(() => {
    setAppState(AppState.IDLE);
    setVideoUrl(null);
    setErrorMessage(null);
    setLastConfig(null);
    setLastVideoObject(null);
    setLastVideoBlob(null);
    setInitialFormValues(null);
  }, []);

  const handleTryAgainFromError = useCallback(() => {
    if (lastConfig) {
      setInitialFormValues(lastConfig);
      setAppState(AppState.IDLE);
      setErrorMessage(null);
    } else {
      handleNewVideo();
    }
  }, [lastConfig, handleNewVideo]);

  const handleExtend = useCallback(async () => {
    if (lastConfig && lastVideoBlob && lastVideoObject) {
      try {
        const file = new File([lastVideoBlob], 'last_video.mp4', {
          type: lastVideoBlob.type,
        });
        const videoFile: VideoFile = {file, base64: ''};

        setInitialFormValues({
          ...lastConfig,
          mode: GenerationMode.EXTEND_VIDEO,
          prompt: '',
          inputVideo: videoFile,
          inputVideoObject: lastVideoObject,
          resolution: Resolution.P720,
          startFrame: null,
          endFrame: null,
          referenceImages: [],
          styleImage: null,
          isLooping: false,
        });

        setAppState(AppState.IDLE);
        setVideoUrl(null);
        setErrorMessage(null);
      } catch (error) {
        console.error('Failed to process video for extension:', error);
        const message =
          error instanceof Error ? error.message : 'An unknown error occurred.';
        showStatusError(`Failed to prepare video for extension: ${message}`);
      }
    }
  }, [lastConfig, lastVideoBlob, lastVideoObject]);

  const renderError = (message: React.ReactNode) => (
    <div className="text-center bg-red-900/20 border border-red-500 p-8 rounded-2xl max-w-2xl">
      <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
      <div className="text-red-300">{message}</div>
      <button
        onClick={handleTryAgainFromError}
        className="mt-6 px-6 py-2 bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors font-semibold">
        Try Again
      </button>
    </div>
  );

  const getAboutContent = () => (
    <div className="space-y-4">
      <p>
        RoastyPit is a cutting-edge AI video generation tool powered by Google's
        Veo model. Turn your text prompts into stunning, shareable videos in
        moments.
      </p>
      <p>
        Whether you're creating content for social media, marketing, or just for
        fun, RoastyPit brings your ideas to life with unparalleled speed and
        quality. This application serves as a demonstration of the power and
        versatility of the Veo video generation API.
      </p>
    </div>
  );

  const getPrivacyContent = () => (
    <div className="space-y-4 text-sm">
      <h3 className="text-lg font-semibold text-white">1. Information We Collect</h3>
      <p>This application does not collect or store any personal information, prompts, or generated videos on our own servers. All processing is handled via Google's API.</p>
      <h3 className="text-lg font-semibold text-white">2. Use of Google Services</h3>
      <p>This service uses Google's Veo API to generate videos. Your interaction with the service is subject to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">Google's Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">Terms of Service</a>.</p>
      <h3 className="text-lg font-semibold text-white">3. Advertising</h3>
      <p>This website uses Google AdSense to display ads. Google, as a third-party vendor, uses cookies to serve ads on this site. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet. Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">Ads Settings</a>.</p>
    </div>
  );

  const getTermsContent = () => (
    <div className="space-y-4 text-sm">
        <h3 className="text-lg font-semibold text-white">1. Acceptance of Terms</h3>
        <p>By using RoastyPit ("Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
        <h3 className="text-lg font-semibold text-white">2. User Conduct</h3>
        <p>You are solely responsible for the content you generate. You agree not to generate any content that is unlawful, harmful, defamatory, obscene, or infringing on intellectual property rights.</p>
        <h3 className="text-lg font-semibold text-white">3. Disclaimer of Warranties</h3>
        <p>The Service is provided "as is" and "as available" without any warranties of any kind. We do not guarantee that the service will be uninterrupted or error-free.</p>
        <h3 className="text-lg font-semibold text-white">4. Limitation of Liability</h3>
        <p>In no event shall RoastyPit or its operators be liable for any direct, indirect, incidental, or consequential damages arising out of the use or inability to use the Service.</p>
    </div>
  );

  const dialogMap = {
    about: { title: 'About RoastyPit', content: getAboutContent() },
    privacy: { title: 'Privacy Policy', content: getPrivacyContent() },
    terms: { title: 'Terms of Service', content: getTermsContent() },
  };

  const handleShowDialog = (dialog: 'about' | 'privacy' | 'terms') => {
    setInfoDialogContent(dialogMap[dialog]);
  }

  return (
    <div className="h-screen text-gray-200 flex flex-col overflow-hidden">
      {infoDialogContent && (
        <InfoDialog title={infoDialogContent.title} onClose={() => setInfoDialogContent(null)}>
          {infoDialogContent.content}
        </InfoDialog>
      )}

      <header className="py-4 px-8 relative z-10 shrink-0 flex justify-center items-center">
        <div className="flex items-center gap-4">
          <RoastyPitLogoIcon className="w-14 h-14 text-orange-400 logo-glow-animation" />
          <h1 className="text-5xl font-bold tracking-tight text-center bg-gradient-to-r from-amber-300 via-orange-500 to-red-600 bg-clip-text text-transparent">
            RoastyPit
          </h1>
        </div>
      </header>

      <div className="w-full max-w-7xl mx-auto flex-grow flex flex-col justify-center items-center p-4 overflow-hidden">
        <main className="w-full flex-grow flex flex-col justify-center items-center">
          {appState === AppState.IDLE ? (
            <div className="w-full h-full flex flex-col items-center pt-8 overflow-y-auto">
              <div className="text-center mb-8 max-w-3xl mx-auto px-4">
                <h2 className="text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-amber-200 to-orange-400 bg-clip-text text-transparent mb-4">
                  Generate Viral Video Roasts
                </h2>
                <p className="text-lg text-slate-400">
                  Turn any idea into a viral masterpiece. Just describe your
                  scene, and let our AI do the rest.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto px-4">
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/80 transform hover:scale-105 hover:border-orange-500/80 transition-all duration-300">
                  <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-full bg-orange-900/50 mx-auto text-orange-400">
                    <TextModeIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    1. Write Your Roast
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Describe the scene. Be specific, be witty, be savage. The AI
                    loves detail.
                  </p>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/80 transform hover:scale-105 hover:border-orange-500/80 transition-all duration-300">
                  <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-full bg-orange-900/50 mx-auto text-orange-400">
                    <SlidersHorizontalIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    2. Adjust the Settings
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Choose your format, quality, and generation mode for the
                    perfect burn.
                  </p>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/80 transform hover:scale-105 hover:border-orange-500/80 transition-all duration-300">
                  <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-full bg-orange-900/50 mx-auto text-orange-400">
                    <ShareIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    3. Go Viral
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Generate your video, download it, and share your glorious
                    roast with the world.
                  </p>
                </div>
              </div>

              <div className="w-full max-w-3xl mx-auto mt-auto px-4 pb-4">
                <div className="text-center text-xs text-slate-500 mb-4 px-4">
                  Our AI is trained for comedy, not cruelty. Please keep prompts
                  light-hearted and fun. Let's create roasts, not riots!
                </div>
                <PromptForm
                  onGenerate={handleGenerate}
                  initialValues={initialFormValues}
                />
              </div>
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center">
              {appState === AppState.LOADING && <LoadingIndicator />}
              {appState === AppState.SUCCESS && videoUrl && (
                <VideoResult
                  videoUrl={videoUrl}
                  videoBlob={lastVideoBlob}
                  onRetry={handleRetry}
                  onNewVideo={handleNewVideo}
                  onExtend={handleExtend}
                  canExtend={lastConfig?.resolution === Resolution.P720}
                />
              )}
              {appState === AppState.SUCCESS &&
                !videoUrl &&
                renderError(
                  'Video generated, but URL is missing. Please try again.',
                )}
              {appState === AppState.ERROR &&
                errorMessage &&
                renderError(errorMessage)}
            </div>
          )}
        </main>
      </div>
      <Footer onShowDialog={handleShowDialog} />
    </div>
  );
};

export default App;
