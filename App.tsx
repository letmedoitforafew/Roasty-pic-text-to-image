/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {Video} from '@google/genai';
import React, {useCallback, useState} from 'react';
import ArticlePage from './components/ArticlePage';
import ContactPage from './components/ContactPage';
import Footer from './components/Footer';
import GalleryPage from './components/GalleryPage';
import {
  RoastyPitLogoIcon,
} from './components/icons';
import HowItWorksPage from './components/HowItWorksPage';
import InfoDialog from './components/InfoDialog';
import LoadingIndicator from './components/LoadingIndicator';
import PromptForm from './components/PromptForm';
import VideoResult from './components/VideoResult';
import {generateVideo} from './services/geminiService';
import {
  AppState,
  GenerateVideoParams,
  Resolution,
} from './types';
import AdPlaceholder from './components/AdPlaceholder';

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
  const [showContactPage, setShowContactPage] = useState(false);
  const [showGalleryPage, setShowGalleryPage] = useState(false);
  const [showHowItWorksPage, setShowHowItWorksPage] = useState(false);
  const [activeArticle, setActiveArticle] = useState<{
    title: string;
    content: React.ReactNode;
  } | null>(null);

  const [initialFormValues, setInitialFormValues] =
    useState<GenerateVideoParams | null>(null);

  const handleNewVideo = useCallback(() => {
    setAppState(AppState.IDLE);
    setVideoUrl(null);
    setErrorMessage(null);
    setLastConfig(null);
    setLastVideoObject(null);
    setLastVideoBlob(null);
    setInitialFormValues(null);
  }, []);
    
  const handleShowArticle = (slug: keyof typeof articlesData) => {
    setActiveArticle(articlesData[slug]);
  };
  
  const ImagePlaceholder: React.FC<{ alt: string }> = ({ alt }) => (
    <div className="w-full aspect-video bg-slate-700/50 border border-slate-600 rounded-lg flex items-center justify-center my-6">
      <span className="text-slate-400 text-sm italic">{alt}</span>
    </div>
  );

  const InternalLink: React.FC<{ slug: keyof typeof articlesData, children: React.ReactNode }> = ({ slug, children }) => (
    <button onClick={() => handleShowArticle(slug)} className="text-orange-400 hover:underline font-semibold">
      {children}
    </button>
  );

  const articlesData = {
    'art-of-the-roast': {
      title: '🥊 The Art of the Roast: How RoastyPit Turns Words Into Comedy Gold',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-orange-400">Introduction: A New Era of Digital Humor</h3>
          <p>For years, roasting has been a cornerstone of comedy — a way to poke fun, share laughter, and show confidence through clever remarks. From celebrity roast specials to friendly jokes between friends, the art of roasting has always been about timing, creativity, and charm.</p>
          <p>Now, with the rise of artificial intelligence, that art form has evolved. Thanks to <strong>RoastyPit</strong>, a next-generation <em>text-to-video generator</em>, anyone can create a personalized roast video in seconds.</p>
          <ImagePlaceholder alt="AI-generated roast video example" />
          
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">What Exactly Is a Roast?</h3>
          <p>A roast is a lighthearted joke directed at someone in a fun, friendly way. The goal isn’t to offend but to entertain. RoastyPit captures that energy and turns it into digital entertainment.</p>
          
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">From Text to Laughter: How RoastyPit Works</h3>
          <ol className="list-decimal list-inside space-y-2 pl-4">
            <li><strong>Enter your text prompt:</strong> For example, “Roast me for sleeping through my alarm again.”</li>
            <li><strong>Choose your style:</strong> Sarcastic, playful, dramatic, or celebrity-inspired.</li>
            <li><strong>Watch the magic happen:</strong> The AI creates a short, funny video you can share instantly.</li>
          </ol>
          
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">Why AI Comedy Works So Well</h3>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>It’s personal: Each roast is unique to your input.</li>
            <li>It’s accessible: No video skills required.</li>
            <li>It’s fast: Your words become a polished video in under a minute.</li>
            <li>It’s entertaining: The videos combine humor, expression, and energy.</li>
          </ul>
          
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">How to Master the Art of the Roast</h3>
          <h4 className="text-xl font-bold text-orange-300">Keep It Short and Clear</h4>
          <p>Short prompts work best. Example: “Roast me for forgetting my anniversary again.”</p>
          <h4 className="text-xl font-bold text-orange-300 mt-4">Add a Personal Twist</h4>
          <p>Include something relatable. Example: “Roast me for pretending to be on a diet while ordering dessert.”</p>
          <h4 className="text-xl font-bold text-orange-300 mt-4">Use Playful Language</h4>
          <p>The best roasts are clever, not cruel. Example: “Roast me for thinking one gym session equals a six-pack.”</p>
          <h4 className="text-xl font-bold text-orange-300 mt-4">Experiment With Styles</h4>
          <p>Try sarcastic, dramatic, motivational, or robotic tones for different vibes.</p>
  
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">The Social Media Power of Roasts</h3>
          <p>RoastyPit videos are perfect for TikTok, Instagram, and YouTube Shorts — short, engaging, and shareable. Users create viral content by sharing relatable roasts, challenges, and meme-style videos.</p>
          <p><InternalLink slug="hilarious-prompts">Learn how to write hilarious AI prompts</InternalLink></p>
          <p><InternalLink slug="top-5-viral">See the top 5 viral RoastyPit videos</InternalLink></p>
  
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">The Future of Roasting Is AI</h3>
          <p>AI-generated humor is the next frontier of entertainment. RoastyPit allows anyone to create funny, personalized content, merging creativity and technology like never before.</p>
  
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">Conclusion: Your Words, Your Comedy, Your RoastyPit Moment</h3>
          <p>The art of roasting is evolving. With RoastyPit, you don’t need to be a stand-up comedian to make people laugh. Type a line, hit generate, and let your text become a video — one roast at a time.</p>
          <p><a href="https://roastypit.com" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">Try RoastyPit now</a></p>
        </div>
      ),
    },
    'hilarious-prompts': {
      title: '💡 How to Write Hilarious AI Prompts: The Secret to Viral RoastyPit Videos',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-orange-400">Introduction: Why the Prompt Is Everything</h3>
          <p>When using RoastyPit, your text prompt is your ticket to viral comedy. The right words can transform a simple idea into a hilarious AI-generated video that entertains your audience instantly.</p>
          <ImagePlaceholder alt="Example of AI prompt for RoastyPit video" />
          
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">What Makes a Prompt “Hilarious”?</h3>
          <p>A good prompt has three key ingredients: a clear setup, an exaggeration or twist, and relatability.</p>
          
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">Tip 1: Start with a Situation</h3>
          <p>Provide context for your prompt. Example: “Roast me for thinking I could fix my car after one YouTube tutorial.”</p>
  
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">Tip 2: Keep It Short and Snappy</h3>
          <p>Short prompts are more effective. Example: “Roast me for sleeping through every alarm.”</p>
  
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">Tip 3: Use Everyday Humor</h3>
          <p>Make your prompts relatable: “Roast me for checking my phone every 3 seconds.”</p>
          
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">Tip 4: Add Personality and Drama</h3>
          <p>Include tone or mood to make videos expressive: “Roast me like a motivational speaker who just failed a test.”</p>
  
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">Tip 5: Experiment With Styles</h3>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Sarcastic:</strong> “Roast me like a disappointed teacher.”</li>
            <li><strong>Overly Dramatic:</strong> “Roast me like I lost my Wi-Fi forever.”</li>
            <li><strong>Formal/Corporate:</strong> “Roast me as if I’m getting fired.”</li>
            <li><strong>Romantic Comedy:</strong> “Roast me for thinking my cat is my soulmate.”</li>
          </ul>
  
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">Tip 6: Keep It Friendly and Clean</h3>
          <p>Safe, family-friendly humor performs best online and stays AdSense-approved.</p>
  
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">Tip 7: Use Trends to Boost Engagement</h3>
          <p>Connect prompts to popular culture or challenges to increase shares and engagement.</p>
  
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">Conclusion: Every Great Video Starts With a Great Prompt</h3>
          <p>Creative, short, and relatable prompts are the secret to RoastyPit videos that get laughs and shares.</p>
          <p><a href="https://roastypit.com" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">Try RoastyPit now</a></p>
          <p><InternalLink slug="top-5-viral">See viral video examples</InternalLink></p>
        </div>
      ),
    },
    'top-5-viral': {
      title: '📹 Top 5 Viral Videos Made with RoastyPit',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-orange-400">Introduction: From Text to Viral Fame</h3>
          <p>RoastyPit transforms simple text prompts into hilarious AI-generated videos. Here are the top 5 viral trends you can try yourself.</p>
          <ImagePlaceholder alt="Collage of viral RoastyPit videos" />
  
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">1. Roast Me for My Gym Routine</h3>
          <p>Example: “Roast me for going to the gym once and calling myself a fitness influencer.” Perfect for relatable humor.</p>
  
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">2. AI Roasts My Life Decisions</h3>
          <p>Example: “Roast me for thinking I could survive on energy drinks and optimism.” Self-deprecating humor works best.</p>
  
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">3. Roast My Pet Like They’re a Celebrity</h3>
          <p>Example: “Roast my cat like he’s a famous actor with too much attitude.” Cute + funny = viral gold.</p>
  
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">4. AI Roasts My Job Interview</h3>
          <p>Example: “Roast me for saying ‘I’m a people person’ at every job interview.” Perfect for office humor.</p>
  
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">5. AI Roasts Humanity</h3>
          <p>Example: “Roast humanity like you’re an alien watching Earth.” Clever, thought-provoking, and funny.</p>
  
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">How to Make Your RoastyPit Video Go Viral</h3>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Start with a funny, specific prompt</li>
            <li>Keep it short (15–30 seconds)</li>
            <li>Add your reaction</li>
            <li>Use trending hashtags</li>
            <li>Post consistently</li>
          </ul>
          <p><InternalLink slug="hilarious-prompts">Learn to write hilarious AI prompts</InternalLink></p>
          <p><InternalLink slug="ai-in-comedy">Learn how AI is shaping comedy</InternalLink></p>
  
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">Conclusion: Your Words Could Be the Next Viral Hit</h3>
          <p>Type your idea, generate a RoastyPit video, and share — your next viral moment could start with a single prompt.</p>
          <p><a href="https://roastypit.com" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">Try RoastyPit now</a></p>
        </div>
      ),
    },
    'ai-in-comedy': {
      title: '🤖 AI in Comedy: The Future of Funny',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-orange-400">Introduction: When Technology Learns to Be Funny</h3>
          <p>Comedy is deeply human, but AI is learning to replicate humor in creative ways. RoastyPit transforms text into funny, shareable videos with realistic expressions, timing, and tone.</p>
          <ImagePlaceholder alt="AI-generated comedy video example" />
          
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">How AI Learned to Laugh</h3>
          <p>RoastyPit uses natural language processing to understand context, tone, and humor style. It converts your prompt into an AI-generated video with proper comedic timing.</p>
          
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">RoastyPit: Where AI Comedy Meets Creativity</h3>
          <p>The platform allows anyone to become a creator — no editing skills needed. Videos feel natural, expressive, and personalized.</p>
          
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">AI Comedy on Social Media</h3>
          <p>From TikTok to YouTube Shorts, AI-generated videos are gaining massive engagement, especially personalized roasts and relatable content.</p>
  
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">Why AI and Comedy Are a Perfect Match</h3>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Instant creativity</li>
            <li>Accessibility for everyone</li>
            <li>Relatability</li>
            <li>Endless potential</li>
          </ul>
  
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">The Future of Funny</h3>
          <p>Expect AI personalities, interactive roasts, hybrid performances, and more sophisticated emotional understanding — all making comedy more accessible and shareable.</p>
  
          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">Conclusion: The Future of Laughter Is Digital</h3>
          <p>RoastyPit allows anyone to turn text into laughter. AI is amplifying creativity, making humor faster, easier, and universally shareable.</p>
          <p><InternalLink slug="behind-the-scenes">Learn how RoastyPit works</InternalLink></p>
          <p><a href="https://roastypit.com" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">Try RoastyPit now</a></p>
        </div>
      ),
    },
    'behind-the-scenes': {
      title: '⚙️ Behind the Scenes: How RoastyPit Works',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-orange-400">Introduction: Turning Words into Videos</h3>
          <p>RoastyPit is more than a fun app — it’s a sophisticated AI platform that converts text into short, entertaining videos. This article explores the technology and process behind the laughs.</p>
          <ImagePlaceholder alt="RoastyPit AI video creation process" />

          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">Step 1: Input Your Text Prompt</h3>
          <p>Your video starts with a prompt: short, funny, and clear. Example: “Roast me like I forgot my homework again.”</p>

          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">Step 2: AI Understands Context and Tone</h3>
          <p>The AI analyzes humor style, tone, and subject matter to ensure the video feels natural and engaging.</p>

          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">Step 3: Text-to-Video Transformation</h3>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Visual generation:</strong> Creates avatars and scenes.</li>
            <li><strong>Voice synthesis:</strong> Natural speech with comedic timing.</li>
            <li><strong>Expressions & gestures:</strong> Human-like performance.</li>
            <li><strong>Video editing:</strong> Seamless final clip.</li>
          </ul>

          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">Step 4: Personalization and Style Options</h3>
          <p>Choose tone, character style, and background to make each video unique.</p>

          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">Step 5: Download and Share</h3>
          <p>Ready-to-share videos for TikTok, Instagram, or YouTube Shorts.</p>
          <p><InternalLink slug="hilarious-prompts">Write better AI prompts</InternalLink></p>
          <p><InternalLink slug="ai-in-comedy">Learn about AI in comedy</InternalLink></p>

          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">The Technology That Powers RoastyPit</h3>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>AI text analysis</li>
            <li>Text-to-speech engines</li>
            <li>Computer vision & animation</li>
            <li>Cloud processing for fast generation</li>
          </ul>

          <h3 className="text-2xl font-bold text-orange-400 pt-4 border-t border-slate-700">Conclusion: From Text to Video, Comedy Made Easy</h3>
          <p>RoastyPit simplifies content creation, turning your ideas into funny, shareable videos with ease. AI amplifies your creativity, letting anyone make people laugh.</p>
          <p><a href="https://roastypit.com" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">Try RoastyPit now</a></p>
        </div>
      )
    },
  };


  const handleShowDialog = (
    dialog: 'about' | 'privacy' | 'terms' | 'contact' | 'gallery' | 'howitworks',
  ) => {
    if (dialog === 'contact') {
        setShowContactPage(true);
    } else if (dialog === 'gallery') {
        setShowGalleryPage(true);
    } else if (dialog === 'howitworks') {
        setShowHowItWorksPage(true);
    }
     else {
      const content = {
        about: {
          title: 'About RoastyPit',
          content: <p>RoastyPit is a demo application showcasing the power of Google's Veo model for high-quality text-to-video generation. Create hilarious, shareable roast videos and see what's possible with generative AI.</p>
        },
        privacy: {
          title: 'Privacy Policy',
          content: <p>Your privacy is important. We do not store any of the videos you create or the prompts you enter. All processing is done in memory and discarded after your session.</p>
        },
        terms: {
          title: 'Terms of Service',
          content: <p>By using RoastyPit, you agree not to generate content that is harmful, offensive, or violates any laws. This is a demonstration tool; please use it responsibly.</p>
        },
      }[dialog];
      setInfoDialogContent(content);
    }
  };

  const handleGenerate = useCallback(async (params: GenerateVideoParams) => {
    setAppState(AppState.LOADING);
    setErrorMessage(null);
    setLastConfig(params);

    try {
      const {objectUrl, blob, video} = await generateVideo(params);
      setVideoUrl(objectUrl);
      setLastVideoBlob(blob);
      setLastVideoObject(video);
      setAppState(AppState.SUCCESS);
    } catch (e) {
      console.error(e);
      let message = 'An unknown error occurred.';
      if (e instanceof Error) {
        if (e.message.includes('billing')) {
            message =
              'Video generation failed. Please ensure you have selected an API key associated with a Google Cloud project that has billing enabled.';
        } else {
            message = e.message;
        }
      }
      setErrorMessage(
        <>
          <strong>Video generation failed.</strong>
          <p className="mt-2 text-sm text-slate-400">{message}</p>
        </>,
      );
      setAppState(AppState.ERROR);
    }
  }, []);

  const handleRetry = useCallback(() => {
    if (lastConfig) {
      handleGenerate(lastConfig);
    }
  }, [lastConfig, handleGenerate]);

  const handleExtend = useCallback(() => {
    if (lastConfig && lastVideoObject) {
      const newConfig: GenerateVideoParams = {
        ...lastConfig,
        mode: 'Extend Video',
        prompt: '',
        inputVideoObject: lastVideoObject,
        aspectRatio: lastVideoObject.aspectRatio as '16:9' | '9:16',
      };
      setInitialFormValues(newConfig);
      setAppState(AppState.IDLE);
    }
  }, [lastConfig, lastVideoObject]);


  if (activeArticle) {
    return (
      <ArticlePage
        title={activeArticle.title}
        onClose={() => setActiveArticle(null)}>
        {activeArticle.content}
      </ArticlePage>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 flex flex-col">
      {/* This is the main content area which will change based on state */}
      <main className="w-full flex-grow flex flex-col items-center justify-center p-4">
        {appState === AppState.IDLE && (
          <div className="flex flex-col items-center text-center max-w-4xl w-full">
            <header className="py-4 px-8 relative z-10 shrink-0">
              <button onClick={handleNewVideo} className="flex items-center gap-4 group" aria-label="Go to homepage">
                <RoastyPitLogoIcon className="w-10 h-10 text-orange-400 logo-glow-animation group-hover:scale-105 transition-transform" />
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-300 via-orange-500 to-red-600 bg-clip-text text-transparent">
                  RoastyPit
                </h1>
              </button>
            </header>

            <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-4 mb-4">
                Generate Viral Video Roasts
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mb-8">
                Turn any idea into a hilarious, shareable video in seconds. Just type a prompt and let our AI do the roasting.
            </p>
            <p className="text-sm text-amber-400/80 max-w-lg mb-8 bg-amber-900/20 border border-amber-500/30 rounded-lg px-4 py-2">
                Disclaimer: Please keep it fun! This tool is for laughs, not for generating offensive or harmful content. Let's keep the roasts light and the vibes positive.
            </p>
            <div className="w-full max-w-3xl mt-auto">
                <PromptForm onGenerate={handleGenerate} initialValues={initialFormValues} />
            </div>
          </div>
        )}
        
        {appState === AppState.LOADING && <LoadingIndicator />}
        
        {appState === AppState.SUCCESS && videoUrl && lastVideoBlob && (
          <div className="flex flex-col items-center justify-center w-full max-w-5xl">
             <header className="py-4 px-8 relative z-10 shrink-0 mb-4">
              <button onClick={handleNewVideo} className="flex items-center gap-4 group" aria-label="Go to homepage">
                <RoastyPitLogoIcon className="w-10 h-10 text-orange-400 group-hover:scale-105 transition-transform" />
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-300 via-orange-500 to-red-600 bg-clip-text text-transparent">
                  RoastyPit
                </h1>
              </button>
            </header>
            <VideoResult
              videoUrl={videoUrl}
              videoBlob={lastVideoBlob}
              onRetry={handleRetry}
              onNewVideo={handleNewVideo}
              onExtend={handleExtend}
              canExtend={lastConfig?.resolution === Resolution.P720}
            />
          </div>
        )}
        
        {appState === AppState.ERROR && (
          <div className="flex flex-col items-center justify-center w-full max-w-5xl">
            <header className="py-4 px-8 relative z-10 shrink-0 mb-4">
              <button onClick={handleNewVideo} className="flex items-center gap-4 group" aria-label="Go to homepage">
                <RoastyPitLogoIcon className="w-10 h-10 text-orange-400 group-hover:scale-105 transition-transform" />
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-300 via-orange-500 to-red-600 bg-clip-text text-transparent">
                  RoastyPit
                </h1>
              </button>
            </header>
            <div className="p-8 bg-red-900/20 border border-red-500/30 rounded-2xl text-center">
              <h2 className="text-2xl font-bold text-red-400 mb-4">
                Oops! Something went wrong.
              </h2>
              <div className="text-red-300">{errorMessage}</div>
              <div className="mt-8 flex gap-4 justify-center">
                <button
                  onClick={handleRetry}
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleNewVideo}
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold transition-colors"
                >
                  Start Over
                </button>
              </div>
            </div>
           </div>
        )}

      </main>
      <Footer onShowDialog={handleShowDialog} onShowArticle={handleShowArticle}/>

      {infoDialogContent && (
        <InfoDialog
          title={infoDialogContent.title}
          onClose={() => setInfoDialogContent(null)}
        >
          {infoDialogContent.content}
        </InfoDialog>
      )}
      {showContactPage && <ContactPage onClose={() => setShowContactPage(false)} />}
      {showGalleryPage && <GalleryPage onClose={() => setShowGalleryPage(false)} />}
      {showHowItWorksPage && <HowItWorksPage onClose={() => setShowHowItWorksPage(false)} />}
    </div>
  );
};

export default App;
