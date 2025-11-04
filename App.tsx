/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {Video} from '@google/genai';
import React, {useCallback, useState} from 'react';
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
import InfoDialog from './components/InfoDialog';
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
  DialogType,
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
  const [showBlogPage, setShowBlogPage] = useState(false);
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

  const handleSelectArticleFromBlog = (slug: ArticleSlug) => {
    setShowBlogPage(false);
    handleShowArticle(slug);
  };

  const ImagePlaceholder: React.FC<{alt: string}> = ({alt}) => (
    <div className="w-full aspect-video bg-slate-700/50 border border-slate-600 rounded-lg flex items-center justify-center my-6">
      <span className="text-slate-400 text-sm italic">{alt}</span>
    </div>
  );

  const InternalLink: React.FC<{
    slug: keyof typeof articlesData;
    children: React.ReactNode;
  }> = ({slug, children}) => (
    <button
      onClick={() => handleShowArticle(slug)}
      className="text-orange-400 hover:underline font-semibold">
      {children}
    </button>
  );

  const articlesData = {
    'art-of-the-roast': {
      title: '🥊 The Art of the Roast: How RoastyPit Turns Words Into Comedy Gold',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-orange-400">
            Introduction: A New Era of Digital Humor
          </h3>
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
          <ImagePlaceholder alt="AI-generated roast video example" />

          <h3 className="text-2xl font-bold text-orange-400">
            What Exactly Is a Roast?
          </h3>
          <p>
            A roast is a lighthearted joke directed at someone in a fun, friendly
            way. The goal isn’t to offend but to entertain. RoastyPit captures
            that energy and turns it into digital entertainment.
          </p>

          <h3 className="text-2xl font-bold text-orange-400">
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

          <img
            src="https://placehold.co/600x300/1e293b/fb923c?text=Your+Viral+Video+Awaits"
            alt="Advertisement for RoastyPit AI video generator"
            className="mx-auto my-6 rounded-lg shadow-lg w-full"
          />

          <h3 className="text-2xl font-bold text-orange-400">
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

          <h3 className="text-2xl font-bold text-orange-400">
            How to Master the Art of the Roast
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-white">Keep It Short and Clear</h4>
              <p>
                Short prompts work best. Example: “Roast me for forgetting my
                anniversary again.”
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white">Add a Personal Twist</h4>
              <p>
                Include something relatable. Example: “Roast me for pretending to
                be on a diet while ordering dessert.”
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white">Use Playful Language</h4>
              <p>
                The best roasts are clever, not cruel. Example: “Roast me for
                thinking one gym session equals a six-pack.”
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white">Experiment With Styles</h4>
              <p>
                Try sarcastic, dramatic, motivational, or robotic tones for
                different vibes.
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-orange-400">
            The Social Media Power of Roasts
          </h3>
          <p>
            RoastyPit videos are perfect for TikTok, Instagram, and YouTube
            Shorts — short, engaging, and shareable. Users create viral content
            by sharing relatable roasts, challenges, and meme-style videos.
          </p>
          <p>
            <InternalLink slug="hilarious-prompts">
              Learn how to write hilarious AI prompts
            </InternalLink>{' '}
            or{' '}
            <InternalLink slug="top-5-viral">
              see the top 5 viral RoastyPit videos
            </InternalLink>
            .
          </p>

          <h3 className="text-2xl font-bold text-orange-400">
            Conclusion: Your Words, Your Comedy, Your RoastyPit Moment
          </h3>
          <p>
            The art of roasting is evolving. With RoastyPit, you don’t need to be
            a stand-up comedian to make people laugh. Type a line, hit generate,
            and let your text become a video — one roast at a time.
          </p>
        </div>
      ),
    },
    'hilarious-prompts': {
      title:
        '💡 How to Write Hilarious AI Prompts: The Secret to Viral RoastyPit Videos',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-orange-400">
            Introduction: Why the Prompt Is Everything
          </h3>
          <p>
            When using RoastyPit, your text prompt is your ticket to viral
            comedy. The right words can transform a simple idea into a hilarious
            AI-generated video that entertains your audience instantly.
          </p>
          <ImagePlaceholder alt="Example of AI prompt for RoastyPit video" />

          <h3 className="text-2xl font-bold text-orange-400">
            What Makes a Prompt “Hilarious”?
          </h3>
          <p>
            A good prompt has three key ingredients: a clear setup, an
            exaggeration or twist, and relatability.
          </p>

          <h3 className="text-2xl font-bold text-orange-400">
            Tip 1: Start with a Situation
          </h3>
          <p>
            Provide context for your prompt. Example: “Roast me for thinking I
            could fix my car after one YouTube tutorial.”
          </p>

          <h3 className="text-2xl font-bold text-orange-400">
            Tip 2: Keep It Short and Snappy
          </h3>
          <p>
            Short prompts are more effective. Example: “Roast me for sleeping
            through every alarm.”
          </p>

          <h3 className="text-2xl font-bold text-orange-400">
            Tip 3: Use Everyday Humor
          </h3>
          <p>
            Make your prompts relatable: “Roast me for checking my phone every 3
            seconds.”
          </p>

          <img
            src="https://placehold.co/600x300/1e293b/f97316?text=Write+a+Prompt.+Get+a+Roast."
            alt="Banner ad inviting users to try writing a prompt on RoastyPit"
            className="mx-auto my-6 rounded-lg shadow-lg w-full"
          />

          <h3 className="text-2xl font-bold text-orange-400">
            Tip 4: Add Personality and Drama
          </h3>
          <p>
            Include tone or mood to make videos expressive: “Roast me like a
            motivational speaker who just failed a test.”
          </p>

          <h3 className="text-2xl font-bold text-orange-400">
            Tip 5: Experiment With Styles
          </h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Sarcastic: “Roast me like a disappointed teacher.”</li>
            <li>Overly Dramatic: “Roast me like I lost my Wi-Fi forever.”</li>
            <li>Formal/Corporate: “Roast me as if I’m getting fired.”</li>
            <li>
              Romantic Comedy: “Roast me for thinking my cat is my soulmate.”
            </li>
          </ul>

          <h3 className="text-2xl font-bold text-orange-400">
            Tip 6: Keep It Friendly and Clean
          </h3>
          <p>
            Safe, family-friendly humor performs best online and stays
            AdSense-approved.
          </p>

          <h3 className="text-2xl font-bold text-orange-400">
            Tip 7: Use Trends to Boost Engagement
          </h3>
          <p>
            Connect prompts to popular culture or challenges to increase shares
            and engagement.
          </p>

          <h3 className="text-2xl font-bold text-orange-400">
            Conclusion: Every Great Video Starts With a Great Prompt
          </h3>
          <p>
            Creative, short, and relatable prompts are the secret to RoastyPit
            videos that get laughs and shares.
          </p>
          <p>
            <a
              href="https://roastypit.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:underline font-semibold">
              Try RoastyPit now
            </a>{' '}
            or{' '}
            <InternalLink slug="top-5-viral">
              see viral video examples
            </InternalLink>
            .
          </p>
        </div>
      ),
    },
    'top-5-viral': {
      title: '📹 Top 5 Viral Videos Made with RoastyPit',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-orange-400">
            Introduction: From Text to Viral Fame
          </h3>
          <p>
            RoastyPit transforms simple text prompts into hilarious AI-generated
            videos. Here are the top 5 viral trends you can try yourself.
          </p>
          <ImagePlaceholder alt="Collage of viral RoastyPit videos" />

          <h3 className="text-2xl font-bold text-orange-400">
            1. Roast Me for My Gym Routine
          </h3>
          <p>
            Example: “Roast me for going to the gym once and calling myself a
            fitness influencer.” Perfect for relatable humor.
          </p>

          <h3 className="text-2xl font-bold text-orange-400">
            2. AI Roasts My Life Decisions
          </h3>
          <p>
            Example: “Roast me for thinking I could survive on energy drinks and
            optimism.” Self-deprecating humor works best.
          </p>

          <h3 className="text-2xl font-bold text-orange-400">
            3. Roast My Pet Like They’re a Celebrity
          </h3>
          <p>
            Example: “Roast my cat like he’s a famous actor with too much
            attitude.” Cute + funny = viral gold.
          </p>

          <img
            src="https://placehold.co/600x300/1e293b/ea580c?text=Go+Viral.+Get+Roasted."
            alt="Advertisement displaying a collage of viral videos made with RoastyPit"
            className="mx-auto my-6 rounded-lg shadow-lg w-full"
          />

          <h3 className="text-2xl font-bold text-orange-400">
            4. AI Roasts My Job Interview
          </h3>
          <p>
            Example: “Roast me for saying ‘I’m a people person’ at every job
            interview.” Perfect for office humor.
          </p>

          <h3 className="text-2xl font-bold text-orange-400">
            5. AI Roasts Humanity
          </h3>
          <p>
            Example: “Roast humanity like you’re an alien watching Earth.”
            Clever, thought-provoking, and funny.
          </p>

          <h3 className="text-2xl font-bold text-orange-400">
            How to Make Your RoastyPit Video Go Viral
          </h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Start with a funny, specific prompt</li>
            <li>Keep it short (15–30 seconds)</li>
            <li>Add your reaction</li>
            <li>Use trending hashtags</li>
            <li>Post consistently</li>
          </ul>
          <p>
            <InternalLink slug="hilarious-prompts">
              Learn to write hilarious AI prompts
            </InternalLink>{' '}
            or{' '}
            <InternalLink slug="ai-in-comedy">
              learn how AI is shaping comedy
            </InternalLink>
            .
          </p>

          <h3 className="text-2xl font-bold text-orange-400">
            Conclusion: Your Words Could Be the Next Viral Hit
          </h3>
          <p>
            Type your idea, generate a RoastyPit video, and share — your next
            viral moment could start with a single prompt.
          </p>
        </div>
      ),
    },
    'ai-in-comedy': {
      title: '🤖 AI in Comedy: The Future of Funny',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-orange-400">
            Introduction: When Technology Learns to Be Funny
          </h3>
          <p>
            Comedy is deeply human, but AI is learning to replicate humor in
            creative ways. RoastyPit transforms text into funny, shareable videos
            with realistic expressions, timing, and tone.
          </p>
          <ImagePlaceholder alt="AI-generated comedy video example" />

          <h3 className="text-2xl font-bold text-orange-400">
            How AI Learned to Laugh
          </h3>
          <p>
            RoastyPit uses natural language processing to understand context,
            tone, and humor style. It converts your prompt into an AI-generated
            video with proper comedic timing.
          </p>

          <h3 className="text-2xl font-bold text-orange-400">
            RoastyPit: Where AI Comedy Meets Creativity
          </h3>
          <p>
            The platform allows anyone to become a creator — no editing skills
            needed. Videos feel natural, expressive, and personalized.
          </p>

          <img
            src="https://placehold.co/600x300/1e293b/d97706?text=The+Future+of+Funny+is+Here."
            alt="Promotional image for RoastyPit explaining AI in comedy"
            className="mx-auto my-6 rounded-lg shadow-lg w-full"
          />

          <h3 className="text-2xl font-bold text-orange-400">
            AI Comedy on Social Media
          </h3>
          <p>
            From TikTok to YouTube Shorts, AI-generated videos are gaining
            massive engagement, especially personalized roasts and relatable
            content.
          </p>

          <h3 className="text-2xl font-bold text-orange-400">
            Why AI and Comedy Are a Perfect Match
          </h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Instant creativity</li>
            <li>Accessibility for everyone</li>
            <li>Relatability</li>
            <li>Endless potential</li>
          </ul>

          <h3 className="text-2xl font-bold text-orange-400">
            The Future of Funny
          </h3>
          <p>
            Expect AI personalities, interactive roasts, hybrid performances, and
            more sophisticated emotional understanding — all making comedy more
            accessible and shareable.
          </p>
          <p>
            <InternalLink slug="behind-the-scenes">
              Learn how RoastyPit works
            </InternalLink>{' '}
            or{' '}
            <a
              href="https://roastypit.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:underline font-semibold">
              try RoastyPit now
            </a>
            .
          </p>

          <h3 className="text-2xl font-bold text-orange-400">
            Conclusion: The Future of Laughter Is Digital
          </h3>
          <p>
            RoastyPit allows anyone to turn text into laughter. AI is amplifying
            creativity, making humor faster, easier, and universally shareable.
          </p>
        </div>
      ),
    },
    'behind-the-scenes': {
      title: '🛠️ Behind the Scenes: How RoastyPit Works',
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-orange-400">
            Introduction: Turning Words into Videos
          </h3>
          <p>
            RoastyPit is more than a fun app — it’s a sophisticated AI platform
            that converts text into short, entertaining videos. This article
            explores the technology and process behind the laughs.
          </p>
          <ImagePlaceholder alt="RoastyPit AI video creation process" />

          <h3 className="text-2xl font-bold text-orange-400">
            Step 1: Input Your Text Prompt
          </h3>
          <p>
            Your video starts with a prompt: short, funny, and clear. Example:
            “Roast me like I forgot my homework again.”
          </p>

          <h3 className="text-2xl font-bold text-orange-400">
            Step 2: AI Understands Context and Tone
          </h3>
          <p>
            The AI analyzes humor style, tone, and subject matter to ensure the
            video feels natural and engaging.
          </p>

          <img
            src="https://placehold.co/600x300/1e293b/b45309?text=Simple+Interface.+Powerful+AI."
            alt="Ad showing the RoastyPit interface and easy video creation"
            className="mx-auto my-6 rounded-lg shadow-lg w-full"
          />

          <h3 className="text-2xl font-bold text-orange-400">
            Step 3: Text-to-Video Transformation
          </h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Visual generation: Creates avatars and scenes.</li>
            <li>Voice synthesis: Natural speech with comedic timing.</li>
            <li>Expressions & gestures: Human-like performance.</li>
            <li>Video editing: Seamless final clip.</li>
          </ul>

          <h3 className="text-2xl font-bold text-orange-400">
            The Technology That Powers RoastyPit
          </h3>
          <ul className="list-disc list-inside space-y-2">
            <li>AI text analysis</li>
            <li>Text-to-speech engines</li>
            <li>Computer vision & animation</li>
            <li>Cloud processing for fast generation</li>
          </ul>
          <p>
            <InternalLink slug="hilarious-prompts">
              Write better AI prompts
            </InternalLink>{' '}
            or{' '}
            <InternalLink slug="ai-in-comedy">
              learn about AI in comedy
            </InternalLink>
            .
          </p>

          <h3 className="text-2xl font-bold text-orange-400">
            Conclusion: From Text to Video, Comedy Made Easy
          </h3>
          <p>
            RoastyPit simplifies content creation, turning your ideas into funny,
            shareable videos with ease. AI amplifies your creativity, letting
            anyone make people laugh.
          </p>
        </div>
      ),
    },
  };

  const handleTryAgain = useCallback(() => {
    if (lastConfig) {
      setInitialFormValues(lastConfig);
      setAppState(AppState.IDLE);
      setVideoUrl(null);
      setErrorMessage(null);
    }
  }, [lastConfig]);

  const handleSubmit = useCallback(async (params: GenerateVideoParams) => {
    setAppState(AppState.LOADING);
    setErrorMessage(null);
    setVideoUrl(null);
    setLastConfig(params);

    try {
      const {objectUrl, blob, video} = await generateVideo(params);
      setVideoUrl(objectUrl);
      setLastVideoBlob(blob);
      setLastVideoObject(video);
      setAppState(AppState.SUCCESS);
    } catch (error: unknown) {
      console.error('Video generation failed:', error);
      let message = 'An unexpected error occurred during generation.';
      if (error instanceof Error) {
        message = error.message;
        if (message.includes('Requested entity was not found')) {
          message =
            'The site API key is invalid or missing required permissions. Please contact the site administrator.';
        }
      }
      setErrorMessage(
        <>
          <strong>Video generation failed:</strong> {message}
        </>,
      );
      setAppState(AppState.ERROR);
    }
  }, []);

  const handleExtend = useCallback(() => {
    if (lastConfig && lastVideoObject) {
      const extendConfig: GenerateVideoParams = {
        ...lastConfig,
        mode: GenerationMode.EXTEND_VIDEO,
        prompt: '',
        inputVideoObject: lastVideoObject,
        startFrame: null,
        endFrame: null,
        referenceImages: [],
        styleImage: null,
        isLooping: false,
      };
      setInitialFormValues(extendConfig);
      setAppState(AppState.IDLE);
      setVideoUrl(null);
      setErrorMessage(null);
    }
  }, [lastConfig, lastVideoObject]);

  const handleShowDialog = useCallback(
    (dialog: DialogType) => {
      if (dialog === 'contact') {
        setShowContactPage(true);
      } else if (dialog === 'gallery') {
        setShowGalleryPage(true);
      } else if (dialog === 'howitworks') {
        setShowHowItWorksPage(true);
      } else if (dialog === 'about') {
        setInfoDialogContent({
          title: 'About RoastyPit',
          content: (
            <p>
              RoastyPit is a demo application showcasing the power of Google's
              Veo model for text-to-video generation. Create hilarious roasts and
              share them with your friends!
            </p>
          ),
        });
      } else if (dialog === 'privacy') {
        setInfoDialogContent({
          title: 'Privacy Policy',
          content: (
            <div className="space-y-4 text-sm">
              <p>
                <strong>Effective Date:</strong> November 3, 2025
              </p>
              <p>
                RoastyPit (“we,” “our,” or “us”) respects your privacy and is
                committed to protecting your personal information. This Privacy
                Policy explains how we collect, use, and safeguard information
                when you visit or use our website, <strong>RoastyPit.com</strong>, a
                text-to-video generator platform. By using our website, you
                agree to the terms of this Privacy Policy.
              </p>

              <h3 className="text-lg font-semibold text-white pt-2">
                1. Information We Collect
              </h3>
              <p>
                When you use RoastyPit, we may collect the following types of
                information:
              </p>
              <h4 className="font-semibold text-white pl-4">
                a. Personal Information
              </h4>
              <ul className="list-disc list-inside pl-6">
                <li>
                  <strong>Optional registration information:</strong> If you
                  create an account, we may collect your name, email address,
                  and password.
                </li>
                <li>
                  <strong>User-generated content:</strong> Text prompts you
                  submit to generate videos may be stored temporarily for
                  processing.
                </li>
              </ul>
              <h4 className="font-semibold text-white pl-4">
                b. Non-Personal Information
              </h4>
              <ul className="list-disc list-inside pl-6">
                <li>
                  <strong>Browser and device information:</strong> IP address,
                  browser type, operating system, device type, and language.
                </li>
                <li>
                  <strong>Usage data:</strong> Pages visited, time spent on
                  pages, interactions with our service, and video generation
                  activity.
                </li>
                <li>
                  <strong>Cookies and tracking technologies:</strong> Used to
                  enhance user experience, personalize content, and analyze
                  site traffic.
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-white pt-2">
                2. How We Use Your Information
              </h3>
              <p>
                We use the collected information for the following purposes:
              </p>
              <ol className="list-decimal list-inside pl-6">
                <li>
                  To provide and improve our text-to-video generator services.
                </li>
                <li>
                  To process and store text prompts temporarily to generate
                  videos.
                </li>
                <li>
                  To communicate with you about your account or service updates.
                </li>
                <li>To analyze user behavior and improve website performance.</li>
                <li>To personalize content and display relevant features.</li>
                <li>
                  To comply with legal obligations and prevent fraudulent
                  activity.
                </li>
              </ol>

              <h3 className="text-lg font-semibold text-white pt-2">
                3. Sharing Your Information
              </h3>
              <p>
                We do <strong>not sell, trade, or rent</strong> your personal
                information. We may share information in the following cases:
              </p>
              <ul className="list-disc list-inside pl-6">
                <li>
                  <strong>Service Providers:</strong> We may share data with
                  trusted third-party providers who assist in operating our
                  website and services, such as cloud hosting, analytics, and
                  email communication.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose
                  information if required by law, court order, or government
                  regulation.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In the event of a merger,
                  acquisition, or sale of assets, your data may be transferred
                  as part of the business assets.
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-white pt-2">
                4. Cookies and Tracking Technologies
              </h3>
              <p>
                RoastyPit uses cookies and similar tracking technologies to
                improve your browsing experience, analyze trends, and understand
                how users interact with our website. You can disable cookies in
                your browser settings, but some features may not function
                properly.
              </p>

              <h3 className="text-lg font-semibold text-white pt-2">
                5. Data Retention
              </h3>
              <p>
                We retain your information only as long as necessary to provide
                our services and comply with legal obligations. Text prompts and
                generated videos may be temporarily stored during processing but
                are not permanently linked to personal information unless you
                choose to save them.
              </p>

              <h3 className="text-lg font-semibold text-white pt-2">
                6. Security of Your Information
              </h3>
              <p>
                We implement reasonable administrative, technical, and physical
                safeguards to protect your information from unauthorized access,
                disclosure, alteration, or destruction. However, no internet or
                electronic transmission is 100% secure, and we cannot guarantee
                absolute security.
              </p>

              <h3 className="text-lg font-semibold text-white pt-2">
                7. Third-Party Services
              </h3>
              <p>
                RoastyPit may use third-party services, such as analytics or
                advertising platforms. These third-party services have their own
                privacy policies, and we encourage you to review them.
              </p>

              <h3 className="text-lg font-semibold text-white pt-2">
                8. Children’s Privacy
              </h3>
              <p>
                RoastyPit does{' '}
                <strong>
                  not knowingly collect personal information from children under
                  the age of 13
                </strong>
                . If we become aware that we have inadvertently collected such
                information, we will take steps to delete it.
              </p>

              <h3 className="text-lg font-semibold text-white pt-2">
                9. Your Privacy Rights
              </h3>
              <p>
                Depending on your location, you may have rights regarding your
                personal information. To exercise any of these rights, please
                contact us at{' '}
                <a
                  href="mailto:support@roastypit.com"
                  className="text-orange-400 hover:underline">
                  support@roastypit.com
                </a>
                .
              </p>

              <h3 className="text-lg font-semibold text-white pt-2">
                10. Changes to This Privacy Policy
              </h3>
              <p>
                We may update this Privacy Policy from time to time. When we
                make changes, we will update the <strong>“Effective Date”</strong>{' '}
                at the top and, where required, notify users.
              </p>

              <h3 className="text-lg font-semibold text-white pt-2">
                11. Contact Us
              </h3>
              <p>
                If you have questions or concerns, please contact us at{' '}
                <a
                  href="mailto:support@roastypit.com"
                  className="text-orange-400 hover:underline">
                  support@roastypit.com
                </a>
                .
              </p>
            </div>
          ),
        });
      } else if (dialog === 'terms') {
        setInfoDialogContent({
          title: 'Terms of Service',
          content: (
            <div className="space-y-4 text-sm">
            <p>
              <strong>Effective Date:</strong> November 3, 2025
            </p>
            <p>
              Welcome to RoastyPit.com (“RoastyPit,” “we,” “our,” or “us”). By
              accessing or using our website and services, including our
              text-to-video generator, you agree to be bound by these Terms of
              Service (“Terms”). Please read them carefully.
            </p>

            <h3 className="text-lg font-semibold text-white pt-2">
              1. Use of RoastyPit Services
            </h3>
            <ul className="list-disc list-inside pl-4">
              <li>
                <strong>Eligibility:</strong> You must be at least 13 years old
                to use our services.
              </li>
              <li>
                <strong>License:</strong> RoastyPit grants you a limited,
                non-exclusive, non-transferable license to access and use our
                website and services for personal, non-commercial purposes.
              </li>
              <li>
                <strong>Prohibited Uses:</strong> You may not violate laws,
                submit offensive content, or interfere with the website.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-white pt-2">
              2. User Accounts
            </h3>
            <p>
              You are responsible for maintaining the confidentiality of your
              login credentials and for all activities that occur under your
              account. We reserve the right to suspend or terminate your
              account for violations of these Terms.
            </p>

            <h3 className="text-lg font-semibold text-white pt-2">
              3. Content Ownership and License
            </h3>
            <p>
              You retain ownership of the text prompts you submit. By
              submitting content, you grant us a worldwide, royalty-free
              license to use your content to provide our services. Videos
              generated are for personal, non-commercial use only.
            </p>

            <h3 className="text-lg font-semibold text-white pt-2">
              4. Privacy
            </h3>
            <p>
              Your use of RoastyPit is subject to our Privacy Policy. By using
              our services, you consent to our Privacy Policy.
            </p>

            <h3 className="text-lg font-semibold text-white pt-2">
              5. Intellectual Property
            </h3>
            <p>
              All website content, including text, graphics, logos, and
              software, is owned by RoastyPit and protected by copyright laws.
            </p>

            <h3 className="text-lg font-semibold text-white pt-2">
              6. Disclaimer of Warranties
            </h3>
            <p>
              RoastyPit provides its services “as is.” We do not guarantee
              continuous, error-free, or secure access to the website.
            </p>

            <h3 className="text-lg font-semibold text-white pt-2">
              7. Limitation of Liability
            </h3>
            <p>
              To the maximum extent permitted by law, RoastyPit is not liable
              for any direct, indirect, or consequential damages arising from
              your use of the service.
            </p>

            <h3 className="text-lg font-semibold text-white pt-2">
              8. Indemnification
            </h3>
            <p>
              You agree to indemnify and hold harmless RoastyPit from any
              claims arising from your use of the website or violation of
              these Terms.
            </p>

            <h3 className="text-lg font-semibold text-white pt-2">
              9. Termination
            </h3>
            <p>
              We may suspend or terminate your access to RoastyPit at any
              time, with or without notice, for violations of these Terms.
            </p>

            <h3 className="text-lg font-semibold text-white pt-2">
              10. Governing Law
            </h3>
            <p>
              These Terms are governed by the laws of the United States and the
              State of <strong>[Your State]</strong>.
            </p>

            <h3 className="text-lg font-semibold text-white pt-2">
              11. Changes to Terms
            </h3>
            <p>
              We may update these Terms from time to time. Your continued use
              of RoastyPit after updates constitutes acceptance of the new
              Terms.
            </p>

            <h3 className="text-lg font-semibold text-white pt-2">
              12. Contact Us
            </h3>
            <p>
              If you have questions, please contact us at{' '}
              <a
                href="mailto:support@roastypit.com"
                className="text-orange-400 hover:underline">
                support@roastypit.com
              </a>
              .
            </p>
          </div>
          ),
        });
      }
    },
    [],
  );

  const handleShowBlog = () => {
    setShowBlogPage(true);
  };

  const mainContent = (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white">
      <Header
        onLogoClick={handleNewVideo}
        onShowBlog={handleShowBlog}
        onShowDialog={handleShowDialog}
      />
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8">
        {
          {
            [AppState.IDLE]: (
              <div className="flex flex-col items-center text-center w-full max-w-4xl animate-fade-in">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-amber-300 via-orange-500 to-red-600 bg-clip-text text-transparent mb-3">
                  Generate Viral Video Roasts
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-left w-full">
                  <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-4 flex flex-col gap-2 transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_8px_#f97316]">
                    <div className="flex items-center gap-3">
                      <TextModeIcon className="w-6 h-6 text-orange-400 shrink-0" />
                      <h3 className="font-semibold text-white">
                        <span className="font-bold">1.</span> Type a Roast Prompt
                      </h3>
                    </div>
                    <p className="text-sm text-slate-400 pl-9">
                      Describe what you want, be creative.
                    </p>
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-4 flex flex-col gap-2 transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_8px_#f97316]">
                    <div className="flex items-center gap-3">
                      <SlidersHorizontalIcon className="w-6 h-6 text-orange-400 shrink-0" />
                      <h3 className="font-semibold text-white">
                        <span className="font-bold">2.</span> Choose Your Settings
                      </h3>
                    </div>
                    <p className="text-sm text-slate-400 pl-9">
                      Pick the model, aspect ratio, resolution.
                    </p>
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-4 flex flex-col gap-2 transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_8px_#f97316]">
                    <div className="flex items-center gap-3">
                      <ArrowRightIcon className="w-6 h-6 text-orange-400 shrink-0" />
                      <h3 className="font-semibold text-white">
                        <span className="font-bold">3.</span> Generate Your Video
                      </h3>
                    </div>
                    <p className="text-sm text-slate-400 pl-9">
                      Click the button and watch the magic.
                    </p>
                  </div>
                </div>
                <PromptForm
                  onGenerate={handleSubmit}
                  initialValues={initialFormValues}
                />
                <p className="text-xs text-slate-500 mt-4 max-w-xl">
                  Type a prompt and choose your settings. RoastyPit is for fun,
                  friendly roasts only—keep it creative, not cruel. Your content
                  must follow our terms of service.
                </p>
              </div>
            ),
            [AppState.LOADING]: <LoadingIndicator />,
            [AppState.SUCCESS]: videoUrl ? (
              <VideoResult
                videoUrl={videoUrl}
                videoBlob={lastVideoBlob}
                onRetry={handleTryAgain}
                onNewVideo={handleNewVideo}
                onExtend={handleExtend}
                canExtend={lastConfig?.resolution === Resolution.P720}
              />
            ) : null,
            [AppState.ERROR]: (
              <div className="text-center p-8 bg-red-900/30 rounded-2xl border border-red-500/50 max-w-2xl w-full">
                <h2 className="text-2xl font-bold text-red-400">
                  Oh no! Something went wrong.
                </h2>
                <div className="mt-4 text-red-200">{errorMessage}</div>
                <div className="mt-8 flex justify-center gap-4">
                  <button
                    onClick={handleTryAgain}
                    className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold">
                    Try Again
                  </button>
                  <button
                    onClick={handleNewVideo}
                    className="px-6 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold">
                    Start Over
                  </button>
                </div>
              </div>
            ),
          }[appState]
        }
      </main>
      <Footer onShowDialog={handleShowDialog} onShowArticle={handleShowArticle} />
    </div>
  );

  if (activeArticle) {
    return (
      <ArticlePage
        title={activeArticle.title}
        onClose={() => setActiveArticle(null)}
        onShowDialog={handleShowDialog}
        onShowBlog={handleShowBlog}
      >
        {activeArticle.content}
      </ArticlePage>
    );
  }

  return (
    <>
      {mainContent}

      {infoDialogContent && (
        <InfoDialog
          title={infoDialogContent.title}
          onClose={() => setInfoDialogContent(null)}>
          {infoDialogContent.content}
        </InfoDialog>
      )}
      {showContactPage && <ContactPage onClose={() => setShowContactPage(false)} />}
      {showGalleryPage && <GalleryPage onClose={() => setShowGalleryPage(false)} />}
      {showHowItWorksPage && (
        <HowItWorksPage onClose={() => setShowHowItWorksPage(false)} />
      )}
      {showBlogPage && (
        <BlogPage
          onClose={() => setShowBlogPage(false)}
          onSelectArticle={handleSelectArticleFromBlog}
        />
      )}
    </>
  );
};

export default App;