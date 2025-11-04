/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {Video} from '@google/genai';
import React, {useCallback, useEffect, useState} from 'react';
import ArticlePage from './components/ArticlePage';
import BlogPage from './components/BlogPage';
import ContactPage from './components/ContactPage';
import Footer from './components/Footer';
import GalleryPage from './components/GalleryPage';
import Header from './components/Header';
import {
  ArrowRightIcon,
  SlidersHorizontalIcon,
  TextModeIcon,
} from './components/icons';
import HowItWorksPage from './components/HowItWorksPage';
import InfoPage from './components/InfoDialog';
import LoadingIndicator from './components/LoadingIndicator';
import PromptForm from './components/PromptForm';
import VideoResult from './components/VideoResult';
import {generateVideo} from './services/geminiService';
import {
  AppState,
  ArticleSlug,
  GenerateVideoParams,
  GenerationMode,
  Resolution,
} from './types';

// Helper to get route from hash
const getRoute = () => window.location.hash.substring(1) || 'home';

const App: React.FC = () => {
  // App State
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
  const [initialFormValues, setInitialFormValues] =
    useState<GenerateVideoParams | null>(null);

  // Routing State
  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNewVideo = useCallback(() => {
    setAppState(AppState.IDLE);
    setVideoUrl(null);
    setErrorMessage(null);
    setLastConfig(null);
    setLastVideoObject(null);
    setLastVideoBlob(null);
    setInitialFormValues(null);
    window.location.hash = '#home';
  }, []);

  // --- Article and Page Content ---
  const articlesData: Record<
    ArticleSlug,
    {title: string; content: React.ReactNode}
  > = {
    'art-of-the-roast': {
      title: '🥊 The Art of the Roast: How RoastyPit Turns Words Into Comedy Gold',
      content: (
        <div className="space-y-6">
          <p>
            For years, roasting has been a cornerstone of comedy — a way to poke
            fun, share laughter, and show confidence through clever remarks. From
            celebrity roast specials to friendly jokes between friends, the art
            of roasting has always been about timing, creativity, and charm.
          </p>
          <p>
            Now, with the rise of artificial intelligence, that art form has
            evolved. Thanks to <strong>RoastyPit</strong>, a next-generation{' '}
            <em>text-to-video generator</em>, anyone can create a personalized
            roast video in seconds.
          </p>
          <img
            src="https://placehold.co/600x250/1e293b/fb923c?text=AI-generated+roast+video"
            alt="AI-generated roast video example"
            className="w-full rounded-lg"
          />
          <h3 className="text-2xl font-bold text-orange-400 pt-4">
            What Exactly Is a Roast?
          </h3>
          <p>
            A roast is a lighthearted joke directed at someone in a fun, friendly
            way. The goal isn’t to offend but to entertain. RoastyPit captures
            that energy and turns it into digital entertainment.
          </p>

          <h3 className="text-2xl font-bold text-orange-400 pt-4">
            From Text to Laughter: How RoastyPit Works
          </h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              <strong>Enter your text prompt:</strong> For example, “Roast me for
              sleeping through my alarm again.”
            </li>
            <li>
              <strong>Choose your style:</strong> Sarcastic, playful, dramatic,
              or celebrity-inspired.
            </li>
            <li>
              <strong>Watch the magic happen:</strong> The AI creates a short,
              funny video you can share instantly.
            </li>
          </ol>

          <h3 className="text-2xl font-bold text-orange-400 pt-4">
            Why AI Comedy Works So Well
          </h3>
          <ul className="list-disc list-inside space-y-2">
            <li>It’s personal: Each roast is unique to your input.</li>
            <li>It’s accessible: No video skills required.</li>
            <li>
              It’s fast: Your words become a polished video in under a minute.
            </li>
            <li>
              It’s entertaining: The videos combine humor, expression, and
              energy.
            </li>
          </ul>
        </div>
      ),
    },
    'hilarious-prompts': {
      title:
        '💡 How to Write Hilarious AI Prompts: The Secret to Viral RoastyPit Videos',
      content: (
        <div className="space-y-6">
          <p>
            When using RoastyPit, your text prompt is your ticket to viral
            comedy. The right words can transform a simple idea into a hilarious
            AI-generated video that entertains your audience instantly.
          </p>
          <img
            src="https://placehold.co/600x250/1e293b/f97316?text=Example+of+a+great+prompt"
            alt="Example of AI prompt for RoastyPit video"
            className="w-full rounded-lg"
          />

          <h3 className="text-2xl font-bold text-orange-400 pt-4">
            What Makes a Prompt “Hilarious”?
          </h3>
          <p>
            A good prompt has three key ingredients: a clear setup, an
            exaggeration or twist, and relatability.
          </p>

          <h3 className="text-2xl font-bold text-orange-400 pt-4">
            Tip 1: Start with a Situation
          </h3>
          <p>
            Provide context for your prompt. Example: “Roast me for thinking I
            could fix my car after one YouTube tutorial.”
          </p>
        </div>
      ),
    },
    'top-5-viral': {
      title: '📹 Top 5 Viral Videos Made with RoastyPit',
      content: (
        <div className="space-y-6">
          <p>
            RoastyPit transforms simple text prompts into hilarious AI-generated
            videos. Here are the top 5 viral trends you can try yourself.
          </p>
          <img
            src="https://placehold.co/600x250/1e293b/ea580c?text=Collage+of+Viral+Videos"
            alt="Collage of viral RoastyPit videos"
            className="w-full rounded-lg"
          />

          <h3 className="text-2xl font-bold text-orange-400 pt-4">
            1. Roast Me for My Gym Routine
          </h3>
          <p>
            Example: “Roast me for going to the gym once and calling myself a
            fitness influencer.” Perfect for relatable humor.
          </p>
        </div>
      ),
    },
    'ai-in-comedy': {
      title: '🤖 AI in Comedy: The Future of Funny',
      content: (
        <div className="space-y-6">
          <p>
            Comedy is deeply human, but AI is learning to replicate humor in
            creative ways. RoastyPit transforms text into funny, shareable videos
            with realistic expressions, timing, and tone.
          </p>
          <img
            src="https://placehold.co/600x250/1e293b/d97706?text=AI+Comedy+Example"
            alt="AI-generated comedy video example"
            className="w-full rounded-lg"
          />

          <h3 className="text-2xl font-bold text-orange-400 pt-4">
            How AI Learned to Laugh
          </h3>
          <p>
            RoastyPit uses natural language processing to understand context,
            tone, and humor style. It converts your prompt into an AI-generated
            video with proper comedic timing.
          </p>
        </div>
      ),
    },
    'behind-the-scenes': {
      title: '🎬 Behind the Scenes: How RoastyPit Works',
      content: (
        <div className="space-y-6">
          <p>
            RoastyPit is more than a fun app — it’s a sophisticated AI platform
            that converts text into short, entertaining videos. This article
            explores the technology and process behind the laughs.
          </p>
          <img
            src="https://placehold.co/600x250/1e293b/b45309?text=Behind+the+Scenes"
            alt="RoastyPit AI video creation process"
            className="w-full rounded-lg"
          />
          <h3 className="text-2xl font-bold text-orange-400 pt-4">
            Step 1: Input Your Text Prompt
          </h3>
          <p>
            Your video starts with a prompt: short, funny, and clear. Example:
            “Roast me like I forgot my homework again.”
          </p>
        </div>
      ),
    },
  };

  const infoPagesData = {
    about: {
      title: 'About RoastyPit',
      content: (
        <p>
          RoastyPit is a cutting-edge text-to-video generator powered by Google's
          Veo model. Our mission is to make video creation fun, fast, and
          accessible to everyone.
        </p>
      ),
    },
    privacy: {
      title: 'Privacy Policy',
      content: (
        <p>
          Your privacy is important to us. We do not store your prompts or
          generated videos. All processing is done in memory.
        </p>
      ),
    },
    terms: {
      title: 'Terms of Service',
      content: (
        <p>
          By using RoastyPit, you agree not to generate content that is harmful,
          offensive, or violates any laws.
        </p>
      ),
    },
  };

  const handleSubmit = async (params: GenerateVideoParams) => {
    setAppState(AppState.LOADING);
    setErrorMessage(null);
    setLastConfig(params);

    try {
      const result = await generateVideo(params);
      setVideoUrl(result.objectUrl);
      setLastVideoBlob(result.blob);
      setLastVideoObject(result.video);
      setAppState(AppState.SUCCESS);
    } catch (e) {
      console.error(e);
      const error = e as Error;
      let displayError: React.ReactNode = `Video generation failed: ${error.message}`;
      if (error.message.includes('billing')) {
        displayError = (
          <>
            Video generation failed. The provided API key may be invalid or not
            have billing enabled. Please ensure your key is correct.
          </>
        );
      }
      setErrorMessage(displayError);
      setAppState(AppState.ERROR);
    }
  };

  const handleTryAgain = () => {
    if (lastConfig) {
      setInitialFormValues(lastConfig);
      setAppState(AppState.IDLE);
      setErrorMessage(null);
    }
  };

  const handleExtend = () => {
    if (lastVideoObject && lastConfig) {
      const extendParams: GenerateVideoParams = {
        ...lastConfig,
        prompt: '',
        mode: GenerationMode.EXTEND_VIDEO,
        inputVideoObject: lastVideoObject,
        resolution: Resolution.P720,
      };
      setInitialFormValues(extendParams);
      setAppState(AppState.IDLE);
    }
  };

  const renderHomePage = () => {
    switch (appState) {
      case AppState.LOADING:
        return <LoadingIndicator />;
      case AppState.SUCCESS:
        return (
          videoUrl && (
            <VideoResult
              videoUrl={videoUrl}
              videoBlob={lastVideoBlob}
              onRetry={handleTryAgain}
              onNewVideo={handleNewVideo}
              onExtend={handleExtend}
              canExtend={lastConfig?.resolution === Resolution.P720}
            />
          )
        );
      case AppState.ERROR:
        return (
          <div className="text-center p-8 bg-red-900/30 rounded-lg">
            <h2 className="text-2xl font-bold text-red-400">
              Something Went Wrong
            </h2>
            <p className="text-red-300 mt-2">{errorMessage}</p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={handleTryAgain}
                className="px-6 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg font-semibold">
                Try Again
              </button>
              <button
                onClick={handleNewVideo}
                className="px-6 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg font-semibold">
                Start Over
              </button>
            </div>
          </div>
        );
      case AppState.IDLE:
      default:
        return (
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
              Generate Viral Video Roasts
            </h2>
            <p className="text-lg text-slate-400 mb-10 max-w-2xl">
              Turn any idea into a hilarious, shareable video in seconds. Just
              type a prompt and let our AI do the roasting.
            </p>
            <div className="w-full max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div
                className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/80
                flex flex-col items-center text-center gap-2 transition-all duration-300
                hover:scale-105 hover:drop-shadow-[0_0_8px_#f97316]">
                <div className="text-orange-400">
                  <TextModeIcon className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-white">1. Type a Prompt</h3>
                <p className="text-xs text-slate-400">
                  Describe the roast you want to create.
                </p>
              </div>
              <div
                className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/80
                flex flex-col items-center text-center gap-2 transition-all duration-300
                hover:scale-105 hover:drop-shadow-[0_0_8px_#f97316]">
                <div className="text-orange-400">
                  <SlidersHorizontalIcon className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-white">
                  2. Choose Settings
                </h3>
                <p className="text-xs text-slate-400">
                  Select model, style, and aspect ratio.
                </p>
              </div>
              <div
                className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/80
                flex flex-col items-center text-center gap-2 transition-all duration-300
                hover:scale-105 hover:drop-shadow-[0_0_8px_#f97316]">
                <div className="text-orange-400">
                  <ArrowRightIcon className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-white">3. Get Your Video</h3>
                <p className="text-xs text-slate-400">
                  Generate, download, and share your video.
                </p>
              </div>
            </div>
            <div className="w-full sticky bottom-4">
              <PromptForm
                onGenerate={handleSubmit}
                initialValues={initialFormValues}
              />
              <p className="text-xs text-slate-500 mt-3 px-4">
                Keep it fun! Please avoid creating offensive or harmful content.
                Our AI is for laughs, not hate.
              </p>
            </div>
          </div>
        );
    }
  };

  const renderPage = () => {
    if (route.startsWith('article/')) {
      const slug = route.split('/')[1] as ArticleSlug;
      const article = articlesData[slug];
      if (article) {
        return (
          <ArticlePage
            title={article.title}
            onClose={() => (window.location.hash = '#home')}>
            {article.content}
          </ArticlePage>
        );
      }
    }

    switch (route) {
      case 'blog':
        return <BlogPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'howitworks':
        return <HowItWorksPage />;
      case 'contact':
        return <ContactPage />;
      case 'about':
        return (
          <InfoPage title={infoPagesData.about.title}>
            {infoPagesData.about.content}
          </InfoPage>
        );
      case 'privacy':
        return (
          <InfoPage title={infoPagesData.privacy.title}>
            {infoPagesData.privacy.content}
          </InfoPage>
        );
      case 'terms':
        return (
          <InfoPage title={infoPagesData.terms.title}>
            {infoPagesData.terms.content}
          </InfoPage>
        );
      case 'home':
      default:
        return (
          <div className="w-full flex-grow flex items-center justify-center p-4">
            {renderHomePage()}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <Header onLogoClick={handleNewVideo} />
      <main className="flex-grow flex flex-col">{renderPage()}</main>
      <Footer />
    </div>
  );
};

export default App;
