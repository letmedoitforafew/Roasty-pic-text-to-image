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
        content: <p>RoastyPit is a passion project exploring the intersection of AI and comedy, developed by Gilnetwork and its CEO Roberto Gil. We believe everyone has a funny idea, and our goal is to give you the tools to bring it to life in seconds. Using cutting-edge text-to-video technology, we turn your words into hilarious, shareable roasts.</p>
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

            <h2>5. Data Retention</h2>
            <p>We retain your information only as long as necessary to provide our services and comply with legal obligations. Text prompts and generated videos may be temporarily stored during processing but are not permanently linked to personal information unless you choose to save them.</p>

            <h2>6. Security of Your Information</h2>
            <p>We implement reasonable administrative, technical, and physical safeguards to protect your information from unauthorized access, disclosure, alteration, or destruction. However, no internet or electronic transmission is 100% secure, and we cannot guarantee absolute security.</p>
            
            <h2>7. Third-Party Services</h2>
            <p>RoastyPit may use third-party services, such as analytics or advertising platforms. These third-party services have their own privacy policies, and we encourage you to review them:</p>
            <ul>
                <li>Google Analytics: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">https://policies.google.com/privacy</a></li>
                <li>Google AdSense: <a href="https://www.google.com/policies/privacy/" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">https://www.google.com/policies/privacy/</a></li>
            </ul>
            <p>We are not responsible for the privacy practices of third-party services.</p>

            <h2>8. Children’s Privacy</h2>
            <p>RoastyPit does not knowingly collect personal information from children under the age of 13. If we become aware that we have inadvertently collected such information, we will take steps to delete it.</p>

            <h2>9. Your Privacy Rights</h2>
            <p>Depending on your location, you may have rights regarding your personal information, including:</p>
            <ul>
                <li>Accessing your data</li>
                <li>Correcting or updating your information</li>
                <li>Requesting deletion of your data</li>
                <li>Opting out of marketing communications</li>
                <li>Withdrawing consent where applicable</li>
            </ul>
            <p>To exercise any of these rights, please contact us at <a href="mailto:support@roastypit.com" className="text-orange-400 hover:underline">support@roastypit.com</a>.</p>

            <h2>10. Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time. When we make changes, we will update the “Effective Date” at the top and, where required, notify users. Continued use of RoastyPit after updates constitutes acceptance of the new terms.</p>

            <h2>11. Contact Us</h2>
            <p>If you have questions or concerns about this Privacy Policy or how we handle your information, please contact us:</p>
            <p>Email: <a href="mailto:support@roastypit.com" className="text-orange-400 hover:underline">support@roastypit.com</a></p>
            <p>Website: <a href="https://roastypit.com" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">https://roastypit.com</a></p>
        </>
    },
    'terms': {
        title: "Terms of Service",
        content: <>
            <p><strong>Effective Date:</strong> November 3, 2025</p>
            <p>Welcome to RoastyPit.com (“RoastyPit,” “we,” “our,” or “us”). By accessing or using our website and services, including our text-to-video generator, you agree to be bound by these Terms of Service (“Terms”). Please read them carefully.</p>
            <p>If you do not agree to these Terms, you may not use RoastyPit.</p>
            <h2>1. Use of RoastyPit Services</h2>
            <h3>1.1 Eligibility</h3>
            <p>You must be at least 13 years old to use our services. By using RoastyPit, you represent that you meet this age requirement.</p>
            <h3>1.2 License</h3>
            <p>RoastyPit grants you a limited, non-exclusive, non-transferable license to access and use our website and services for personal, non-commercial purposes.</p>
            <h3>1.3 Prohibited Uses</h3>
            <p>You may not:</p>
            <ul>
                <li>Violate any laws, regulations, or third-party rights.</li>
                <li>Upload or submit content that is illegal, offensive, obscene, or infringes on copyright.</li>
                <li>Attempt to disrupt, hack, or interfere with the website or its services.</li>
                <li>Use the service to generate spam, malware, or harmful content.</li>
            </ul>
            <h2>2. User Accounts</h2>
            <h3>2.1 Account Creation</h3>
            <p>Some features of RoastyPit may require account registration. You agree to provide accurate and complete information.</p>
            <h3>2.2 Account Security</h3>
            <p>You are responsible for maintaining the confidentiality of your login credentials. You agree to notify us immediately of any unauthorized use of your account.</p>
            <h3>2.3 Account Termination</h3>
            <p>We reserve the right to suspend or terminate your account for violations of these Terms or for any reason at our discretion.</p>
            <h2>3. Content Ownership and License</h2>
            <h3>3.1 User-Generated Content</h3>
            <p>You retain ownership of the text prompts you submit. By submitting content to RoastyPit, you grant us a worldwide, royalty-free, non-exclusive license to use, modify, and display your content to provide our services.</p>
            <h3>3.2 Generated Videos</h3>
            <p>Videos created through RoastyPit are provided for personal, non-commercial use unless otherwise agreed. You may share videos online or download them for personal use. Commercial use requires explicit permission from RoastyPit.</p>
            <h3>3.3 Prohibited Content</h3>
            <p>You may not submit content that:</p>
            <ul>
                <li>Infringes intellectual property rights</li>
                <li>Contains hate speech, threats, or harassment</li>
                <li>Is sexually explicit or harmful to minors</li>
            </ul>
            <h2>4. Privacy</h2>
            <p>Your use of RoastyPit is subject to our Privacy Policy, which explains how we collect, use, and protect your data. By using our services, you consent to our Privacy Policy.</p>
            <h2>5. Intellectual Property</h2>
            <p>All website content, including text, graphics, logos, videos, and software, is owned by RoastyPit or its licensors and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without prior written consent.</p>
            <h2>6. Third-Party Services</h2>
            <p>RoastyPit may use third-party services (like cloud hosting, analytics, or ads) to provide the service. These services may have their own terms and privacy policies. We are not responsible for the practices of third-party providers.</p>
            <h2>7. Disclaimer of Warranties</h2>
            <p>RoastyPit provides its services “as is” and “as available.” We do not guarantee:</p>
            <ul>
                <li>Continuous, error-free, or secure access to the website</li>
                <li>Accuracy, reliability, or suitability of generated content</li>
                <li>That the service meets all user expectations</li>
            </ul>
            <p>All use is at your own risk.</p>
            <h2>8. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, RoastyPit, its affiliates, and partners are not liable for:</p>
            <ul>
                <li>Any direct, indirect, incidental, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Any content generated through the service</li>
            </ul>
            <h2>9. Indemnification</h2>
            <p>You agree to indemnify, defend, and hold harmless RoastyPit, its affiliates, and its employees from any claims, liabilities, damages, or expenses arising from:</p>
            <ul>
                <li>Your use of the website or services</li>
                <li>Your violation of these Terms</li>
                <li>Your submission of prohibited content</li>
            </ul>
            <h2>10. Termination</h2>
            <p>We may suspend or terminate your access to RoastyPit at any time, with or without notice, for violations of these Terms or for other reasons. Sections 3, 5, 7, 8, 9, and 11 will survive termination.</p>
            <h2>11. Governing Law</h2>
            <p>These Terms are governed by the laws of the United States and the State of [Your State], without regard to conflict of law principles. Any disputes arising from these Terms or your use of RoastyPit will be resolved in the courts of [Your State].</p>
            <h2>12. Changes to Terms</h2>
            <p>We may update these Terms from time to time. Changes will be posted on this page with a revised Effective Date. Your continued use of RoastyPit after updates constitutes acceptance of the new Terms.</p>
            <h2>13. Contact Us</h2>
            <p>If you have questions or concerns about these Terms, please contact us:</p>
            <p>Email: support@roastypit.com</p>
            <p>Website: https://roastypit.com</p>
        </>
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
      let displayError = error.message || 'An unknown error occurred.';
      if (displayError.includes('API key not valid')) {
        displayError = "The provided API key is invalid. Please ensure it is correct and has the necessary permissions."
      }

      setErrorMessage(
        <>
          <p className="font-semibold">Video generation failed:</p>
          <p className="mt-1 text-sm text-red-300">
            {displayError}
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