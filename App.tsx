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
  GenerationMode,
  Resolution,
  VeoModel,
} from './types';
import ApiKeyDialog from './components/ApiKeyDialog';


// Helper to get route and params from hash
const parseRoute = () => {
  const hash = window.location.hash.substring(1);
  if (!hash || hash === 'home') {
    return { page: 'home', param: null };
  }
  const [page, param] = hash.split('/');
  return { page, param: param || null };
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
        content: <>
            <p>RoastyPit is a passion project from Gilnetwork and its CEO Roberto Gil, exploring the intersection of AI and comedy.</p>
            <p>Using cutting-edge text-to-video technology, we turn your words into hilarious, shareable roasts in seconds.</p>
        </>
    },
    'privacy': {
        title: "Privacy Policy",
        content: <>
            <p><strong>Effective Date:</strong> November 3, 2025</p>
            <p>RoastyPit (“we,” “our,” or “us”) respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard information when you visit or use our website, RoastyPit.com, a text-to-video generator platform. By using our website, you agree to the terms of this Privacy Policy.</p>
            
            <h2>1. Information We Collect</h2>
            <p>When you use RoastyPit, we may collect the following types of information:</p>
            <h3>a. Personal Information</h3>
            <ul>
                <li><strong>Optional registration information:</strong> If you create an account, we may collect your name, email address, and password.</li>
                <li><strong>User-generated content:</strong> Text prompts you submit to generate videos may be stored temporarily for processing.</li>
            </ul>
            <h3>b. Non-Personal Information</h3>
            <ul>
                <li><strong>Browser and device information:</strong> IP address, browser type, operating system, device type, and language.</li>
                <li><strong>Usage data:</strong> Pages visited, time spent on pages, interactions with our service, and video generation activity.</li>
                <li><strong>Cookies and tracking technologies:</strong> Used to enhance user experience, personalize content, and analyze site traffic.</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ol className="list-decimal list-inside">
                <li>To provide and improve our text-to-video generator services.</li>
                <li>To process and store text prompts temporarily to generate videos.</li>
                <li>To communicate with you about your account or service updates.</li>
                <li>To analyze user behavior and improve website performance.</li>
                <li>To personalize content and display relevant features.</li>
                <li>To comply with legal obligations and prevent fraudulent activity.</li>
            </ol>
            
            <h2>3. Sharing Your Information</h2>
            <p>We do not sell, trade, or rent your personal information. We may share information in the following cases:</p>
            <ul>
                <li><strong>Service Providers:</strong> We may share data with trusted third-party providers who assist in operating our website and services, such as cloud hosting, analytics, and email communication.</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law, court order, or government regulation.</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of the business assets.</li>
            </ul>

            <h2>4. Cookies and Tracking Technologies</h2>
            <p>RoastyPit uses cookies and similar tracking technologies to improve your browsing experience, analyze trends, and understand how users interact with our website. You can disable cookies in your browser settings, but some features may not function properly.</p>
            <p><strong>Common cookies used:</strong></p>
            <ul>
                <li>Session cookies for maintaining your login session.</li>
                <li>Performance cookies to analyze site usage.</li>
                <li>Functional cookies to enhance website features.</li>
            </ul>
        </>
    },
    'terms': {
        title: "Terms of Service",
        content: <>
            <p><strong>Effective Date:</strong> November 3, 2025</p>
            <p>Welcome to RoastyPit.com. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions of use. Please review these terms carefully.</p>

            <h2>1. Acceptance of Agreement</h2>
            <p>You agree to the terms and conditions outlined in this Terms of Service Agreement ("Agreement") with respect to our site (the "Site"). This Agreement constitutes the entire and only agreement between us and you, and supersedes all prior or contemporaneous agreements, representations, warranties and understandings with respect to the Site.</p>

            <h2>2. Use of the Site</h2>
            <p>You are granted a non-exclusive, non-transferable, revocable license to access and use the Site strictly in accordance with this Agreement. As a condition of your use of the Site, you warrant that you will not use the Site for any purpose that is unlawful or prohibited by these terms.</p>
            
            <h2>3. Intellectual Property</h2>
            <p>The content, organization, graphics, design, compilation, and other matters related to the Site are protected under applicable copyrights, trademarks and other proprietary (including but not limited to intellectual property) rights. The copying, redistribution, use or publication by you of any such matters or any part of the Site is strictly prohibited.</p>

            <h2>4. Limitation of Liability</h2>
            <p>We shall not be liable for any loss, injury, claim, liability, or damage of any kind resulting in any way from your use of the site. We are not responsible for any videos generated using our service. You are responsible for the content you create and share.</p>
        </>
    }
};

const App: React.FC = () => {
    const [page, setPage] = useState('home');
    const [param, setParam] = useState<string | null>(null);
    const [appState, setAppState] = useState<AppState>(AppState.IDLE);
    const [videoResult, setVideoResult] = useState<{
      objectUrl: string;
      blob: Blob;
      uri: string;
      video: Video;
    } | null>(null);
    const [lastGenerationParams, setLastGenerationParams] =
      useState<GenerateVideoParams | null>(null);
    const [error, setError] = useState<string | null>(null);
  
    const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
    const [hasCheckedApiKey, setHasCheckedApiKey] = useState(false);
    const [pendingGenerationParams, setPendingGenerationParams] =
      useState<GenerateVideoParams | null>(null);
  
    // Parse hash route on initial load and on hash change
    useEffect(() => {
      const handleHashChange = () => {
        const { page, param } = parseRoute();
        setPage(page);
        setParam(param);
        window.scrollTo(0, 0);
      };
  
      window.addEventListener('hashchange', handleHashChange);
      handleHashChange(); // Initial route parse
  
      return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
  
    const resetToHome = () => {
      window.location.hash = 'home';
      setAppState(AppState.IDLE);
      setVideoResult(null);
      setError(null);
      // Keep lastGenerationParams so "Retry" can still work if needed,
      // but clear the video object to avoid re-entering extend mode incorrectly.
      if (lastGenerationParams) {
          const { inputVideoObject, ...rest } = lastGenerationParams;
          setLastGenerationParams(rest);
      }
    };
  
    const handleGenerate = useCallback(async (params: GenerateVideoParams) => {
      setLastGenerationParams(params);
      setPendingGenerationParams(params);
  
      // VEO models require a billed API key.
      if (!hasCheckedApiKey && (params.model === VeoModel.VEO || params.model === VeoModel.VEO_FAST)) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          setHasCheckedApiKey(true); // Mark as checked to prevent infinite loops
          setShowApiKeyDialog(true);
          return;
        }
      }
      
      setAppState(AppState.LOADING);
      setVideoResult(null);
      setError(null);
      window.location.hash = 'home';
  
      try {
        const result = await generateVideo(params);
        setVideoResult(result);
        setAppState(AppState.SUCCESS);
        // Can only extend 720p videos
        const canExtend = params.resolution === Resolution.P720;
        let nextParams = {...params};
        if (canExtend) {
            nextParams = {
              ...params,
              prompt: '',
              mode: GenerationMode.EXTEND_VIDEO,
              inputVideoObject: result.video,
            };
        }
        setLastGenerationParams(nextParams);

      } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        if (errorMessage.includes('Requested entity was not found')) {
          setError('API Key is invalid or billing is not enabled. Please select a valid key.');
          setHasCheckedApiKey(false); // Reset key state to allow re-checking
          setShowApiKeyDialog(true); // Re-prompt user
          setAppState(AppState.IDLE); // Go back to idle to allow re-submission
        } else {
          setError(errorMessage);
          setAppState(AppState.ERROR);
        }
      }
    }, [hasCheckedApiKey]);
  
    const handleApiKeyContinue = async () => {
      setShowApiKeyDialog(false);
      await window.aistudio.openSelectKey();
      // Assume key selection is successful and proceed with generation.
      if (pendingGenerationParams) {
        handleGenerate(pendingGenerationParams);
      }
    };
  
  
    const handleRetry = () => {
      if (lastGenerationParams) {
        // When retrying, use the params that led to the result, not the "extend" params.
        const retryParams = {...lastGenerationParams};
        if(retryParams.mode === GenerationMode.EXTEND_VIDEO) {
            // This is a bit tricky. We don't have the original params.
            // Let's just reset.
            resetToHome();
            return;
        }
        handleGenerate(retryParams);
      }
    };
  
    const handleExtend = () => {
      if (lastGenerationParams && lastGenerationParams.mode === GenerationMode.EXTEND_VIDEO) {
        setAppState(AppState.IDLE);
        setVideoResult(null);
        setError(null);
        // The lastGenerationParams are already set up for extension mode.
        // The PromptForm will be initialized with these values.
      }
    };
  
    const renderContent = () => {
      if (page === 'home') {
        return (
          <main className="w-full max-w-4xl mx-auto flex-grow flex flex-col items-center justify-center p-4">
              <div className="w-full text-center mb-8">
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                      Turn Ideas Into Roasts
                  </h2>
                  <p className="text-lg text-slate-400 mt-4 max-w-2xl mx-auto">
                      Just type a prompt and let our AI do the roasting. Create hilarious, shareable videos in seconds.
                  </p>
              </div>
  
              <div className="w-full flex items-center justify-center min-h-[200px]">
                  {appState === AppState.IDLE && (
                      <PromptForm onGenerate={handleGenerate} initialValues={lastGenerationParams} />
                  )}
                  {appState === AppState.LOADING && <LoadingIndicator />}
                  {appState === AppState.SUCCESS && videoResult && (
                      <VideoResult
                          videoUrl={videoResult.objectUrl}
                          videoBlob={videoResult.blob}
                          onRetry={handleRetry}
                          onNewVideo={resetToHome}
                          onExtend={handleExtend}
                          canExtend={lastGenerationParams?.mode === GenerationMode.EXTEND_VIDEO && lastGenerationParams?.inputVideoObject != null}
                      />
                  )}
                  {appState === AppState.ERROR && (
                      <div className="text-center p-8 bg-red-900/30 rounded-lg border border-red-800">
                          <h3 className="text-2xl font-bold text-red-400">An Error Occurred</h3>
                          <p className="text-red-300 mt-2 max-w-lg">{error}</p>
                          <div className="mt-6 flex justify-center gap-4">
                              <button onClick={handleRetry} className="px-6 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg font-semibold">Try Again</button>
                              <button onClick={resetToHome} className="px-6 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg font-semibold">Start Over</button>
                          </div>
                      </div>
                  )}
              </div>
          </main>
        );
      }
  
      if (page === 'article' && param && articlesData[param as ArticleSlug]) {
        const article = articlesData[param as ArticleSlug];
        return <ArticlePage title={article.title}>{article.content}</ArticlePage>;
      }
  
      if (page === 'blog') {
          return <BlogPage />;
      }
  
      if (page === 'gallery') {
          return <GalleryPage />;
      }
  
      if (page === 'howitworks') {
          return <HowItWorksPage />;
      }
  
      if (page === 'contact') {
          return <ContactPage />;
      }
      
      const infoPageKey = page as keyof typeof infoPageData;
      if (infoPageData[infoPageKey]) {
          const info = infoPageData[infoPageKey];
          return <InfoPage title={info.title}>{info.content}</InfoPage>;
      }
  
      // Fallback to home if route is unknown, but only if it's not already home.
      // This prevents a render loop if the initial hash is bad.
      if (page !== 'home') {
          window.location.hash = 'home';
      }
      return null;
    };
  
  
    return (
      <div className="min-h-screen flex flex-col bg-slate-900 text-gray-200">
        {showApiKeyDialog && <ApiKeyDialog onContinue={handleApiKeyContinue} />}
        <Header />
        <div className="flex-grow flex flex-col">
            {renderContent()}
        </div>
        <Footer />
      </div>
    );
  }
  
  export default App;
