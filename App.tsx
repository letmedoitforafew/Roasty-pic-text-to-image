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
import {
  ArrowRightIcon,
  SlidersHorizontalIcon,
  TextModeIcon,
} from './components/icons';
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

  const handleSubmit = useCallback(async (params: GenerateVideoParams) => {
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
        message = e.message;
      }
      setErrorMessage(
        <>
          <p className="font-semibold">Video generation failed.</p>
          <p className="text-sm text-red-300 mt-1">{message}</p>
        </>,
      );
      setAppState(AppState.ERROR);
    }
  }, []);

  const handleTryAgain = useCallback(() => {
    if (lastConfig) {
      setInitialFormValues(lastConfig);
      setAppState(AppState.IDLE);
      setErrorMessage(null);
      window.location.hash = '#home';
    }
  }, [lastConfig]);

  const handleExtend = useCallback(() => {
    if (lastConfig && lastVideoObject && lastVideoBlob) {
      const newConfig: GenerateVideoParams = {
        ...lastConfig,
        mode: 'Extend Video',
        inputVideoObject: lastVideoObject,
        prompt: '',
      };
      setInitialFormValues(newConfig);
      setAppState(AppState.IDLE);
      setErrorMessage(null);
      window.location.hash = '#home';
    }
  }, [lastConfig, lastVideoObject, lastVideoBlob]);

  // --- Article and Page Content ---
  const InternalLink: React.FC<{
    slug: ArticleSlug;
    children: React.ReactNode;
  }> = ({slug, children}) => (
    <a
      href={`#article/${slug}`}
      className="text-orange-400 hover:underline font-semibold">
      {children}
    </a>
  );

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

          <img
            src="https://placehold.co/600x300/1e293b/fb923c?text=Your+Viral+Video+Awaits"
            alt="Advertisement for RoastyPit AI video generator"
            className="mx-auto my-6 rounded-lg shadow-lg w-full"
          />

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

          <h3 className="text-2xl font-bold text-orange-400 pt-4">
            How to Master the Art of the Roast
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-700/30 rounded-lg">
              <h4 className="font-semibold text-white">Keep It Short and Clear</h4>
              <p>
                Short prompts work best. Example: “Roast me for forgetting my
                anniversary again.”
              </p>
            </div>
            <div className="p-4 bg-slate-700/30 rounded-lg">
              <h4 className="font-semibold text-white">Add a Personal Twist</h4>
              <p>
                Include something relatable. Example: “Roast me for pretending to
                be on a diet while ordering dessert.”
              </p>
            </div>
            <div className="p-4 bg-slate-700/30 rounded-lg">
              <h4 className="font-semibold text-white">Use Playful Language</h4>
              <p>
                The best roasts are clever, not cruel. Example: “Roast me for
                thinking one gym session equals a six-pack.”
              </p>
            </div>
            <div className="p-4 bg-slate-700/30 rounded-lg">
              <h4 className="font-semibold text-white">Experiment With Styles</h4>
              <p>
                Try sarcastic, dramatic, motivational, or robotic tones for
                different vibes.
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-orange-400 pt-4">
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

          <h3 className="text-2xl font-bold text-orange-400 pt-4">
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

          <h3 className="text-2xl font-bold text-orange-400 pt-4">
            Tip 2: Keep It Short and Snappy
          </h3>
          <p>
            Short prompts are more effective. Example: “Roast me for sleeping
            through every alarm.”
          </p>

          <h3 className="text-2xl font-bold text-orange-400 pt-4">
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

          <h3 className="text-2xl font-bold text-orange-400 pt-4">
            Tip 4: Add Personality and Drama
          </h3>
          <p>
            Include tone or mood to make videos expressive: “Roast me like a
            motivational speaker who just failed a test.”
          </p>

          <h3 className="text-2xl font-bold text-orange-400 pt-4">
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

          <h3 className="text-2xl font-bold text-orange-400 pt-4">
            Tip 6: Keep It Friendly and Clean
          </h3>
          <p>
            Safe, family-friendly humor performs best online and stays
            AdSense-approved.
          </p>

          <h3 className="text-2xl font-bold text-orange-400 pt-4">
            Tip 7: Use Trends to Boost Engagement
          </h3>
          <p>
            Connect prompts to popular culture or challenges to increase shares
            and engagement.
          </p>

          <h3 className="text-2xl font-bold text-orange-400 pt-4">
            Conclusion: Every Great Video Starts With a Great Prompt
          </h3>
          <p>
            Creative, short, and relatable prompts are the secret to RoastyPit
            videos that get laughs and shares.
          </p>
          <p>
            <a
              href="#home"
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

          <h3 className="text-2xl font-bold text-orange-400 pt-4">
            2. AI Roasts My Life Decisions
          </h3>
          <p>
            Example: “Roast me for thinking I could survive on energy drinks and
            optimism.” Self-deprecating humor works best.
          </p>

          <h3 className="text-2xl font-bold text-orange-400 pt-4">
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

          <h3 className="text-2xl font-bold text-orange-400 pt-4">
            4. AI Roasts My Job Interview
          </h3>
          <p>
            Example: “Roast me for saying ‘I’m a people person’ at every job
            interview.” Perfect for office humor.
          </p>

          <h3 className="text-2xl font-bold text-orange-400 pt-4">
            5. AI Roasts Humanity
          </h3>
          <p>
            Example: “Roast humanity like you’re an alien watching Earth.”
            Clever, thought-provoking, and funny.
          </p>

          <h3 className="text-2xl font-bold text-orange-400 pt-4">
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

          <h3 className="text-2xl font-bold text-orange-400 pt-4">
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

          <h3 className="text-2xl font-bold text-orange-400 pt-4">
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

          <h3 className="text-2xl font-bold text-orange-400 pt-4">
            AI Comedy on Social Media
          </h3>
          <p>
            From TikTok to YouTube Shorts, AI-generated videos are gaining
            massive engagement, especially personalized roasts and relatable
            content.
          </p>

          <h3 className="text-2xl font-bold text-orange-400 pt-4">
            Why AI and Comedy Are a Perfect Match
          </h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Instant creativity</li>
            <li>Accessibility for everyone</li>
            <li>Relatability</li>
            <li>Endless potential</li>
          </ul>

          <h3 className="text-2xl font-bold text-orange-400 pt-4">
            The Future of Funny
          </h3>
          <p>
            Expect AI personalities, interactive roasts, hybrid performances, and
            more sophisticated emotional understanding — all making comedy more
            accessible and shareable.
          </p>
          <h3 className="text-2xl font-bold text-orange-400 pt-4">
            Conclusion: The Future of Laughter Is Digital
          </h3>
          <p>
            RoastyPit allows anyone to turn text into laughter. AI is amplifying
            creativity, making humor faster, easier, and universally shareable.
          </p>
          <p>
            <InternalLink slug="behind-the-scenes">
              Learn how RoastyPit works
            </InternalLink>{' '}
            or{' '}
            <a
              href="#home"
              className="text-orange-400 hover:underline font-semibold">
              Try RoastyPit now
            </a>
            .
          </p>
        </div>
      ),
    },
    'behind-the-scenes': {
      title: 'Behind the Scenes: How RoastyPit Turns Text Into AI Videos',
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
          <h3 className="text-2xl font-bold text-orange-400 pt-4">
            Step 2: AI Understands Context and Tone
          </h3>
          <p>
            The AI analyzes humor style, tone, and subject matter to ensure the
            video feels natural and engaging.
          </p>
          <h3 className="text-2xl font-bold text-orange-400 pt-4">
            Step 3: Text-to-Video Transformation
          </h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Visual generation: Creates avatars and scenes.</li>
            <li>Voice synthesis: Natural speech with comedic timing.</li>
            <li>Expressions & gestures: Human-like performance.</li>
            <li>Video editing: Seamless final clip.</li>
          </ul>

          <img
            src="https://placehold.co/600x300/1e293b/b45309?text=From+Text+to+Magic"
            alt="Infographic showing the transformation from text to video"
            className="mx-auto my-6 rounded-lg shadow-lg w-full"
          />

          <h3 className="text-2xl font-bold text-orange-400 pt-4">
            Step 4: Personalization and Style Options
          </h3>
          <p>
            Choose tone, character style, and background to make each video
            unique.
          </p>
          <h3 className="text-2xl font-bold text-orange-400 pt-4">
            Step 5: Download and Share
          </h3>
          <p>
            Ready-to-share videos for TikTok, Instagram, or YouTube Shorts.
          </p>
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
          <h3 className="text-2xl font-bold text-orange-400 pt-4">
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
  
  const aboutContent = (
      <div className="space-y-4">
        <p>
          RoastyPit is a next-generation text-to-video generator that turns your
          ideas into hilarious, shareable AI videos. Powered by Google's Veo
          model, our platform makes it easy for anyone to create funny content in
          seconds — no editing skills required.
        </p>
        <p>
          Our mission is to blend cutting-edge AI with the timeless art of comedy,
          giving creators, marketers, and everyday users a new way to express
          themselves. Whether you're roasting a friend, creating viral content for
          social media, or just having fun, RoastyPit is your creative partner.
        </p>
        <p>
          We believe in responsible, positive humor. Our tool is designed to be
          clever, not cruel, ensuring a fun and safe experience for everyone.
        </p>
      </div>
  );

  const privacyContent = (
      <div className="space-y-6">
          <p className="italic">Effective Date: November 3, 2025</p>
          <p>RoastyPit (“we,” “our,” or “us”) respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard information when you visit or use our website, <strong>RoastyPit.com</strong>, a text-to-video generator platform. By using our website, you agree to the terms of this Privacy Policy.</p>

          <h3 className="text-xl font-bold text-orange-400 pt-2">1. Information We Collect</h3>
          <p><strong>a. Personal Information:</strong> Optional registration information (name, email, password) and user-generated content (text prompts) may be collected.</p>
          <p><strong>b. Non-Personal Information:</strong> Browser/device info (IP address, OS), usage data (pages visited, interactions), and cookies.</p>

          <h3 className="text-xl font-bold text-orange-400 pt-2">2. How We Use Your Information</h3>
          <p>We use information to provide and improve our services, process prompts, communicate with you, analyze user behavior, and comply with legal obligations.</p>

          <h3 className="text-xl font-bold text-orange-400 pt-2">3. Sharing Your Information</h3>
          <p>We do <strong>not</strong> sell, trade, or rent your personal information. We may share data with trusted third-party service providers (e.g., cloud hosting) or if required by law.</p>

          <h3 className="text-xl font-bold text-orange-400 pt-2">4. Cookies and Tracking Technologies</h3>
          <p>We use cookies to enhance user experience and analyze site traffic. You can disable cookies in your browser settings.</p>

          <h3 className="text-xl font-bold text-orange-400 pt-2">5. Data Retention & Security</h3>
          <p>We retain your information only as long as necessary and implement reasonable safeguards to protect it. However, no internet transmission is 100% secure.</p>

          <h3 className="text-xl font-bold text-orange-400 pt-2">6. Children’s Privacy</h3>
          <p>RoastyPit does not knowingly collect personal information from children under the age of 13.</p>

          <h3 className="text-xl font-bold text-orange-400 pt-2">7. Contact Us</h3>
          <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:support@roastypit.com" className="text-orange-400 hover:underline">support@roastypit.com</a>.</p>
      </div>
  );
  
  const termsContent = (
      <div className="space-y-6">
          <p className="italic">Effective Date: November 3, 2025</p>
          <p>Welcome to RoastyPit.com. By accessing or using our website and services, you agree to be bound by these Terms of Service (“Terms”).</p>
          
          <h3 className="text-xl font-bold text-orange-400 pt-2">1. Use of Services</h3>
          <p>You must be at least 13 years old. You are granted a limited, non-exclusive license for personal, non-commercial use. You may not use our service for illegal purposes, submit offensive content, or attempt to disrupt the platform.</p>

          <h3 className="text-xl font-bold text-orange-400 pt-2">2. Content Ownership</h3>
          <p>You retain ownership of your text prompts. By submitting content, you grant us a license to use it to provide our services. Videos generated are for personal, non-commercial use unless otherwise agreed.</p>

          <h3 className="text-xl font-bold text-orange-400 pt-2">3. Disclaimer of Warranties</h3>
          <p>Our services are provided “as is.” We do not guarantee continuous, error-free access or the accuracy of generated content. All use is at your own risk.</p>

          <h3 className="text-xl font-bold text-orange-400 pt-2">4. Limitation of Liability</h3>
          <p>To the maximum extent permitted by law, RoastyPit is not liable for any direct, indirect, or consequential damages arising from your use of the service.</p>

          <h3 className="text-xl font-bold text-orange-400 pt-2">5. Changes to Terms</h3>
          <p>We may update these Terms from time to time. Your continued use of RoastyPit after updates constitutes acceptance of the new Terms.</p>
          
          <h3 className="text-xl font-bold text-orange-400 pt-2">6. Contact Us</h3>
          <p>If you have questions about these Terms, please contact us at <a href="mailto:support@roastypit.com" className="text-orange-400 hover:underline">support@roastypit.com</a>.</p>
      </div>
  );


  const renderHomePage = () => {
    switch (appState) {
      case AppState.LOADING:
        return <LoadingIndicator />;
      case AppState.SUCCESS:
        return videoUrl && lastVideoBlob ? (
          <VideoResult
            videoUrl={videoUrl}
            videoBlob={lastVideoBlob}
            onRetry={handleTryAgain}
            onNewVideo={handleNewVideo}
            onExtend={handleExtend}
            canExtend={lastConfig?.resolution === '720p'}
          />
        ) : null;
      case AppState.ERROR:
        return (
          <div className="text-center p-8 bg-red-900/30 rounded-2xl border border-red-500/50">
            <h2 className="text-2xl font-bold text-red-400">Error</h2>
            <div className="mt-2 text-red-300">{errorMessage}</div>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={handleTryAgain}
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
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-center bg-gradient-to-r from-amber-200 via-orange-400 to-red-500 bg-clip-text text-transparent">
              Generate Viral Video Roasts
            </h2>
            <p className="mt-4 text-center text-lg text-slate-400 max-w-2xl">
              Turn any idea into a hilarious, shareable video in seconds. Just type a prompt and let our AI do the roasting.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl my-12">
              <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_8px_#f97316]">
                <TextModeIcon className="w-10 h-10 text-orange-400 mb-4" />
                <h3 className="font-semibold text-white">1. Type a Prompt</h3>
                <p className="text-sm text-slate-400 mt-2">
                  Describe the hilarious video you want to create.
                </p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_8px_#f97316]">
                <SlidersHorizontalIcon className="w-10 h-10 text-orange-400 mb-4" />
                <h3 className="font-semibold text-white">2. Choose Settings</h3>
                <p className="text-sm text-slate-400 mt-2">
                  Select the mode, aspect ratio, and resolution.
                </p>
              </div>
              <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_8px_#f97316]">
                <ArrowRightIcon className="w-10 h-10 text-orange-400 mb-4" />
                <h3 className="font-semibold text-white">3. Generate Video</h3>
                <p className="text-sm text-slate-400 mt-2">
                  Click the generate button and let the AI work magic.
                </p>
              </div>
            </div>
            <div className="w-full">
              <PromptForm
                onGenerate={handleSubmit}
                initialValues={initialFormValues}
              />
            </div>
          </div>
        );
    }
  };

  const renderPage = () => {
    const [page, param] = route.split('/');
    
    const pageContainer = (children: React.ReactNode) => (
      <div className="w-full max-w-screen-xl mx-auto p-4 sm:p-8">
        {children}
      </div>
    );

    switch (page) {
      case 'home':
        return <div className="w-full h-full flex flex-col items-center justify-center p-4">{renderHomePage()}</div>;
      case 'blog':
        return pageContainer(<BlogPage />);
      case 'gallery':
        return pageContainer(<GalleryPage />);
      case 'howitworks':
        return pageContainer(<HowItWorksPage />);
      case 'contact':
        return pageContainer(<ContactPage />);
      case 'about':
        return pageContainer(<InfoPage title="About RoastyPit">{aboutContent}</InfoPage>);
      case 'privacy':
        return pageContainer(<InfoPage title="Privacy Policy">{privacyContent}</InfoPage>);
      case 'terms':
        return pageContainer(<InfoPage title="Terms of Service">{termsContent}</InfoPage>);
      case 'article':
        const article = articlesData[param as ArticleSlug];
        if (article) {
          return <ArticlePage title={article.title}>{article.content}</ArticlePage>;
        }
        window.location.hash = '#blog'; // Redirect if article not found
        return null;
      default:
        window.location.hash = '#home'; // Redirect if route not found
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-gray-200">
      <Header />
      <main className="flex-grow w-full">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;