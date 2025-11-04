/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {Video} from '@google/genai';
import React, {useCallback, useEffect, useState} from 'react';
import AdPlaceholder from './components/AdPlaceholder';
import ArticlePage from './components/ArticlePage';
import ContactPage from './components/ContactPage';
import Footer from './components/Footer';
import GalleryPage from './components/GalleryPage';
import {
  RoastyPitLogoIcon,
  ShareIcon,
  SlidersHorizontalIcon,
  TextModeIcon,
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
  const [showContactPage, setShowContactPage] = useState(false);
  const [showGalleryPage, setShowGalleryPage] = useState(false);
  const [showHowItWorksPage, setShowHowItWorksPage] = useState(false);
  const [activeArticle, setActiveArticle] = useState<{
    title: string;
    content: React.ReactNode;
  } | null>(null);


  const [initialFormValues, setInitialFormValues] =
    useState<GenerateVideoParams | null>(null);

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
      ),
    },
  };

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
            .includes('requested entity was not found') ||
          errorMessageContent.toLowerCase().includes('api key must be set') ||
          errorMessageContent.toLowerCase().includes('api key not valid')
        ) {
          finalErrorMessage = (
            <>
              The API key appears to be invalid or lacks permissions for Veo.
              <p className="mt-4 text-sm text-red-400/80">
                Please ensure the key is correct and associated with a Google
                Cloud project that has billing enabled. For instructions, visit
                the{' '}
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

  const handleShowDialog = (dialog: 'about' | 'privacy' | 'terms' | 'contact' | 'gallery' | 'howitworks') => {
    if (dialog === 'contact') {
      setShowContactPage(true);
    } else if (dialog === 'gallery') {
      setShowGalleryPage(true);
    } else if (dialog === 'howitworks') {
      setShowHowItWorksPage(true);
    } else {
      setInfoDialogContent(dialogMap[dialog]);
    }
  }

  if (activeArticle) {
    return (
      <ArticlePage
        title={activeArticle.title}
        onClose={() => setActiveArticle(null)}
      >
        {activeArticle.content}
      </ArticlePage>
    );
  }

  return (
    <div className="h-screen text-gray-200 flex flex-col overflow-hidden">
      {showContactPage && <ContactPage onClose={() => setShowContactPage(false)} />}
      {showGalleryPage && <GalleryPage onClose={() => setShowGalleryPage(false)} />}
      {showHowItWorksPage && <HowItWorksPage onClose={() => setShowHowItWorksPage(false)} />}
      {infoDialogContent && (
        <InfoDialog
          title={infoDialogContent.title}
          onClose={() => setInfoDialogContent(null)}>
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

      <div className="w-full max-w-screen-xl mx-auto flex-grow flex flex-col p-4 overflow-hidden">
        <main className="w-full h-full flex flex-col justify-start items-center overflow-y-auto">
            {appState === AppState.IDLE ? (
              <div className="w-full h-full flex flex-col">
                <div className="text-center mb-8 px-4 pt-4">
                  <h2 className="text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-amber-200 to-orange-400 bg-clip-text text-transparent mb-4">
                    Generate Viral Video Roasts
                  </h2>
                  <p className="text-lg text-slate-400">
                    Turn any idea into a viral masterpiece. Just describe your
                    scene, and let our AI do the rest.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 px-4">
                  <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/80 transform hover:scale-105 hover:border-orange-500/80 transition-all duration-300">
                    <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-full bg-orange-900/50 mx-auto text-orange-400">
                      <TextModeIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      1. Write Your Roast
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Describe the scene. Be specific, be witty, be savage.
                      The AI loves detail.
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
                      Choose your format, quality, and generation mode for
                      the perfect burn.
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
                      Generate your video, download it, and share your
                      glorious roast with the world.
                    </p>
                  </div>
                </div>

                <div className="w-full mt-auto p-4 sticky bottom-0 bg-slate-900/70 backdrop-blur-sm border-t border-slate-800">
                  <div className="w-full max-w-3xl mx-auto">
                    <div className="text-center text-xs text-slate-500 mb-4 px-4">
                      Our AI is trained for comedy, not cruelty. Please keep
                      prompts light-hearted and fun. Let's create roasts, not
                      riots!
                    </div>
                    <PromptForm
                      onGenerate={handleGenerate}
                      initialValues={initialFormValues}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full flex-grow flex items-center justify-center p-4">
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
      <Footer onShowDialog={handleShowDialog} onShowArticle={handleShowArticle} />
    </div>
  );
};

export default App;