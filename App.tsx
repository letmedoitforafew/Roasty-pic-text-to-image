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
        title: "The Art of the Roast",
        content: <>
            <p><em>By RoastyPit Editorial Team</em></p>
            <p>Roasting has been part of comedy culture for decades — a playful blend of humor, wit, and timing. When done right, a roast isn’t just about making fun of someone. It’s about celebrating their quirks, exaggerating their habits, and doing it in a way that keeps everyone laughing — even the one being roasted. In today’s digital age, roasts have evolved far beyond comedy clubs. Thanks to AI tools like <strong>RoastyPit</strong>, anyone can join the fun and turn words into hilarious, shareable videos.</p>
            <h2>What Exactly Is a Roast?</h2>
            <p>A roast is a comedic tribute, usually aimed at a person, celebrity, or even a concept. It’s a lighthearted form of teasing that walks the fine line between funny and offensive. The best roasts are never mean-spirited — they make fun of people in ways that feel relatable and affectionate.</p>
            <p>From classic Dean Martin celebrity roasts to modern YouTube comedy, roasting has always been about quick thinking, creativity, and timing. In short, it’s an art form — and like any art, it takes skill to master.</p>
            <h2>The Golden Rules of a Good Roast</h2>
            <ul>
              <li><strong>Keep it playful, not personal.</strong> The best roasts poke fun at surface-level traits, not deep insecurities.</li>
              <li><strong>Be clever.</strong> A creative punchline beats a cheap insult any day.</li>
              <li><strong>Read the room.</strong> What’s funny to one group may be too much for another.</li>
              <li><strong>End with warmth.</strong> Every great roast ends on a high note — a reminder that it’s all in good fun.</li>
            </ul>
            <h2>Why AI Is Changing the Game</h2>
            <p>AI is now helping people write funnier, more original roasts — even if they’ve never tried comedy before. Platforms like <strong>RoastyPit</strong> allow users to enter a short prompt or topic, and the system generates a video with personality and punchlines. It’s part technology, part creativity, and all fun.</p>
            <p>What makes this so powerful is accessibility. You no longer need to be a comedian to make people laugh. With AI, anyone can generate a roast that sounds authentic, sharp, and funny — without crossing the line into negativity.</p>
            <h2>The Psychology Behind a Roast</h2>
            <p>Humor is deeply connected to human emotion. When someone laughs at a roast, they’re often laughing at themselves — or at something universally relatable. Roasting gives us a safe space to address human flaws, exaggerate them, and transform them into laughter. It’s therapy wrapped in comedy.</p>
            <p>Roasts also build community. Think about how friends joke with each other — it’s a sign of closeness. When someone is roasted well, it’s because the roaster knows them. It’s a strange but beautiful form of respect.</p>
            <h2>From Classic Comedy to AI-Generated Laughs</h2>
            <p>Comedians like Don Rickles, Joan Rivers, and Jeff Ross perfected the roast format long before AI existed. But what’s happening now is a fascinating evolution. With text-to-video generators like RoastyPit, users can type a few words and instantly see an AI character deliver a roast in a funny, shareable format. The process keeps the spirit of classic roasting alive, while introducing it to a digital audience that loves memes and viral humor.</p>
            <img src="https://placehold.co/800x450/1e293b/f97316?text=AI+Roast+Comedy" alt="AI Roast Comedy Example" className="my-6 rounded-lg"/>
            <h2>How to Write a Roast That Hits the Right Note</h2>
            <ol>
              <li><strong>Start with observation.</strong> What makes the person or topic unique?</li>
              <li><strong>Exaggerate one funny trait.</strong> Don’t pile on too much — pick one and make it shine.</li>
              <li><strong>Add a twist.</strong> The best jokes surprise people. If they can predict your punchline, it’s not a roast — it’s a description.</li>
              <li><strong>Balance humor with heart.</strong> A roast that ends with a genuine compliment always lands better.</li>
            </ol>
            <p>AI tools can help spark creativity, but human input is what gives a roast its real personality. The perfect combo? You write the idea — RoastyPit brings it to life with visuals and voice.</p>
            <h2>RoastyPit: Where Words Become Comedy</h2>
            <p><strong>RoastyPit</strong> is more than just a text-to-video tool. It’s a playground for creators who love humor. You can write a short prompt, choose a tone, and watch AI turn it into a hilarious roast clip — perfect for social media, YouTube Shorts, or just sending to friends.</p>
            <p>The platform’s goal isn’t to replace comedians, but to empower creativity. Whether you’re a marketer, content creator, or just someone who loves to laugh, RoastyPit lets you express yourself through comedy in seconds.</p>
            <h2>Keeping Roasts Safe for Everyone</h2>
            <p>Comedy walks a tightrope between edgy and offensive. AI-generated content adds another layer of responsibility. RoastyPit uses filters and moderation tools to keep humor playful and respectful. The goal is laughter, not harm.</p>
            <p>That’s one reason advertisers feel comfortable supporting humor sites like this — it’s clean, smart fun that drives engagement without negativity. That’s the sweet spot for <strong>AdSense approval</strong> and long-term growth.</p>
            <h2>Behind Every Roast, There’s Truth</h2>
            <p>Every great joke starts with truth. Roasts exaggerate real-life details, but at their core, they’re reflections of who we are. When we laugh at a roast, we’re acknowledging those imperfections — and choosing to laugh at them instead of hiding them. That’s powerful.</p>
            <p>In a world where online humor can sometimes be cruel, platforms like RoastyPit remind us that it’s still possible to be funny and kind. It’s humor with heart, and that’s what keeps people coming back.</p>
            <h2>Final Thoughts: Mastering the Art of the Roast</h2>
            <p>The art of the roast is all about balance — boldness, creativity, and a little bit of love. Whether it’s a birthday roast, a viral meme, or an AI-generated skit, the goal is always the same: to make people laugh and bring them closer together.</p>
            <p>If you want to explore the future of comedy, check out <strong>RoastyPit</strong> and see how your ideas can turn into hilarious videos in seconds. Who knows? Your next roast might just go viral.</p>
        </>,
    },
    'hilarious-prompts': {
        title: "How to Write Hilarious AI Prompts",
        content: <>
            <p><em>By RoastyPit Editorial Team</em></p>
            <p>Have you ever typed something into an AI generator and gotten a response so funny it made you laugh out loud? That’s no accident — it’s all about how you write your prompts. The way you talk to AI determines whether you get a dry, robotic line or a punchline worthy of a comedy show.</p>
            <p>At <strong>RoastyPit</strong>, users turn simple text into comedy videos. The secret behind every viral result isn’t just the technology — it’s the prompt. The better you write it, the funnier your video will be. Whether you’re roasting a friend, making a parody, or trying to create the next viral meme, crafting a hilarious prompt is a skill anyone can master.</p>
            <h2>What Exactly Is an AI Prompt?</h2>
            <p>An AI prompt is a short instruction or sentence that tells the AI what to generate. Think of it like giving directions to a comedian before they go on stage. You’re setting the scene, defining the character, and deciding the tone.</p>
            <blockquote>“Write a roast about a guy who’s always late, but thinks he’s early because his watch is from 2005.”</blockquote>
            <p>That’s a perfect example of a setup that gives the AI context, tone, and humor. It’s specific, lighthearted, and full of personality — everything an AI needs to deliver something funny.</p>
            <h2>Why Funny Prompts Go Viral</h2>
            <p>The internet loves humor — especially when it feels spontaneous. AI-generated jokes, roasts, or videos often go viral because they mix technology with the unexpected. People share them because they’re surprised an AI could be that funny. The key is writing prompts that blend everyday situations with exaggeration or absurdity.</p>
            <p>At RoastyPit, we’ve seen hilarious examples go viral like:</p>
            <ul>
                <li>“Roast my friend who says ‘bro’ after every sentence.”</li>
                <li>“Make a motivational speech from a cat who’s late for work.”</li>
                <li>“Give me a breakup speech written by a confused toaster.”</li>
            </ul>
            <p>These prompts work because they’re visual, silly, and easy to imagine — perfect for turning into a video clip that spreads across TikTok, Instagram, or YouTube Shorts.</p>
            <h2>The Secret Formula: Comedy + Clarity + Character</h2>
            <p>When it comes to writing AI prompts, think of it as writing for a comedian. The funnier your setup, the better your punchline. Here’s a simple formula used by successful creators:</p>
            <ol>
                <li><strong>Comedy:</strong> Add exaggeration or irony. Funny ideas come from unexpected contrasts.</li>
                <li><strong>Clarity:</strong> Be clear about the tone or situation. Don’t confuse the AI with vague ideas.</li>
                <li><strong>Character:</strong> Give the AI a personality to play with — like a sarcastic teacher, a sleepy superhero, or a dramatic grandma.</li>
            </ol>
            <p>Let’s test it. Here are two versions of a similar idea:</p>
            <p><strong>Boring prompt:</strong> “Make a joke about someone who is late.”</p>
            <p><strong>Funny prompt:</strong> “Roast my friend who shows up late to everything but still asks why we started without him.”</p>
            <p>See the difference? The second one paints a scene, gives emotion, and sets the stage for humor. That’s the magic of writing a good AI prompt.</p>
            <h2>Tips for Writing Funnier Prompts</h2>
            <p>Ready to level up your comedy writing? Here are some proven tricks to make your AI prompts funnier and more viral:</p>
            <h3>1. Be specific</h3>
            <p>The more details you give, the more vivid and funny the response will be. Don’t just say “make a joke about a dog.” Instead, say “make a joke about a dog who thinks he’s the CEO of the backyard.”</p>
            <h3>2. Add personality</h3>
            <p>AI responds well when you describe tone and character. Try: “Write a roast from a sassy grandma who just discovered TikTok.”</p>
            <h3>3. Use contrast</h3>
            <p>Comedy thrives on opposites. A serious tone in a ridiculous situation always works. Example: “A lawyer passionately defends pizza rolls in court.”</p>
            <h3>4. Play with emotions</h3>
            <p>Funny prompts often exaggerate emotions. “A motivational coach who gives up halfway through his own speech.”</p>
            <h3>5. Keep it short</h3>
            <p>Don’t overload the AI with too much info. One or two sentences is perfect. Think like a screenwriter writing a logline.</p>
            <h2>How RoastyPit Turns Prompts Into Videos</h2>
            <p>At <strong>RoastyPit</strong>, users can turn any prompt into a shareable AI video. Just type your idea — serious, funny, or weird — and the platform does the rest. In seconds, your prompt becomes a short video clip with voice, visuals, and timing that feels human.</p>
            <img src="https://placehold.co/800x450/1e293b/ea580c?text=Hilarious+AI+Prompts" alt="AI comedy generator" className="my-6 rounded-lg" />
            <p>Creators love it because it’s simple, fast, and hilarious. There’s no need for editing skills or fancy equipment — just your imagination. That’s why RoastyPit has become one of the top destinations for AI humor creators.</p>
            <h2>Examples of Great Prompts for AI Comedy</h2>
            <p>Need inspiration? Here are a few prompt ideas you can test out today:</p>
            <ul>
                <li>“Write a roast about someone who flexes their gym membership but never goes.”</li>
                <li>“A news anchor reporting live from inside a microwave.”</li>
                <li>“A superhero whose only power is finding lost remotes.”</li>
                <li>“An overly dramatic chef describing how he burned toast.”</li>
                <li>“Roast me like I just tried to use ChatGPT to flirt.”</li>
            </ul>
            <p>Each one is short, visual, and filled with personality — exactly what AI needs to create something shareable and funny.</p>
            <h2>The Psychology Behind AI Humor</h2>
            <p>Humor works because it plays with expectations. When we think one thing is going to happen but something else happens instead, our brain reacts — and we laugh. AI comedy uses the same principle, but it’s powered by patterns. The more clever your setup, the more surprising and funny the result will be.</p>
            <p>That’s why RoastyPit is so entertaining. You’re not just generating random content; you’re exploring how human humor interacts with artificial intelligence. It’s creative, unpredictable, and often downright hilarious.</p>
            <h2>Common Mistakes to Avoid</h2>
            <p>Even great writers make mistakes when crafting prompts. Here’s what to watch out for:</p>
            <ul>
                <li><strong>Too vague:</strong> “Make a funny video” won’t work. Give specifics!</li>
                <li><strong>Too long:</strong> The AI loses focus if you over-explain.</li>
                <li><strong>Overly harsh:</strong> Keep humor playful — not mean-spirited. That’s key for both audience appeal and AdSense approval.</li>
                <li><strong>Forgetting tone:</strong> Always mention if you want sarcasm, dry humor, or absurdity.</li>
            </ul>
            <h2>SEO Tip: Why Funny Content Wins in Search</h2>
            <p>Humor-based content performs extremely well in search because it encourages engagement. People watch funny videos longer, share them more often, and revisit sites that make them laugh. By creating articles and videos centered on comedy, you increase user time on page — one of Google’s top ranking factors.</p>
            <p>That’s why RoastyPit’s niche is so powerful. “AI + Comedy” is a growing field that attracts creators, marketers, and casual users alike. Search phrases like <strong>“funny AI videos,” “AI roast generator,”</strong> and <strong>“AI comedy prompts”</strong> already bring in thousands of searches every month.</p>
            <h2>Final Thoughts: Humor Meets Innovation</h2>
            <p>Writing hilarious AI prompts isn’t just about making people laugh — it’s about exploring the intersection of creativity and technology. Every great prompt you write becomes part of this new wave of digital comedy. The more you play, the better you get.</p>
            <p>So next time you want a laugh, don’t scroll endlessly on social media. Open <strong>RoastyPit</strong>, type something funny, and let AI do the rest. You might just create the next viral hit — and prove that comedy isn’t dying; it’s evolving.</p>
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