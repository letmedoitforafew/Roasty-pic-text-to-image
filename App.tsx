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

          <h3 className="text-2xl font-bold text-orange-400">What Exactly Is a Roast?</h3>
          <p>A roast is a lighthearted joke directed at someone in a fun, friendly way. The goal isn’t to offend but to entertain. RoastyPit captures that energy and turns it into digital entertainment.</p>

          <h3 className="text-2xl font-bold text-orange-400">From Text to Laughter: How RoastyPit Works</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li><strong>Enter your text prompt:</strong> For example, “Roast me for sleeping through my alarm again.”</li>
            <li><strong>Choose your style:</strong> Sarcastic, playful, dramatic, or celebrity-inspired.</li>
            <li><strong>Watch the magic happen:</strong> The AI creates a short, funny video you can share instantly.</li>
          </ol>

          <AdPlaceholder label="In-Article Ad" width={300} height={250} />

          <h3 className="text-2xl font-bold text-orange-400">Why AI Comedy Works So Well</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>It’s personal: Each roast is unique to your input.</li>
            <li>It’s accessible: No video skills required.</li>
            <li>It’s fast: Your words become a polished video in under a minute.</li>
            <li>It’s entertaining: The videos combine humor, expression, and energy.</li>
          </ul>

          <h3 className="text-2xl font-bold text-orange-400">How to Master the Art of the Roast</h3>
          <div className="space-y-4">
            <div>
                <h4 className="font-semibold text-white">Keep It Short and Clear</h4>
                <p>Short prompts work best. Example: “Roast me for forgetting my anniversary again.”</p>
            </div>
            <div>
                <h4 className="font-semibold text-white">Add a Personal Twist</h4>
                <p>Include something relatable. Example: “Roast me for pretending to be on a diet while ordering dessert.”</p>
            </div>
            <div>
                <h4 className="font-semibold text-white">Use Playful Language</h4>
                <p>The best roasts are clever, not cruel. Example: “Roast me for thinking one gym session equals a six-pack.”</p>
            </div>
            <div>
                <h4 className="font-semibold text-white">Experiment With Styles</h4>
                <p>Try sarcastic, dramatic, motivational, or robotic tones for different vibes.</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-orange-400">The Social Media Power of Roasts</h3>
          <p>RoastyPit videos are perfect for TikTok, Instagram, and YouTube Shorts — short, engaging, and shareable. Users create viral content by sharing relatable roasts, challenges, and meme-style videos.</p>
          <p>
            <InternalLink slug="hilarious-prompts">Learn how to write hilarious AI prompts</InternalLink> or <InternalLink slug="top-5-viral">see the top 5 viral RoastyPit videos</InternalLink>.
          </p>

          <h3 className="text-2xl font-bold text-orange-400">Conclusion: Your Words, Your Comedy, Your RoastyPit Moment</h3>
          <p>The art of roasting is evolving. With RoastyPit, you don’t need to be a stand-up comedian to make people laugh. Type a line, hit generate, and let your text become a video — one roast at a time.</p>
        </div>
      )
    },
    'hilarious-prompts': {
        title: '💡 How to Write Hilarious AI Prompts: The Secret to Viral RoastyPit Videos',
        content: (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-orange-400">Introduction: Why the Prompt Is Everything</h3>
            <p>When using RoastyPit, your text prompt is your ticket to viral comedy. The right words can transform a simple idea into a hilarious AI-generated video that entertains your audience instantly.</p>
            <ImagePlaceholder alt="Example of AI prompt for RoastyPit video" />
  
            <h3 className="text-2xl font-bold text-orange-400">What Makes a Prompt “Hilarious”?</h3>
            <p>A good prompt has three key ingredients: a clear setup, an exaggeration or twist, and relatability.</p>
  
            <h3 className="text-2xl font-bold text-orange-400">Tip 1: Start with a Situation</h3>
            <p>Provide context for your prompt. Example: “Roast me for thinking I could fix my car after one YouTube tutorial.”</p>

            <h3 className="text-2xl font-bold text-orange-400">Tip 2: Keep It Short and Snappy</h3>
            <p>Short prompts are more effective. Example: “Roast me for sleeping through every alarm.”</p>
  
            <h3 className="text-2xl font-bold text-orange-400">Tip 3: Use Everyday Humor</h3>
            <p>Make your prompts relatable: “Roast me for checking my phone every 3 seconds.”</p>
  
            <AdPlaceholder label="In-Article Ad" width={300} height={250} />

            <h3 className="text-2xl font-bold text-orange-400">Tip 4: Add Personality and Drama</h3>
            <p>Include tone or mood to make videos expressive: “Roast me like a motivational speaker who just failed a test.”</p>
  
            <h3 className="text-2xl font-bold text-orange-400">Tip 5: Experiment With Styles</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Sarcastic: “Roast me like a disappointed teacher.”</li>
              <li>Overly Dramatic: “Roast me like I lost my Wi-Fi forever.”</li>
              <li>Formal/Corporate: “Roast me as if I’m getting fired.”</li>
              <li>Romantic Comedy: “Roast me for thinking my cat is my soulmate.”</li>
            </ul>
  
            <h3 className="text-2xl font-bold text-orange-400">Tip 6: Keep It Friendly and Clean</h3>
            <p>Safe, family-friendly humor performs best online and stays AdSense-approved.</p>
  
            <h3 className="text-2xl font-bold text-orange-400">Tip 7: Use Trends to Boost Engagement</h3>
            <p>Connect prompts to popular culture or challenges to increase shares and engagement.</p>
  
            <h3 className="text-2xl font-bold text-orange-400">Conclusion: Every Great Video Starts With a Great Prompt</h3>
            <p>Creative, short, and relatable prompts are the secret to RoastyPit videos that get laughs and shares.</p>
            <p><InternalLink slug="top-5-viral">See viral video examples</InternalLink>.</p>
          </div>
        )
    },
    'top-5-viral': {
        title: '📹 Top 5 Viral Videos Made with RoastyPit',
        content: (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-orange-400">Introduction: From Text to Viral Fame</h3>
              <p>RoastyPit transforms simple text prompts into hilarious AI-generated videos. Here are the top 5 viral trends you can try yourself.</p>
              <ImagePlaceholder alt="Collage of viral RoastyPit videos" />

              <h3 className="text-2xl font-bold text-orange-400">1. Roast Me for My Gym Routine</h3>
              <p>Example: “Roast me for going to the gym once and calling myself a fitness influencer.” Perfect for relatable humor.</p>

              <h3 className="text-2xl font-bold text-orange-400">2. AI Roasts My Life Decisions</h3>
              <p>Example: “Roast me for thinking I could survive on energy drinks and optimism.” Self-deprecating humor works best.</p>

              <AdPlaceholder label="In-Article Ad" width={300} height={250} />

              <h3 className="text-2xl font-bold text-orange-400">3. Roast My Pet Like They’re a Celebrity</h3>
              <p>Example: “Roast my cat like he’s a famous actor with too much attitude.” Cute + funny = viral gold.</p>
              
              <h3 className="text-2xl font-bold text-orange-400">4. AI Roasts My Job Interview</h3>
              <p>Example: “Roast me for saying ‘I’m a people person’ at every job interview.” Perfect for office humor.</p>
              
              <h3 className="text-2xl font-bold text-orange-400">5. AI Roasts Humanity</h3>
              <p>Example: “Roast humanity like you’re an alien watching Earth.” Clever, thought-provoking, and funny.</p>
              
              <h3 className="text-2xl font-bold text-orange-400">How to Make Your RoastyPit Video Go Viral</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Start with a funny, specific prompt</li>
                <li>Keep it short (15–30 seconds)</li>
                <li>Add your reaction</li>
                <li>Use trending hashtags</li>
                <li>Post consistently</li>
              </ul>
              <p>
                <InternalLink slug="hilarious-prompts">Learn to write hilarious AI prompts</InternalLink> or <InternalLink slug="ai-in-comedy">learn how AI is shaping comedy</InternalLink>.
              </p>

              <h3 className="text-2xl font-bold text-orange-400">Conclusion: Your Words Could Be the Next Viral Hit</h3>
              <p>Type your idea, generate a RoastyPit video, and share — your next viral moment could start with a single prompt.</p>
            </div>
        )
    },
    'ai-in-comedy': {
        title: '🤖 AI in Comedy: The Future of Funny',
        content: (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-orange-400">Introduction: When Technology Learns to Be Funny</h3>
            <p>Comedy is deeply human, but AI is learning to replicate humor in creative ways. RoastyPit transforms text into funny, shareable videos with realistic expressions, timing, and tone.</p>
            <ImagePlaceholder alt="AI-generated comedy video example" />

            <h3 className="text-2xl font-bold text-orange-400">How AI Learned to Laugh</h3>
            <p>RoastyPit uses natural language processing to understand context, tone, and humor style. It converts your prompt into an AI-generated video with proper comedic timing.</p>

            <h3 className="text-2xl font-bold text-orange-400">RoastyPit: Where AI Comedy Meets Creativity</h3>
            <p>The platform allows anyone to become a creator — no editing skills needed. Videos feel natural, expressive, and personalized.</p>

            <AdPlaceholder label="In-Article Ad" width={300} height={250} />

            <h3 className="text-2xl font-bold text-orange-400">AI Comedy on Social Media</h3>
            <p>From TikTok to YouTube Shorts, AI-generated videos are gaining massive engagement, especially personalized roasts and relatable content.</p>

            <h3 className="text-2xl font-bold text-orange-400">Why AI and Comedy Are a Perfect Match</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Instant creativity</li>
              <li>Accessibility for everyone</li>
              <li>Relatability</li>
              <li>Endless potential</li>
            </ul>

            <h3 className="text-2xl font-bold text-orange-400">The Future of Funny</h3>
            <p>Expect AI personalities, interactive roasts, hybrid performances, and more sophisticated emotional understanding — all making comedy more accessible and shareable.</p>

            <h3 className="text-2xl font-bold text-orange-400">Conclusion: The Future of Laughter Is Digital</h3>
            <p>RoastyPit allows anyone to turn text into laughter. AI is amplifying creativity, making humor faster, easier, and universally shareable.</p>
            <p><InternalLink slug="behind-the-scenes">Learn how RoastyPit works</InternalLink>.</p>
          </div>
        )
    },
    'behind-the-scenes': {
        title: '🛠️ Behind the Scenes: How RoastyPit Works',
        content: (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-orange-400">Introduction: Turning Words into Videos</h3>
            <p>RoastyPit is more than a fun app — it’s a sophisticated AI platform that converts text into short, entertaining videos. This article explores the technology and process behind the laughs.</p>
            <ImagePlaceholder alt="RoastyPit AI video creation process" />

            <h3 className="text-2xl font-bold text-orange-400">Step 1: Input Your Text Prompt</h3>
            <p>Your video starts with a prompt: short, funny, and clear. Example: “Roast me like I forgot my homework again.”</p>

            <h3 className="text-2xl font-bold text-orange-400">Step 2: AI Understands Context and Tone</h3>
            <p>The AI analyzes humor style, tone, and subject matter to ensure the video feels natural and engaging.</p>

            <h3 className="text-2xl font-bold text-orange-400">Step 3: Text-to-Video Transformation</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Visual generation: Creates avatars and scenes.</li>
              <li>Voice synthesis: Natural speech with comedic timing.</li>
              <li>Expressions & gestures: Human-like performance.</li>
              <li>Video editing: Seamless final clip.</li>
            </ul>

            <AdPlaceholder label="In-Article Ad" width={300} height={250} />

            <h3 className="text-2xl font-bold text-orange-400">Step 4: Personalization and Style Options</h3>
            <p>Choose tone, character style, and background to make each video unique.</p>

            <h3 className="text-2xl font-bold text-orange-400">Step 5: Download and Share</h3>
            <p>Ready-to-share videos for TikTok, Instagram, or YouTube Shorts.</p>
            <p>
              <InternalLink slug="hilarious-prompts">Write better AI prompts</InternalLink> or <InternalLink slug="ai-in-comedy">learn about AI in comedy</InternalLink>.
            </p>

            <h3 className="text-2xl font-bold text-orange-400">The Technology That Powers RoastyPit</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>AI text analysis</li>
              <li>Text-to-speech engines</li>
              <li>Computer vision & animation</li>
              <li>Cloud processing for fast generation</li>
            </ul>

            <h3 className="text-2xl font-bold text-orange-400">Conclusion: From Text to Video, Comedy Made Easy</h3>
            <p>RoastyPit simplifies content creation, turning your ideas into funny, shareable videos with ease. AI amplifies your creativity, letting anyone make people laugh.</p>
          </div>
        )
    }
  };


  const handleGenerate = async (params: GenerateVideoParams) => {
    setAppState(AppState.LOADING);
    setErrorMessage(null);
    setLastConfig(params);

    try {
      const result = await generateVideo(params);
      setVideoUrl(result.objectUrl);
      setLastVideoObject(result.video);
      setLastVideoBlob(result.blob);
      setAppState(AppState.SUCCESS);
    } catch (e: any) {
      console.error(e);

      let displayError: React.ReactNode = `An unknown error occurred.`;
      if (typeof e === 'string') {
        displayError = e;
      } else if (e instanceof Error) {
        displayError = e.message;
      }
      setErrorMessage(displayError);
      setAppState(AppState.ERROR);
    }
  };

  const handleRetry = () => {
    if (lastConfig) {
      handleGenerate(lastConfig);
    }
  };

  const handleExtend = () => {
    if (lastVideoObject) {
      setInitialFormValues({
        ...lastConfig,
        mode: 'Extend Video' as any, // Should be GenerationMode.EXTEND_VIDEO
        prompt: '',
        inputVideoObject: lastVideoObject,
        aspectRatio: lastVideoObject.aspectRatio as any,
        resolution: Resolution.P720,
      });
      setAppState(AppState.IDLE);
      setVideoUrl(null);
      setErrorMessage(null);
    }
  };

  const handleShowDialog = (
    dialog: 'about' | 'privacy' | 'terms' | 'contact' | 'gallery' | 'howitworks',
  ) => {
    if (dialog === 'contact') {
      setShowContactPage(true);
      return;
    }
    if (dialog === 'gallery') {
      setShowGalleryPage(true);
      return;
    }
    if (dialog === 'howitworks') {
      setShowHowItWorksPage(true);
      return;
    }

    const content = {
      about: {
        title: 'About RoastyPit',
        content: <p>RoastyPit is a demo application showcasing the power of Google's Veo model for text-to-video generation. Create hilarious AI-powered roast videos and share them with the world.</p>,
      },
      privacy: {
        title: 'Privacy Policy',
        content: <p>Your privacy is important to us. We do not store any of the videos you create or the prompts you enter. All processing is done in memory and discarded after the video is generated. We do not collect any personal information.</p>,
      },
      terms: {
        title: 'Terms of Service',
        content: <p>By using RoastyPit, you agree not to create content that is harmful, offensive, or violates any laws. This is a technology demo, and the generated content is for entertainment purposes only. The user is solely responsible for the content they generate and share.</p>,
      },
    };
    setInfoDialogContent(content[dialog]);
  };
  
  const renderContent = () => {
    switch (appState) {
      case AppState.LOADING:
        return <LoadingIndicator />;
      case AppState.SUCCESS:
        if (videoUrl) {
          return (
            <VideoResult
              videoUrl={videoUrl}
              videoBlob={lastVideoBlob}
              onRetry={handleRetry}
              onNewVideo={handleNewVideo}
              onExtend={handleExtend}
              canExtend={lastConfig?.resolution === Resolution.P720 && lastConfig.mode !== 'Extend Video' as any}
            />
          );
        }
        // Fallthrough to error if no videoUrl
      case AppState.ERROR:
        return (
          <div className="text-center p-8 bg-red-900/30 rounded-2xl border border-red-500/50 max-w-2xl">
            <h2 className="text-2xl font-bold text-red-400">
              Video Generation Failed
            </h2>
            <p className="mt-2 mb-6 text-red-200">{errorMessage}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors">
                Try Again
              </button>
              <button
                onClick={handleNewVideo}
                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors">
                New Video
              </button>
            </div>
          </div>
        );
      case AppState.IDLE:
      default:
        return (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="text-center mb-8">
              <div className="inline-block relative">
                <RoastyPitLogoIcon className="w-20 h-20 text-orange-400 transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_12px_#f97316]" />
              </div>
              <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-amber-300 via-orange-500 to-red-600 bg-clip-text text-transparent mt-2">
                Generate Viral Video Roasts
              </h1>
              <p className="text-slate-400 mt-4 max-w-xl mx-auto">
                Just type what you want to roast, pick a generation mode, and hit the arrow to create your video.
              </p>
            </div>
            <div className="w-full max-w-3xl mx-auto">
              <PromptForm onGenerate={handleGenerate} initialValues={initialFormValues} />
              <p className="text-xs text-slate-500 mt-3 text-center px-4">
                Enter a prompt to start. RoastyPit is for fun, friendly roasts. Please avoid creating offensive content.
              </p>
            </div>
          </div>
        );
    }
  };

  if (activeArticle) {
    return (
      <ArticlePage title={activeArticle.title} onClose={() => setActiveArticle(null)}>
        {activeArticle.content}
      </ArticlePage>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <header className="py-4 px-8 relative z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={handleNewVideo} className="flex items-center gap-4 group" aria-label="Go to homepage">
            <RoastyPitLogoIcon className="w-10 h-10 text-orange-400 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_#f97316]" />
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-300 via-orange-500 to-red-600 bg-clip-text text-transparent">
              RoastyPit
            </h1>
          </button>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        {renderContent()}
      </main>
      <Footer onShowDialog={handleShowDialog} onShowArticle={handleShowArticle} />

      {infoDialogContent && (
        <InfoDialog
          title={infoDialogContent.title}
          onClose={() => setInfoDialogContent(null)}
        >
          {infoDialogContent.content}
        </InfoDialog>
      )}

      {showContactPage && (
        <ContactPage onClose={() => setShowContactPage(false)} />
      )}
      {showGalleryPage && (
        <GalleryPage onClose={() => setShowGalleryPage(false)} />
      )}
      {showHowItWorksPage && (
        <HowItWorksPage onClose={() => setShowHowItWorksPage(false)} />
      )}
    </div>
  );
};

export default App;