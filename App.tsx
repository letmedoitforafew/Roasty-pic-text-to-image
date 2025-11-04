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
  DialogType,
  GenerateVideoParams,
  GenerationMode,
  Resolution,
  VeoModel,
} from './types';

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
            <p>AI is now helping people write <a href="#article/hilarious-prompts" className="text-orange-400 hover:underline">funnier, more original roasts</a> — even if they’ve never tried comedy before. Platforms like <strong>RoastyPit</strong> allow users to enter a short prompt or topic, and the system generates a video with personality and punchlines. It’s part technology, part creativity, and all fun.</p>
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
            <p><strong>RoastyPit</strong> is more than just a text-to-video tool. It’s a playground for creators who love humor. You can write a short prompt, choose a tone, and watch AI turn it into a hilarious roast clip. To understand the technology behind this, read our <a href="#article/behind-the-scenes" className="text-orange-400 hover:underline">behind-the-scenes look at how RoastyPit works</a>.</p>
            <p>The platform’s goal isn’t to replace comedians, but to empower creativity. Whether you’re a marketer, content creator, or just someone who loves to laugh, RoastyPit lets you express yourself through comedy in seconds.</p>
            <h2>Keeping Roasts Safe for Everyone</h2>
            <p>Comedy walks a tightrope between edgy and offensive. AI-generated content adds another layer of responsibility. RoastyPit uses filters and moderation tools to keep humor playful and respectful. The goal is laughter, not harm.</p>
            <p>That’s one reason advertisers feel comfortable supporting humor sites like this — it’s clean, smart fun that drives engagement without negativity. That’s the sweet spot for <strong>AdSense approval</strong> and long-term growth.</p>
            <h2>Behind Every Roast, There’s Truth</h2>
            <p>Every great joke starts with truth. Roasts exaggerate real-life details, but at their core, they’re reflections of who we are. When we laugh at a roast, we’re acknowledging those imperfections — and choosing to laugh at them instead of hiding them. That’s powerful.</p>
            <p>In a world where online humor can sometimes be cruel, platforms like RoastyPit remind us that it’s still possible to be funny and kind. It’s humor with heart, and that’s what keeps people coming back.</p>
            <h2>Final Thoughts: Mastering the Art of the Roast</h2>
            <p>The art of the roast is all about balance — boldness, creativity, and a little bit of love. Whether it’s a birthday roast, a viral meme, or an AI-generated skit, the goal is always the same: to make people laugh and bring them closer together.</p>
            <p>If you want to explore the <a href="#article/ai-in-comedy" className="text-orange-400 hover:underline">future of comedy</a>, check out <strong>RoastyPit</strong> and see how your ideas can turn into hilarious videos in seconds. Who knows? Your next roast might just go viral.</p>
        </>,
    },
    'hilarious-prompts': {
        title: "How to Write Hilarious AI Prompts",
        content: <>
            <p><em>By RoastyPit Editorial Team</em></p>
            <p>Have you ever typed something into an AI generator and gotten a response so funny it made you laugh out loud? That’s no accident — it’s all about how you write your prompts. The way you talk to AI determines whether you get a dry, robotic line or a punchline worthy of a comedy show.</p>
            <p>At <strong>RoastyPit</strong>, users turn simple text into comedy videos. The secret behind every viral result isn’t just the technology — it’s the prompt. The better you write it, the funnier your video will be. Whether you’re <a href="#article/art-of-the-roast" className="text-orange-400 hover:underline">roasting a friend</a>, making a parody, or trying to create the next viral meme, crafting a hilarious prompt is a skill anyone can master.</p>
            <h2>What Exactly Is an AI Prompt?</h2>
            <p>An AI prompt is a short instruction or sentence that tells the AI what to generate. Think of it like giving directions to a comedian before they go on stage. You’re setting the scene, defining the character, and deciding the tone.</p>
            <blockquote>“Write a roast about a guy who’s always late, but thinks he’s early because his watch is from 2005.”</blockquote>
            <p>That’s a perfect example of a setup that gives the AI context, tone, and humor. It’s specific, lighthearted, and full of personality — everything an AI needs to deliver something funny.</p>
            <h2>Why Funny Prompts Go Viral</h2>
            <p>The internet loves humor — especially when it feels spontaneous. AI-generated jokes, roasts, or videos often go viral because they mix technology with the unexpected. People share them because they’re surprised an AI could be that funny. The key is writing prompts that blend everyday situations with exaggeration or absurdity.</p>
            <p>At RoastyPit, we’ve seen hilarious examples go viral, like some of the <a href="#article/top-5-viral" className="text-orange-400 hover:underline">top 5 viral videos made with the platform</a>:</p>
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
            <p>See the difference? The second one paints a scene, gives emotion, and sets the stage for humor. That’s the magic of a good AI prompt.</p>
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
            <p>At <strong>RoastyPit</strong>, users can turn any prompt into a shareable AI video. Just type your idea — serious, funny, or weird — and the platform does the rest. To understand the magic behind this process, check out our guide on <a href="#article/behind-the-scenes" className="text-orange-400 hover:underline">how RoastyPit works</a>.</p>
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
            <p><em>By RoastyPit Editorial Team</em></p>
            <p>Every now and then, a video comes along that makes the entire internet stop scrolling and start laughing. That’s exactly what’s been happening with the explosion of AI-generated comedy — and at the heart of it, <strong>RoastyPit</strong> has been quietly becoming a hub for the funniest, strangest, and most shareable clips online.</p>
            <p>Whether it’s a talking avocado giving relationship advice or a robot roasting someone’s fashion choices, RoastyPit has turned <a href="#article/hilarious-prompts" className="text-orange-400 hover:underline">simple text prompts</a> into viral gold. In this article, we’re diving into the <strong>Top 5 Viral Videos Made with RoastyPit</strong>, breaking down what made them hit so hard — and how you can create your own viral moment, too.</p>
            
            <h2>1. “The Coffee Addict’s Intervention” ☕</h2>
            <img src="https://placehold.co/800x450/1e2d3b/f59e0b?text=Coffee+Roast" alt="Funny AI coffee roast video" className="my-6 rounded-lg"/>
            <p>This video starts with an AI-generated character standing in a support group, holding a cup of coffee the size of his head. The prompt? “Create a roast video about a guy who says he’s quitting coffee but owns seven coffee makers.”</p>
            <p>The result was comedy gold. The AI character launches into a mock-serious monologue about caffeine dependence, complete with dramatic background music and slow-motion coffee pours. Viewers loved it because it hit close to home — funny because it’s true.</p>
            <p><strong>Why it went viral:</strong> relatable humor, strong visuals, and perfect timing. Plus, the tone was friendly and self-aware, not mean-spirited — something advertisers love to see for safe content placement.</p>

            <h2>2. “The Gym Bro Who Never Lifts” 💪</h2>
            <p>This one was born from the classic <a href="#article/art-of-the-roast" className="text-orange-400 hover:underline">friend-roast setup</a>: “Roast a guy who spends more time taking gym selfies than lifting weights.” Within hours of being uploaded to TikTok, the video racked up over 3 million views.</p>
            <p>The AI-generated character delivered lines dripping with sarcasm: “He’s the only person who can burn calories scrolling through his own photos.” The humor was universal — everyone knows someone like that — and the visual animation gave it that extra viral edge.</p>
            <p><strong>Takeaway:</strong> The best RoastyPit videos exaggerate real-life behavior. If your idea makes people say, “That’s so true,” you’re halfway to viral status.</p>

            <h2>3. “When Your Cat Becomes Your Therapist” 🐱</h2>
            <img src="https://placehold.co/800x450/1e2d3b/ef4444?text=Cat+Therapy" alt="AI cat comedy video" className="my-6 rounded-lg"/>
            <p>Sometimes, the funniest AI videos come from everyday absurdity. This clip began with the prompt: “Make a video where a cat gives life advice in the voice of an emotional support coach.”</p>
            <p>The result was a hilarious mashup of soft piano music, inspirational quotes, and random meows between sentences. One line — “Remember to chase your dreams the way I chase laser dots” — became an instant meme.</p>
            <p><strong>Why it went viral:</strong> wholesome absurdity. People love humor that’s weird but comforting, and this hit both notes perfectly. It was shared across Instagram reels, Twitter, and Reddit within days.</p>

            <h2>4. “The Overly Dramatic Breakup” 💔</h2>
            <p>Every platform has its fair share of breakup videos, but this one stood out. Prompt: “Write a dramatic breakup scene between a man and his Wi-Fi connection.”</p>
            <p>The AI turned that into a full-on soap opera. The voice acting, music, and pacing felt like a real movie trailer — until you realize the character is crying over losing signal. Lines like “You disconnected when I needed you most” had people quoting it everywhere.</p>
            <p><strong>Viral factor:</strong> creativity and timing. The video dropped just as people were posting “internet down” memes, making it ultra-shareable. RoastyPit’s flexibility made it easy for creators to produce fast, topical humor — the kind that dominates trends.</p>

            <h2>5. “The Smart Fridge That Knows Too Much” 🧊</h2>
            <img src="https://placehold.co/800x450/1e2d3b/3b82f6?text=Smart+Fridge" alt="AI smart fridge roast video" className="my-6 rounded-lg"/>
            <p>This one started as a random idea: “Generate a comedy video where a smart fridge roasts its owner for late-night snacking.” What came out was a perfect storm of sass and self-awareness.</p>
            <p>The fridge character calls out its owner with lines like: “3 a.m. again? Bro, that’s your fifth slice of pizza. I’m not judging — but your lettuce is.” It was funny, modern, and perfectly suited for short-form video platforms.</p>
            <p><strong>Why it went viral:</strong> personality. The AI voice had just enough attitude to feel human, and the script struck a perfect tone between humor and realism.</p>

            <h2>What All Viral RoastyPit Videos Have in Common</h2>
            <p>Looking across all five of these hits, you’ll notice a few things in common. These are the secret ingredients behind viral AI comedy:</p>
            <ol>
                <li><strong>They’re relatable.</strong> The humor taps into everyday situations — coffee, Wi-Fi, pets, the gym.</li>
                <li><strong>They’re short.</strong> Most viral clips are under 45 seconds, making them perfect for social media.</li>
                <li><strong>They’re creative.</strong> Each video adds a twist to something familiar.</li>
                <li><strong>They’re shareable.</strong> The jokes make people want to tag friends and say, “This is so you.”</li>
            </ol>
            <p>RoastyPit makes this easy because the process is fast. Users can type a few words, generate a clip, and post it instantly — meaning creators can ride trends in real time, just like pro meme accounts and comedians.</p>

            <h2>How to Create a Viral AI Video on RoastyPit</h2>
            <p>If you’re ready to make your own, here’s a step-by-step guide that successful creators follow:</p>
            <ol>
                <li><strong>Start with a simple, funny idea.</strong> It could be a roast, parody, or absurd situation.</li>
                <li><strong>Use a conversational tone.</strong> Prompts that sound natural lead to funnier results.</li>
                <li><strong>Add context.</strong> Describe the character or mood. For example, “Make a dramatic scene where a robot argues with its alarm clock.”</li>
                <li><strong>Keep it short.</strong> One or two sentences is ideal.</li>
                <li><strong>Share fast.</strong> Post your clip while the idea is still fresh — timing is everything online.</li>
            </ol>
            <p>And don’t forget: humor isn’t about perfection. Some of the most viral RoastyPit clips came from random experiments or silly late-night ideas that just clicked with the internet’s sense of humor.</p>
            
            <h2>Why AI Comedy Is the Future of Entertainment</h2>
            <p>For years, people have worried that AI might take over creative industries. But RoastyPit proves something different: <a href="#article/ai-in-comedy" className="text-orange-400 hover:underline">AI can enhance creativity</a> instead of replacing it. By giving users tools to express humor in new ways, AI becomes a comedy partner — not a competitor.</p>
            <p>Creators who understand how to write smart, funny prompts are already using platforms like RoastyPit to grow audiences, build communities, and even monetize their content. The best part? You don’t need expensive gear or editing skills — just an idea and a few clicks.</p>

            <h2>SEO Insight: Why Viral Videos Help Your Brand</h2>
            <p>Each viral clip acts as free advertising. Every time someone shares a RoastyPit video, they’re driving awareness back to the platform. That’s why humor-based content is so powerful for SEO and AdSense growth — it’s organic engagement that multiplies itself.</p>
            <p>Even short clips can bring traffic back to your website or social pages. Embedding your <strong>RoastyPit</strong> videos into blog posts like this one also boosts time-on-page and click-through rates, both of which help with search rankings.</p>
            
            <h2>Final Thoughts: Anyone Can Go Viral</h2>
            <p>What makes RoastyPit special is how accessible it is. You don’t need to be a comedian, video editor, or influencer to make people laugh. You just need an idea — and a sense of fun.</p>
            <p>So if you’ve ever wondered what it feels like to create a viral hit, the answer is simple: try it. Head over to <strong>RoastyPit</strong>, type in your funniest thought, and watch AI turn it into comedy magic. The next big viral video might just have your name on it.</p>
        </>,
    },
    'ai-in-comedy': {
        title: "AI in Comedy: The Future of Funny",
        content: <>
            <p><em>By RoastyPit Editorial Team</em></p>
            <p>Comedy has always evolved with technology. From vaudeville to stand-up, sitcoms to YouTube, each era has brought new ways to make people laugh. Now, artificial intelligence is the latest frontier — and it’s changing how we create, share, and experience humor. Platforms like <strong>RoastyPit</strong> are at the forefront, turning simple text into funny, shareable videos that feel human and spontaneous.</p>
            <h2>The Rise of AI-Generated Humor</h2>
            <p>Artificial intelligence is often associated with efficiency and productivity, but comedy is proving to be a surprisingly natural fit. AI models are capable of understanding language, context, and timing — all essential for humor. With the <a href="#article/hilarious-prompts" className="text-orange-400 hover:underline">right prompts</a>, AI can generate witty one-liners, dramatic roasts, and absurd sketches in seconds.</p>
            <p>This doesn’t mean AI is replacing comedians — far from it. Instead, it’s becoming a tool for creators, amplifying their ideas and allowing them to experiment in ways that were impossible before. For example, a user can type a prompt like:</p>
            <blockquote>“Roast someone who spends more time scrolling than working out.”</blockquote>
            <p>And within moments, RoastyPit can generate a full video complete with character animation, voice, and comedic timing. The result feels surprisingly human — a testament to how far AI comedy has come.</p>
            <h2>Why AI Comedy Works</h2>
            <p>Humor is complex. It relies on context, cultural understanding, wordplay, and timing. Modern AI models can analyze millions of examples of jokes, videos, and scripts to learn patterns in comedic language. They understand punchlines, irony, exaggeration, and absurdity — the building blocks of funny content.</p>
            <p>Three main factors make AI comedy successful:</p>
            <ul>
                <li><strong>Timing:</strong> Comedy often depends on pacing. AI can structure sentences and pauses to enhance the punchline.</li>
                <li><strong>Relatability:</strong> AI draws from real-life examples and trends, creating content people recognize and enjoy.</li>
                <li><strong>Creativity:</strong> AI can combine unrelated ideas to produce absurd, surreal, or unexpected humor — often the funniest kind.</li>
            </ul>
            <h2>AI as a Creative Partner</h2>
            <img src="https://placehold.co/800x450/1e293b/d97706?text=AI+Comedy+Future" alt="AI Comedy Future" className="my-6 rounded-lg" />
            <p>Think of AI not as a comedian, but as a creative partner. It doesn’t have feelings or personal experiences, but it can mimic the patterns of human humor. This allows creators to:</p>
            <ul>
                <li>Experiment with different styles of jokes.</li>
                <li>Generate sketches or roasts quickly.</li>
                <li>Test humor ideas before producing them in full video form.</li>
            </ul>
            <p>For example, RoastyPit allows users to type a short prompt and instantly see a fully animated, voiced video. To see this in action, read our <a href="#article/behind-the-scenes" className="text-orange-400 hover:underline">behind-the-scenes article</a>.</p>
            <h2>AI Comedy vs. Human Comedy</h2>
            <p>There’s often skepticism about AI humor. Can a machine truly make us laugh? The answer lies in collaboration. Human comedians provide context, nuance, and cultural insight. AI provides speed, versatility, and creative amplification.</p>
            <p>Consider this scenario:</p>
            <ul>
                <li>A comedian wants to test 10 roast ideas for TikTok.</li>
                <li>Without AI, they would have to write, record, edit, and refine each video manually.</li>
                <li>With AI like RoastyPit, they can generate all 10 clips in minutes, then select the best one.</li>
            </ul>
            <p>The human guides the humor; AI executes it. The result? More ideas, less effort, and higher chances of virality.</p>
            <h2>Applications of AI Comedy Today</h2>
            <p>AI-generated humor isn’t just a novelty. It’s being used in:</p>
            <ul>
                <li><strong>Social media content:</strong> Short, funny clips that engage millions of users.</li>
                <li><strong>Marketing campaigns:</strong> Brands using humor to connect with audiences in fresh, shareable ways.</li>
                <li><strong>Gaming and entertainment:</strong> Dynamic, interactive humor within games and apps.</li>
                <li><strong>Education and training:</strong> Light-hearted AI scripts to make learning more fun.</li>
            </ul>
            <p>The common thread is engagement. Humor keeps audiences watching, sharing, and interacting — and AI makes creating it faster and easier.</p>
            <h2>The Ethical Side of AI Humor</h2>
            <p>With great power comes great responsibility. AI comedy must navigate issues like offensive content, bias, and cultural sensitivity. Platforms like RoastyPit include built-in safeguards to avoid inappropriate jokes while preserving creativity. Users are encouraged to craft playful, relatable, and lighthearted prompts — ensuring that humor stays fun, not harmful.</p>
            <h2>The Future: Personalized Comedy</h2>
            <p>The next frontier for AI in comedy is personalization. Imagine AI that understands your style, your favorite topics, and your audience, generating jokes tailored specifically for you. RoastyPit is already moving in this direction, allowing users to experiment with tone, timing, and character style — effectively giving everyone a personal comedy studio.</p>
            <p>Other potential future applications include:</p>
            <ul>
                <li>Interactive comedy bots that respond in real-time.</li>
                <li>AI-generated improv scenes with audience input.</li>
                <li>Customized meme and video creation at scale.</li>
            </ul>
            <p>Humor may always be at its core, but AI will increasingly serve as a creative partner — helping us produce funny, engaging content faster, smarter, and more often.</p>
            <h2>Why RoastyPit Stands Out</h2>
            <p>RoastyPit isn’t just an AI video generator. It’s designed for comedy from the ground up:</p>
            <ul>
                <li>Optimized for humorous prompts and storytelling.</li>
                <li>Transforms text into voice, character animation, and full scenes.</li>
                <li>Safe, advertiser-friendly, and perfect for social media virality.</li>
            </ul>
            <p>It makes AI comedy accessible to everyone — from casual users wanting to roast friends, to marketers creating engaging campaigns, to creators testing new formats.</p>
            <h2>Conclusion: A New Era of Humor</h2>
            <p>AI is revolutionizing comedy, but it isn’t replacing humans. It’s empowering creators to take risks, experiment, and amplify their humor. Platforms like <strong>RoastyPit</strong> are proof that technology and creativity can coexist, resulting in <a href="#article/top-5-viral" className="text-orange-400 hover:underline">funny, shareable viral content</a> that keeps audiences engaged.</p>
            <p>The future of funny is collaborative. It’s humans and AI working together to make laughter faster, smarter, and more personalized than ever before. If you haven’t tried it yet, visit <strong>RoastyPit.com</strong> and see how AI can turn your ideas into hilarious videos that might just go viral.</p>
        </>,
    },
    'behind-the-scenes': {
        title: "Behind the Scenes: How RoastyPit Works",
        content: <>
            <p><em>By RoastyPit Editorial Team</em></p>
            <p>Have you ever wondered how a simple text prompt can turn into a hilarious AI-generated video? At <strong>RoastyPit</strong>, this is exactly what happens. What looks like magic on the screen is actually a sophisticated blend of AI technology, creative algorithms, and thoughtful design — all built to make comedy accessible and shareable for everyone.</p>
            <h2>The Origin of RoastyPit</h2>
            <p>RoastyPit was created with one goal in mind: to make AI-powered humor easy, fast, and fun. Before RoastyPit, generating a funny video required hours of writing, voice recording, animation, and editing. The team behind RoastyPit asked a simple question: <em>What if anyone could create a funny, high-quality video in minutes?</em> That idea sparked the platform you see today.</p>
            <p>The name “RoastyPit” reflects the playful nature of the platform — a digital space where users can roast ideas, characters, or friends, and see them come alive in a video format. The focus is humor, and every feature is designed to enhance it.</p>
            <h2>Step 1: User Prompts</h2>
            <p>Everything begins with the prompt — the words the user enters to describe the roast or idea. Mastering this first step is key. Learn <a href="#article/hilarious-prompts" className="text-orange-400 hover:underline">how to write hilarious AI prompts</a> to get the best results. This could be as simple as:</p>
            <blockquote>“Roast someone who spends too much time on social media.”</blockquote>
            <p>Or something more detailed like:</p>
            <blockquote>“Create a video where a clumsy AI chef insults his robotic kitchen assistants.”</blockquote>
            <p>These prompts are the foundation for the AI. The platform analyzes them to determine tone, context, and humor style, ensuring the output aligns with what the user intended.</p>
            <h2>Step 2: AI Humor Engine</h2>
            <img src="https://placehold.co/800x450/1e293b/92400e?text=AI+Humor+Engine" alt="RoastyPit AI Engine" className="my-6 rounded-lg"/>
            <p>Once the prompt is submitted, RoastyPit’s AI Humor Engine takes over. Unlike generic text generators, this engine is fine-tuned for comedy. It:</p>
            <ul>
                <li><strong>Interprets tone:</strong> Determines whether the content should be sarcastic, playful, or exaggerated.</li>
                <li><strong>Generates dialogue:</strong> Writes jokes, punchlines, and comedic sequences in natural language.</li>
                <li><strong>Optimizes humor:</strong> Adjusts timing, pacing, and delivery for maximum comedic effect.</li>
            </ul>
            <p>The result is text that sounds like a real comedian wrote it — complete with timing, punchlines, and humor style.</p>
            <h2>Step 3: Text-to-Video Conversion</h2>
            <p>Next, RoastyPit converts the AI-generated script into a fully animated video. This step involves:</p>
            <ul>
                <li><strong>Voice synthesis:</strong> AI-generated voices deliver the dialogue in a human-like, expressive manner.</li>
                <li><strong>Character animation:</strong> Avatars and digital actors bring jokes to life with gestures, facial expressions, and comedic timing.</li>
                <li><strong>Scene composition:</strong> Backgrounds, props, and visual effects are added to enhance the humor.</li>
            </ul>
            <h2>Step 4: Smart Editing</h2>
            <p>Timing is everything in comedy. RoastyPit automatically adjusts pacing, pauses, and reactions to make sure jokes land perfectly. Even subtle elements, like a character raising an eyebrow or reacting at the right moment, are included to enhance the comedic impact.</p>
            <p>This automated editing eliminates the need for users to have technical video skills — the AI handles everything.</p>
            <h2>Step 5: Safety and Quality Control</h2>
            <p>AI-generated humor can be unpredictable. RoastyPit uses filters to prevent offensive or inappropriate content, keeping videos advertiser-friendly and safe for all audiences. At the same time, the platform ensures humor remains edgy, witty, and shareable.</p>
            <p>Each video undergoes an internal review process to maintain quality, so users can confidently share their creations online without worrying about content issues.</p>
            <h2>Step 6: Sharing and Engagement</h2>
            <img src="https://placehold.co/800x450/1e293b/92400e?text=Share+Funny+Videos" alt="Sharing RoastyPit AI Videos" className="my-6 rounded-lg"/>
            <p>Once the video is ready, users can instantly share it on social media platforms like TikTok, Instagram, and YouTube Shorts. The videos are optimized for each platform’s format, maximizing engagement and <a href="#article/top-5-viral" className="text-orange-400 hover:underline">virality</a>. Fast, funny, and relatable content is key to online success, and RoastyPit makes it effortless.</p>
            <h2>What Makes RoastyPit Unique?</h2>
            <p>While there are many AI video generators, RoastyPit stands out because:</p>
            <ul>
                <li>It’s built specifically for humor and comedy content.</li>
                <li>The AI adapts to tone and context, producing natural, human-like jokes.</li>
                <li>It combines text, voice, animation, and timing into one seamless process.</li>
                <li>It’s safe for advertisers and audiences alike, allowing creators to monetize content confidently.</li>
            </ul>
            <p>In short, RoastyPit turns creative ideas into polished, funny videos faster than any other platform.</p>
            <h2>The Technology Behind the Curtain</h2>
            <p>RoastyPit leverages advanced AI technologies:</p>
            <ul>
                <li><strong>Natural Language Processing (NLP):</strong> Understands prompts and generates humorous text.</li>
                <li><strong>Text-to-Speech:</strong> Converts dialogue into expressive voiceovers.</li>
                <li><strong>Animation AI:</strong> Brings characters and scenes to life based on the script.</li>
                <li><strong>Optimization algorithms:</strong> Ensure videos are snappy, funny, and engaging.</li>
            </ul>
            <p>The combination of these technologies allows anyone — from casual users to marketers — to create high-quality comedy videos with minimal effort.</p>
            <h2>The Future of RoastyPit</h2>
            <p>RoastyPit continues to innovate. The platform is working on:</p>
            <ul>
                <li>Even more expressive avatars and customizable characters.</li>
                <li>Real-time AI comedy responses for interactive content.</li>
                <li>Personalized humor based on user preferences and style.</li>
            </ul>
            <p>The goal is to make comedy creation faster, smarter, and more personalized than ever, enabling anyone to produce shareable, hilarious content in minutes.</p>
            <h2>Conclusion</h2>
            <p>RoastyPit makes it possible to take a simple idea and turn it into a funny, high-quality video in minutes. By combining AI-powered text generation, voice synthesis, animation, and smart editing, the platform democratizes comedy creation for everyone. This is a key part of the <a href="#article/ai-in-comedy" className="text-orange-400 hover:underline">future of AI in comedy</a>.</p>
            <p>Try it for yourself at <strong>RoastyPit.com</strong> — because every great roast starts with just a few words.</p>
        </>,
    },
};

const infoPageData = {
    'about': {
        title: "About RoastyPit",
        content: <>
            <p>RoastyPit was born from one simple idea: what if anyone could create hilarious, shareable videos with just a few words? The visionary behind this project is <strong>Roberto Gil</strong>, a tech entrepreneur with a passion for innovation, humor, and AI-powered creativity.</p>
            <p>Roberto has always been fascinated by the intersection of technology and creativity. After years of experimenting with AI, software, and digital media, he founded <strong>Gilnetwork</strong>, a company dedicated to building smart, engaging, and fun digital experiences. His mission was to make technology approachable — and entertaining — for everyone.</p>
            <p>With humor at the core, Roberto envisioned a platform that could turn text into animated, funny videos instantly. Using the cutting-edge <strong>Google Veo 3 AI technology</strong>, RoastyPit became more than a tool — it became a creative playground. Users can type a simple prompt and watch as the AI transforms their words into clever roasts, skits, and viral-ready content.</p>
            <p>Google Veo 3 provides powerful AI capabilities for natural language understanding, voice synthesis, and video generation. By leveraging this technology, Gilnetwork was able to design a platform that is not only intelligent but also fast and responsive. The AI ensures that every joke, expression, and animation feels human, while still being scalable for millions of users.</p>
            <p>At RoastyPit, our mission is simple: <strong>to make humor and creativity accessible to everyone</strong>. Whether you’re a casual user looking for a quick laugh, a content creator seeking viral material, or a marketer wanting engaging campaigns, RoastyPit gives you the tools to make your ideas come alive in seconds.</p>
            <p>Gilnetwork is committed to innovation, user safety, and high-quality content. Every feature of RoastyPit is designed with these principles in mind — from AI-generated humor to smooth video rendering. Our goal is to ensure that your creative journey is seamless, fun, and filled with laughter.</p>
            <p>RoastyPit isn’t just an app — it’s a community of creators, innovators, and humor enthusiasts. Join us, type your first prompt, and see how AI can turn your ideas into viral comedy. With Roberto Gil and Gilnetwork at the helm, the future of AI-powered humor is just getting started.</p>
        </>
    },
    'privacy': {
        title: "Privacy Policy",
        content: <>
            <p><strong>Effective Date:</strong> November 3, 2025</p>
            <p>Welcome to RoastyPit. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our service.</p>
            <h3>1. Information We Collect</h3>
            <p>We collect information you provide directly to us, such as the text prompts and images you submit for video generation. We also collect technical data about your usage of the service, such as your browser type and IP address, to improve performance and security.</p>
            <h3>2. How We Use Your Information</h3>
            <p>We use the information we collect to:</p>
            <ul>
                <li>Generate videos based on your prompts.</li>
                <li>Improve and optimize our AI models and services.</li>
                <li>Monitor and analyze trends and usage.</li>
                <li>Maintain the security and integrity of our platform.</li>
            </ul>
            <h3>3. Data Sharing</h3>
            <p>We do not sell your personal information. We may share your information with third-party service providers who perform services on our behalf, such as cloud hosting. We may also share information if required by law.</p>
            <h3>4. User-Generated Content</h3>
            <p>The videos you create are based on your prompts. Please be mindful not to include personal or sensitive information in your prompts. While we employ safety filters, you are responsible for the content you create.</p>
            <h3>5. Data Security</h3>
            <p>We implement reasonable security measures to protect your information from unauthorized access, use, or disclosure.</p>
            <h3>6. Changes to This Policy</h3>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
            <h3>7. Contact Us</h3>
            <p>If you have any questions about this Privacy Policy, please <a href="#contact">contact us</a>.</p>
        </>
    },
    'terms': {
        title: "Terms of Service",
        content: <>
            <p><strong>Effective Date:</strong> November 3, 2025</p>
            <p>Welcome to RoastyPit! These Terms of Service ("Terms") govern your use of our website and services. By using RoastyPit, you agree to these Terms.</p>
            <h3>1. Use of the Service</h3>
            <p>RoastyPit provides an AI-powered service to generate videos from user prompts. You agree to use our service for creative and entertainment purposes, in compliance with all applicable laws.</p>
            <h3>2. User-Generated Content</h3>
            <p>You retain ownership of the prompts you submit. By using the service, you grant RoastyPit a worldwide, non-exclusive, royalty-free license to use, reproduce, and modify your prompts to generate videos and improve our service. You are solely responsible for the content you create and ensuring it does not infringe on any third-party rights.</p>
            <h3>3. Prohibited Conduct</h3>
            <p>You agree not to use RoastyPit to create content that is:</p>
            <ul>
                <li>Illegal, harmful, or abusive.</li>
                <li>Infringing on copyright, trademark, or other intellectual property rights.</li>
                <li>Defamatory, obscene, or pornographic.</li>
                <li>Spam or unauthorized commercial communications.</li>
            </ul>
            <p>We reserve the right to remove content and suspend accounts that violate these terms.</p>
            <h3>4. Disclaimer of Warranties</h3>
            <p>The service is provided "as is" without any warranties of any kind. We do not guarantee that the generated videos will meet your expectations or be free of errors.</p>
            <h3>5. Limitation of Liability</h3>
            <p>To the fullest extent permitted by law, RoastyPit shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, resulting from your use of the service.</p>
            <h3>6. Changes to These Terms</h3>
            <p>We may modify these Terms at any time. We will provide notice of changes by posting the updated Terms on our site. Your continued use of the service after such changes constitutes your acceptance of the new Terms.</p>
            <h3>7. Contact Us</h3>
            <p>If you have any questions about these Terms, please <a href="#contact">contact us</a>.</p>
        </>
    },
};

export default function App() {
  const [route, setRoute] = useState(parseRoute());
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [lastParams, setLastParams] = useState<GenerateVideoParams | null>(null);
  const [lastGeneratedVideo, setLastGeneratedVideo] = useState<Video | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseRoute());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const performGeneration = useCallback(
    async (params: GenerateVideoParams) => {
      setAppState(AppState.LOADING);
      setLastParams(params);
      setError(null);

      try {
        const {objectUrl, blob, video} = await generateVideo(params);
        setVideoUrl(objectUrl);
        setVideoBlob(blob);
        setLastGeneratedVideo(video);
        setAppState(AppState.SUCCESS);
      } catch (e: unknown) {
        console.error('Video generation failed:', e);
        const errorMessage = e instanceof Error ? e.message : String(e);
        setError(errorMessage);
        setAppState(AppState.ERROR);
      }
    },
    [],
  );

  const handleGenerate = useCallback(async (params: GenerateVideoParams) => {
    await performGeneration(params);
  }, [performGeneration]);

  const handleRetry = useCallback(() => {
    if (lastParams) {
      handleGenerate(lastParams);
    }
  }, [lastParams, handleGenerate]);

  const handleNewVideo = useCallback(() => {
    setAppState(AppState.IDLE);
    setVideoUrl(null);
    setVideoBlob(null);
    setLastParams(null);
    setLastGeneratedVideo(null);
    setError(null);
  }, []);

  const handleExtend = useCallback(() => {
    if (lastGeneratedVideo) {
      const extendParams = {
        ...lastParams,
        mode: GenerationMode.EXTEND_VIDEO,
        inputVideoObject: lastGeneratedVideo,
        // Reset frames and references when extending
        startFrame: null,
        endFrame: null,
        referenceImages: [],
        styleImage: null,
      };
      setAppState(AppState.IDLE);
      setVideoUrl(null);
      setVideoBlob(null);
      setError(null);
      setLastParams(extendParams as GenerateVideoParams); // Set new state for PromptForm
    }
  }, [lastGeneratedVideo, lastParams]);

  const renderContent = () => {
    const { page, param } = route;

    if (page === 'article' && param && articlesData[param as ArticleSlug]) {
      const { title, content } = articlesData[param as ArticleSlug];
      return <ArticlePage title={title}>{content}</ArticlePage>;
    }

    if (page === 'blog') {
      return <BlogPage />;
    }
    
    if (page === 'contact') {
      return <ContactPage />;
    }
    
    if (page === 'gallery') {
      return <GalleryPage />;
    }
    
    if (page === 'howitworks') {
      return <HowItWorksPage />;
    }
    
    if (infoPageData[page as DialogType]) {
      const { title, content } = infoPageData[page as DialogType];
      return <InfoPage title={title}>{content}</InfoPage>;
    }

    // Default to home page content
    switch (appState) {
      case AppState.LOADING:
        return <LoadingIndicator />;
      case AppState.SUCCESS:
        if (videoUrl) {
          return (
            <VideoResult
              videoUrl={videoUrl}
              videoBlob={videoBlob}
              onRetry={handleRetry}
              onNewVideo={handleNewVideo}
              onExtend={handleExtend}
              canExtend={
                lastGeneratedVideo?.resolution === Resolution.P720 &&
                lastParams?.model === VeoModel.VEO
              }
            />
          );
        }
        return null;
      case AppState.ERROR:
        return (
          <div className="text-center p-8 bg-red-900/30 rounded-lg">
            <h3 className="text-2xl font-bold text-red-400">
              Something Went Wrong
            </h3>
            <p className="text-red-300 mt-2 mb-4 max-w-xl mx-auto">{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
              Try Again
            </button>
          </div>
        );
      case AppState.IDLE:
      default:
        return <PromptForm onGenerate={handleGenerate} initialValues={lastParams} />;
    }
  };


  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-900 text-gray-200">
      <Header />
      <main className="w-full max-w-4xl flex-grow p-4 sm:p-8 flex items-center justify-center">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}