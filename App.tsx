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
} from './types';
import { articleLinks } from './components/ArticleLinks';
import { RoastyPitLogoIcon, SlidersHorizontalIcon, TextModeIcon, ArrowRightIcon } from './components/icons';


// Helper to get route and params from hash
const parseRoute = () => {
  const hash = window.location.hash.substring(1);
  if (!hash || hash === 'home') {
    return { page: 'home', param: null };
  }
  const [page, param] = hash.split('/');
  return { page, param };
};

const articlesData: Record<ArticleSlug, { title: string; content: React.ReactNode }> = {
    'art-of-the-roast': {
        title: "The Art of the Roast: How RoastyPit Turns Words Into Comedy Gold",
        content: <>
            <p>For years, roasting has been a cornerstone of comedy — a way to poke fun, share laughter, and show confidence through clever remarks. From celebrity roast specials to friendly jokes between friends, the art of roasting has always been about timing, creativity, and charm.</p>
            <p>Now, with the rise of artificial intelligence, that art form has evolved. Thanks to <strong>RoastyPit</strong>, a next-generation <em>text-to-video generator</em>, anyone can create a personalized roast video in seconds.</p>
            <img src="https://placehold.co/800x450/1e293b/f97316?text=RoastyPit+AI+in+Action" alt="AI-generated roast video example" className="my-6 rounded-lg"/>
            <h2>What Exactly Is a Roast?</h2>
            <p>A roast is a lighthearted joke directed at someone in a fun, friendly way. The goal isn’t to offend but to entertain. RoastyPit captures that same energy and turns it into digital entertainment.</p>
            <h2>From Text to Laughter: How RoastyPit Works</h2>
            <ol>
                <li><strong>Enter your text prompt:</strong> For example, “Roast me for sleeping through my alarm again.”</li>
                <li><strong>Choose your style:</strong> Sarcastic, playful, dramatic, or celebrity-inspired.</li>
                <li><strong>Watch the magic happen:</strong> The AI creates a short, funny video you can share instantly.</li>
            </ol>
            <h2>Why AI Comedy Works So Well</h2>
            <ul>
                <li>It’s personal: Each roast is unique to your input.</li>
                <li>It’s accessible: No video skills required.</li>
                <li>It’s fast: Your words become a polished video in under a minute.</li>
                <li>It’s entertaining: The videos combine humor, expression, and energy.</li>
            </ul>
        </>,
    },
    'hilarious-prompts': {
        title: "How to Write Hilarious AI Prompts: The Secret to Viral RoastyPit Videos",
        content: <>
            <p>When using RoastyPit, your text prompt is your ticket to viral comedy. The right words can transform a simple idea into a hilarious AI-generated video that entertains your audience instantly.</p>
            <img src="https://placehold.co/800x450/1e293b/ea580c?text=Crafting+the+Perfect+Prompt" alt="Example of an AI prompt for a RoastyPit video" className="my-6 rounded-lg"/>
            <h2>What Makes a Prompt “Hilarious”?</h2>
            <p>A good prompt has three key ingredients: a clear setup, an exaggeration or twist, and relatability.</p>
            <h2>Tip 1: Start with a Situation</h2>
            <p>Provide context for your prompt. Example: “Roast me for thinking I could fix my car after one YouTube tutorial.”</p>
            <h2>Tip 2: Keep It Short and Snappy</h2>
            <p>Short prompts are more effective. Example: “Roast me for sleeping through every alarm.”</p>
            <h2>Tip 3: Use Everyday Humor</h2>
            <p>Make your prompts relatable: “Roast me for checking my phone every 3 seconds.”</p>
        </>,
    },
    'top-5-viral': {
        title: "Top 5 Viral Videos Made with RoastyPit",
        content: <>
            <p>RoastyPit transforms simple text prompts into hilarious AI-generated videos. Here are the top 5 viral trends you can try yourself.</p>
            <img src="https://placehold.co/800x450/1e293b/d97706?text=Viral+Hits" alt="Collage of viral RoastyPit videos" className="my-6 rounded-lg"/>
            <h2>1. Roast Me for My Gym Routine</h2>
            <p>Example: “Roast me for going to the gym once and calling myself a fitness influencer.” Perfect for relatable humor.</p>
            <h2>2. AI Roasts My Life Decisions</h2>
            <p>Example: “Roast me for thinking I could survive on energy drinks and optimism.” Self-deprecating humor works best.</p>
            <h2>3. Roast My Pet Like They’re a Celebrity</h2>
            <p>Example: “Roast my cat like he’s a famous actor with too much attitude.” Cute + funny = viral gold.</p>
            <h2>4. AI Roasts My Job Interview</h2>
            <p>Example: “Roast me for saying ‘I’m a people person’ at every job interview.” Perfect for office humor.</p>
            <h2>5. AI Roasts Humanity</h2>
            <p>Example: “Roast humanity like you’re an alien watching Earth.” Clever, thought-provoking, and funny.</p>
        </>,
    },
    'ai-in-comedy': {
        title: "AI in Comedy: The Future of Funny",
        content: <>
            <p>Comedy is deeply human, but AI is learning to replicate humor in creative ways. RoastyPit transforms text into funny, shareable videos with realistic expressions, timing, and tone.</p>
            <img src="https://placehold.co/800x450/1e293b/b45309?text=The+Future+of+Funny" alt="AI-generated comedy video example" className="my-6 rounded-lg"/>
            <h2>How AI Learned to Laugh</h2>
            <p>RoastyPit uses natural language processing to understand context, tone, and humor style. It converts your prompt into an AI-generated video with proper comedic timing.</p>
            <h2>Why AI and Comedy Are a Perfect Match</h2>
            <ul>
                <li>Instant creativity</li>
                <li>Accessibility for everyone</li>
                <li>Relatability</li>
                <li>Endless potential</li>
            </ul>
        </>,
    },
    'behind-the-scenes': {
        title: "Behind the Scenes: How RoastyPit Works",
        content: <>
            <p>RoastyPit is more than a fun app — it’s a sophisticated AI platform that converts text into short, entertaining videos. This article explores the technology and process behind the laughs.</p>
            <img src="https://placehold.co/800x450/1e293b/92400e?text=Behind+the+Magic" alt="RoastyPit AI video creation process" className="my-6 rounded-lg"/>
            <h2>Step 1: Input Your Text Prompt</h2>
            <p>Your video starts with a prompt: short, funny, and clear. Example: “Roast me like I forgot my homework again.”</p>
            <h2>Step 2: AI Understands Context and Tone</h2>
            <p>The AI analyzes humor style, tone, and subject matter to ensure the video feels natural and engaging.</p>
            <h2>Step 3: Text-to-Video Transformation</h2>
            <ul>
                <li>Visual generation: Creates avatars and scenes.</li>
                <li>Voice synthesis: Natural speech with comedic timing.</li>
                <li>Expressions & gestures: Human-like performance.</li>
                <li>Video editing: Seamless final clip.</li>
            </ul>
        </>,
    },
};

const infoPageData = {
    'about': {
        title: "About RoastyPit",
        content: <p>RoastyPit is a passion project exploring the intersection of AI and comedy. We believe everyone has a funny idea, and our goal is to give you the tools to bring it to life in seconds. Using cutting-edge text-to-video technology, we turn your words into hilarious, shareable roasts.</p>
    },
    'privacy': {
        title: "Privacy Policy",
        content: <><p>We respect your privacy. We temporarily process your text prompts to generate videos but do not store them long-term or link them to personal information. We use analytics to improve our service, but your creative content is yours.</p>
        <h3 className="text-lg font-semibold mt-4 text-orange-400">Information We Collect:</h3>
        <ul className="list-disc list-inside mt-2">
            <li>Non-personal usage data (e.g., page visits).</li>
            <li>Text prompts, which are deleted after processing.</li>
        </ul></>
    },
    'terms': {
        title: "Terms of Service",
        content: <><p>By using RoastyPit, you agree to not generate content that is hateful, illegal, or harassing. You retain ownership of the prompts you write, but grant us a license to use them to generate the video. The service is provided "as is" without warranties.</p>
        <h3 className="text-lg font-semibold mt-4 text-orange-400">You Agree Not To:</h3>
        <ul className="list-disc list-inside mt-2">
            <li>Generate content that violates any laws.</li>
            <li>Use the service to spam or harm others.</li>
            <li>Attempt to reverse-engineer the service.</li>
        </ul></>
    }
}


const App: React.FC = () => {
  // App State
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<React.ReactNode | null>(null);
  const [lastConfig, setLastConfig] = useState<GenerateVideoParams | null>(null);
  const [lastVideoObject, setLastVideoObject] = useState<Video | null>(null);
  const [lastVideoBlob, setLastVideoBlob] = useState<Blob | null>(null);
  const [initialFormValues, setInitialFormValues] = useState<GenerateVideoParams | null>(null);

  // Routing State
  const [route, setRoute] = useState(parseRoute());

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSubmit = useCallback(async (params: GenerateVideoParams) => {
    setAppState(AppState.LOADING);
    setVideoUrl(null);
    setErrorMessage(null);
    setLastConfig(params);

    try {
      const {objectUrl, blob, video} = await generateVideo(params);
      setVideoUrl(objectUrl);
      setLastVideoObject(video);
      setLastVideoBlob(blob);
      setAppState(AppState.SUCCESS);
    } catch (e) {
      console.error(e);
      const error = e as Error;
      setErrorMessage(
        <>
          <p className="font-semibold">Video generation failed:</p>
          <p className="mt-1 text-sm text-red-300">
            {error.message || 'An unknown error occurred.'}
          </p>
        </>,
      );
      setAppState(AppState.ERROR);
    }
  }, []);

  const handleNewVideo = useCallback(() => {
    setAppState(AppState.IDLE);
    setVideoUrl(null);
    setErrorMessage(null);
    setLastConfig(null);
    setInitialFormValues(null);
    window.location.hash = 'home';
  }, []);
  
  const handleTryAgain = useCallback(() => {
    if (lastConfig) {
      setInitialFormValues(lastConfig);
      setAppState(AppState.IDLE);
      setErrorMessage(null);
    } else {
      handleNewVideo();
    }
  }, [lastConfig, handleNewVideo]);

  const handleExtend = useCallback(() => {
    if (lastVideoObject && lastVideoBlob && lastConfig) {
      setInitialFormValues({
        ...lastConfig,
        mode: 'Extend Video',
        prompt: '',
        inputVideoObject: lastVideoObject,
        inputVideo: {
          file: new File([lastVideoBlob], 'last_video.mp4', {
            type: 'video/mp4',
          }),
          base64: '', // Not needed as we have the object
        },
      });
      setAppState(AppState.IDLE);
    }
  }, [lastVideoObject, lastVideoBlob, lastConfig]);


  const renderMainContent = () => {
    switch (appState) {
      case AppState.LOADING:
        return <LoadingIndicator />;
      case AppState.SUCCESS:
        if (videoUrl) {
          return (
            <VideoResult
              videoUrl={videoUrl}
              videoBlob={lastVideoBlob}
              onRetry={handleTryAgain}
              onNewVideo={handleNewVideo}
              onExtend={handleExtend}
              canExtend={lastConfig?.resolution === '720p'}
            />
          );
        }
        return null;
      case AppState.ERROR:
        return (
          <div className="flex flex-col items-center justify-center p-8 bg-red-900/30 backdrop-blur-sm rounded-2xl border border-red-500/50 w-full max-w-lg text-center">
            <h2 className="text-2xl font-bold text-red-300">
              Something Went Wrong
            </h2>
            <div className="mt-4 text-red-200">{errorMessage}</div>
            <div className="mt-8 flex gap-4">
              <button
                onClick={handleTryAgain}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors">
                Try Again
              </button>
              <button
                onClick={handleNewVideo}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors">
                New Video
              </button>
            </div>
          </div>
        );
      case AppState.IDLE:
      default:
        return (
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center px-4">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-amber-300 via-orange-500 to-red-600 bg-clip-text text-transparent">
                    Generate Viral Video Roasts
                </h2>
                <p className="mt-4 text-lg text-slate-400 max-w-xl">
                    Turn any idea into a hilarious, shareable video in seconds. Just type a prompt and let our AI do the roasting.
                </p>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/80 flex flex-col items-center gap-2 text-center transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_8px_#f97316]">
                        <TextModeIcon className="w-8 h-8 text-orange-400" />
                        <h3 className="font-semibold text-white">1. Type a Prompt</h3>
                        <p className="text-xs text-slate-400">Describe your scene or idea.</p>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/80 flex flex-col items-center gap-2 text-center transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_8px_#f97316]">
                        <SlidersHorizontalIcon className="w-8 h-8 text-orange-400" />
                        <h3 className="font-semibold text-white">2. Choose Settings</h3>
                        <p className="text-xs text-slate-400">Pick your style and format.</p>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/80 flex flex-col items-center gap-2 text-center transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_8px_#f97316]">
                        <ArrowRightIcon className="w-8 h-8 text-orange-400" />
                        <h3 className="font-semibold text-white">3. Get Your Video</h3>
                        <p className="text-xs text-slate-400">Share your AI creation.</p>
                    </div>
                </div>
                <div className="mt-8 w-full max-w-3xl">
                    <PromptForm onGenerate={handleSubmit} initialValues={initialFormValues} />
                    <p className="mt-4 text-xs text-slate-500">
                        Type a prompt and choose your settings. Our AI will generate a hilarious, unique video for you. Please keep it fun and friendly!
                    </p>
                </div>
            </div>
        );
    }
  };

  const renderPage = () => {
    if (route.page.startsWith('article')) {
        const slug = route.param as ArticleSlug | undefined;
        if (slug && articlesData[slug]) {
            const article = articlesData[slug];
            return <ArticlePage title={article.title}>{article.content}</ArticlePage>;
        }
    }

    switch(route.page) {
        case 'home':
            return (
                <main className="w-full flex-grow flex items-center justify-center p-4">
                    {renderMainContent()}
                </main>
            );
        case 'blog':
            return <BlogPage />;
        case 'gallery':
            return <GalleryPage />;
        case 'howitworks':
            return <HowItWorksPage />;
        case 'contact':
            return <ContactPage />;
        case 'about':
        case 'privacy':
        case 'terms':
            const data = infoPageData[route.page];
            return <InfoPage title={data.title}>{data.content}</InfoPage>
        default:
            // Fallback for unknown routes
            window.location.hash = 'home';
            return null;
    }
  }

  return (
    <div className="min-h-screen text-gray-200 flex flex-col bg-slate-900">
        <Header />
        {renderPage()}
        <Footer />
    </div>
  );
};

export default App;