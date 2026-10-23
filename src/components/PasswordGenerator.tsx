import React, { useState, useEffect, useCallback } from 'react';
import { Link } from './SlashLink';
import { Copy, Check, RefreshCw, KeyRound } from 'lucide-react';
import { ToolHeading } from './ToolHeading';
import { SEO } from './SEO';
import { parseNumber } from '../utils/formatters';
import { AmbientAura } from './AmbientAura';
import { SEO_ROUTES } from '../data/seoConfig';
import { GUIDE_IMAGES } from '../data/guideImages';
import { SemanticGuideImage } from './SemanticGuideImage';
import { FAQ } from './FAQ';
import { ContentSection } from './GuideShell';

interface PasswordGeneratorProps {
  setToast: (msg: string) => void;
}

// Strictly exclude look-alike / confusable characters:
// Uppercase 'I', Uppercase 'O', Lowercase 'l', Number '1', Number '0'
const LOOK_ALIKE_REGEX = /[IOl10]/g;
const SAFE_UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Excludes 'I' and 'O'
const SAFE_LOWER = 'abcdefghijkmnopqrstuvwxyz'; // Excludes 'l'

function generateCryptographicPassword(
  length: number,
  customNumbers: string,
  customSymbols: string
): string {
  const validLength = Math.min(128, Math.max(1, length));
  // Filter out any confusable characters (I, O, l, 1, 0)
  const safeNums = customNumbers.replace(LOOK_ALIKE_REGEX, '');
  const safeSyms = customSymbols.replace(LOOK_ALIKE_REGEX, '');

  let pool = SAFE_UPPER + SAFE_LOWER + safeNums + safeSyms;
  const finalPool = pool.replace(LOOK_ALIKE_REGEX, '') || (SAFE_LOWER + '23456789');

  const randomValues = new Uint32Array(validLength);
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(randomValues);
  } else if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(randomValues);
  } else {
    for (let i = 0; i < validLength; i++) {
      randomValues[i] = Math.floor(Math.random() * 10000000);
    }
  }

  return Array.from(randomValues, (n) => finalPool[n % finalPool.length]).join('');
}

export const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({ setToast }) => {
  // Inputs:
  // 1. A simple number input for "Length" (default 12)
  const [length, setLength] = useState<string>('12');
  // 2. A text field for "Numbers to include"
  const [numbersToInclude, setNumbersToInclude] = useState<string>('23456789');
  // 3. A text field for "Symbols to include"
  const [symbolsToInclude, setSymbolsToInclude] = useState<string>('!@#$%^&*_-+=');

  const [copied, setCopied] = useState<boolean>(false);

  // Generated Password State
  const [password, setPassword] = useState<string>(() =>
    generateCryptographicPassword(12, '23456789', '!@#$%^&*_-+=')
  );

  const handleGenerate = useCallback(() => {
    const len = parseNumber(length, 12);
    const newPwd = generateCryptographicPassword(len, numbersToInclude, symbolsToInclude);
    setPassword(newPwd);
  }, [length, numbersToInclude, symbolsToInclude]);

  // Immediately update password when length or character settings change
  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const handleCopy = async () => {
    let copiedSuccessfully = false;

    // Check for secure context and modern Clipboard API
    if (typeof window !== 'undefined' && window.isSecureContext && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(password);
        copiedSuccessfully = true;
      } catch {
        // Fall back to legacy document.execCommand if clipboard permission is denied or blocked in iframe
        copiedSuccessfully = false;
      }
    }

    // Legacy fallback using textarea and document.execCommand('copy')
    if (!copiedSuccessfully && typeof document !== 'undefined') {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = password;
        textArea.style.position = 'fixed';
        textArea.style.top = '-9999px';
        textArea.style.left = '-9999px';
        textArea.style.opacity = '0';
        textArea.setAttribute('readonly', '');
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        copiedSuccessfully = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch {
        copiedSuccessfully = false;
      }
    }

    if (copiedSuccessfully) {
      setCopied(true);
      setToast('Password copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } else {
      setToast('Copy is unavailable in this browser.');
    }
  };

  return (
    <>
      <SEO
        title={SEO_ROUTES.password.title}
        description={SEO_ROUTES.password.description}
        canonicalUrl={SEO_ROUTES.password.canonicalUrl}
        ogImage={SEO_ROUTES.password.ogImagePlaceholder}
        keywords={SEO_ROUTES.password.keywords}
        applicationCategory={SEO_ROUTES.password.applicationCategory}
        featureList={SEO_ROUTES.password.featureList}
      />
      <ToolHeading
        badge="Password Generator"
        title="Password Generator — Create Secure Random Passwords"
        description="Use our free Password Generator to create cryptographically secure random passwords locally in your browser with look-alike characters (I, O, l, 1, 0) excluded."
      />

      <div className="relative tool-layout font-sans">
        <AmbientAura />

        {/* Left Inputs & Generation Panel */}
        <section
          aria-label="Password Generator Configuration"
          className="bg-white dark:bg-slate-900 rounded-[32px] border border-white/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden p-6 sm:p-8 space-y-6"
        >
          {/* Password Display - Primary Master Output */}
          <div className="relative p-5 rounded-[28px] bg-[#DBEAFE] dark:bg-teal-950/60 border border-[#BFDBFE] dark:border-teal-800/60 shadow-sm flex items-center justify-center" aria-live="polite">
            <span className="font-mono text-base sm:text-xl font-extrabold tracking-wider text-teal-950 dark:text-teal-100 break-all select-all block text-center px-8">
              {password}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-2 rounded-full text-teal-700 dark:text-teal-400 hover:text-teal-900 hover:bg-teal-100/50 dark:hover:bg-teal-900/50 transition-all cursor-pointer"
              title="Copy password to clipboard"
              aria-label="Copy password to clipboard"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Controls: "Generate new password" button and "Copy to clipboard" button */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              className="bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-teal-600 dark:hover:bg-teal-500 text-white rounded-full font-bold shadow-md px-6 py-3 transition-all inline-flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer active:scale-95"
              onClick={handleGenerate}
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              <span>Generate new password</span>
            </button>

            <button
              type="button"
              className={`rounded-full px-6 py-3 inline-flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm transition-all border cursor-pointer active:scale-[0.98] ${
                copied
                  ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700 font-semibold shadow-xs'
              }`}
              onClick={handleCopy}
              aria-label="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" aria-hidden="true" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy to clipboard</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-5 border-t border-slate-200/60 dark:border-slate-800 space-y-4">
            {/* 1. Length Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password-length" className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-300 uppercase">
                Length
              </label>
              <input
                id="password-length"
                type="number"
                inputMode="numeric"
                min="4"
                max="128"
                step="1"
                className="w-full bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-3.5 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-lg text-center placeholder:text-slate-400"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="12"
              />
            </div>

            {/* 2. Numbers to include */}
            <div className="flex flex-col gap-2">
              <label htmlFor="numbers-to-include" className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-300 uppercase">
                Numbers to include
              </label>
              <input
                id="numbers-to-include"
                type="text"
                className="w-full bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-3.5 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-center text-base sm:text-sm placeholder:text-slate-400"
                value={numbersToInclude}
                onChange={(e) => setNumbersToInclude(e.target.value)}
                placeholder="23456789"
              />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Look-alike numbers (0 and 1) are automatically excluded.
              </span>
            </div>

            {/* 3. Symbols to include */}
            <div className="flex flex-col gap-2">
              <label htmlFor="symbols-to-include" className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-300 uppercase">
                Symbols to include
              </label>
              <input
                id="symbols-to-include"
                type="text"
                className="w-full bg-[#F0F2F5] dark:bg-slate-800/90 border-2 border-transparent text-stone-900 dark:text-white rounded-full px-5 py-3.5 focus:bg-white dark:focus:bg-slate-900 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 transition-all font-bold text-center text-base sm:text-sm placeholder:text-slate-400"
                value={symbolsToInclude}
                onChange={(e) => setSymbolsToInclude(e.target.value)}
                placeholder="!@#$%^&*_-+="
              />
            </div>
          </div>
        </section>

        {/* Right Info Card */}
        <section
          aria-label="Security and Entropy"
          className="bg-white dark:bg-slate-900 rounded-[32px] border border-white/80 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden p-6 sm:p-8 flex flex-col justify-between"
        >
          <div>
            <span className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-400 uppercase block">
              Security &amp; Entropy
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight mt-3 flex items-center gap-2">
              <KeyRound className="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span>Cryptographic</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium text-sm mt-2">
              Generated locally using <code className="text-xs bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-stone-200 px-2 py-0.5 rounded-full font-mono border border-stone-200/80 dark:border-slate-700">crypto.getRandomValues</code> for maximum cryptographic randomness.
            </p>

            <div className="rounded-[24px] border border-stone-200/80 dark:border-slate-800 bg-[#F8F9FA] dark:bg-slate-800/60 p-5 text-xs space-y-2 text-slate-600 dark:text-slate-300 mt-6 shadow-xs">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                <span>Confusable Characters Excluded</span>
              </div>
              <p className="text-xs leading-relaxed m-0 text-slate-500 dark:text-slate-400">
                Look-alike characters (<strong className="text-slate-900 dark:text-white">I</strong>, <strong className="text-slate-900 dark:text-white">O</strong>, <strong className="text-slate-900 dark:text-white">l</strong>, <strong className="text-slate-900 dark:text-white">1</strong>, <strong className="text-slate-900 dark:text-white">0</strong>) are automatically filtered out to ensure perfect readability.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Optimized Educational & SEO Content for Password Generator */}
      <ContentSection labelledBy="password-guide-title">
          <h2
            id="password-guide-title"
            className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100 tracking-tight"
          >
            Password Generator — Create Strong, Random Passwords Fast
          </h2>

          <div className="my-6">
            <SemanticGuideImage
              toolKey="password"
              alt="A close view of a computer screen showing a long string of mixed letters, numbers, and symbols."
            />
          </div>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            A strong password is your first defense against account theft. The best ones are long and mix upper-case letters, lower-case letters, numbers and symbols. This guide explains how a password generator works and how to <strong className="font-semibold text-slate-900 dark:text-white">create strong, random passwords quickly</strong>. Use a different one for every account. That is the best way to stay safe when one site is hacked, because attackers replay stolen credentials on other sites.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Understanding Password Generators
          </h2>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            A generator does the inventing for you. It replaces the habits people fall into, such as pet names and simple patterns, with random choices that no one can predict, which helps keep your email, banking and shopping accounts safe.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            What is a Password Generator?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            A password generator is a small program that builds a random password on demand. <strong className="font-semibold text-slate-900 dark:text-white">Our generator produces strings that are very hard to crack with dictionary lists or brute-force guessing.</strong> People tend to pick names, birthdays or keyboard patterns. A random generator picks every character by chance, so there is no pattern to find.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            How Does a Random Password Generator Work?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            A random password generator picks each character by chance from a set you choose: upper-case letters, lower-case letters, numbers and symbols. You choose the length, and we suggest at least 16 characters. Because every character is picked on its own, the result has no pattern to guess. Length does most of the work: 16 characters drawn from roughly 94 printable symbols give about 105 bits of entropy, while 8 characters give only about 52. Our generator uses the Web Cryptography API built into your browser, so each result is made on your device and is never sent anywhere. Many browsers and password managers have a built-in generator that works in a similar way.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Benefits of Using a Password Generator
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            The main benefit is a unique credential for every account, with no reuse. <strong className="font-semibold text-slate-900 dark:text-white">If one site is hacked, your other accounts stay safe.</strong> A generator also saves time: a strong result arrives in a fraction of a second, so you do not have to invent one yourself.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Creating Strong and Unique Passwords
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Why You Need Strong Passwords
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Attackers feed stolen and common entries into many sites at once. A weak or reused one can let them into your email, and from there into your other accounts. <strong className="font-semibold text-slate-900 dark:text-white">A random, unique password for each account is the simplest way to stop this.</strong> A password manager can remember them all for you.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            How to Create a Strong Password
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            The easiest route is to let a generator do the work. Choose a length of at least 16 characters, keep every character type switched on, then store the result in a password manager. Do not try to build one by hand: people make small, predictable changes, such as swapping an a for an @ sign, and attackers know those tricks.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Characteristics of Strong and Unique Passwords
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            A strong password is long, random and used for only one account. It contains no personal details, no dictionary words and nothing from the common lists, such as 123456. When each account has its own, a single leak cannot open the others.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Free Password Generator Options
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Top Free Password Generators Available
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Plenty of free generators exist. <strong className="font-semibold text-slate-900 dark:text-white">Look for one that lets you set the length and the character types.</strong> Most modern browsers and password managers include one, and ours is free, needs no account and runs in your browser.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Using a Free Random Password Generator Safely
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Pick a generator you trust. The safest ones build the result on your own device and never store or send it, and the page should say so. If a tool sends what it creates to a server, you cannot know who can see it. Once you have a new one, save it in a password manager rather than a note or a text file.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Comparing Free Password Generators
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            When you compare generators, look at three things. Can you choose the length and the character types? Is it easy to use? Does it keep your passwords private? Browser generators are handy because they can save the password for you. Standalone sites such as ours work in any browser and need no sign-in. Password managers also include a generator and keep your passwords in an encrypted vault.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Password Security Best Practices
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Importance of Password Security
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            <strong className="font-semibold text-slate-900 dark:text-white">Good habits protect your email, your money and your personal files.</strong> Your email account matters most, because many sites let you reset a password by email. If someone gets into it, they can often get into the rest. A strong, unique password on every account stops one leak from turning into many.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Using a Password Manager for Enhanced Security
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            A generator creates the strong ones; a password manager remembers them. <strong className="font-semibold text-slate-900 dark:text-white">A password manager keeps everything in one encrypted vault, so you only need to remember a single strong master password.</strong> Most managers can also fill logins in for you and warn you about reused ones, which makes it much easier to give every account its own.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Common Mistakes to Avoid in Password Management
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            A few common slips can weaken even strong ones. The biggest is <strong className="font-semibold text-slate-900 dark:text-white">reusing the same password on several accounts</strong>. If one site is breached, attackers try that same login everywhere else. Other slips are using birthdays or dictionary words, even with a symbol added, and keeping credentials on sticky notes or in shared documents. Our generator runs entirely in your browser using the Web Cryptography API. You can read more in our <Link to="/privacy" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Client-Side Privacy Policy</Link> and <Link to="/about" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Technical Methodology</Link>, or return to our <Link to="/" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Easy Grade Tool</Link>.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Password Generator FAQs
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Common Questions About Password Generators
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            People often ask how to tell whether a generator is truly random, whether a lost result can be recovered, and how long it should be. A good generator picks characters by chance. Ours does not store or send what it makes, so a lost one cannot be recovered; save each in a password manager straight away. <strong className="font-semibold text-slate-900 dark:text-white">Use at least 16 characters, with upper-case letters, lower-case letters, numbers and symbols.</strong> Make a new one for every account and never reuse any.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            How to Choose the Right Password Generator
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Choose a generator that lets you set the length and the character types, and that can leave out look-alike characters such as I, O, l, 1 and 0. It should also protect your privacy by working on your device and storing nothing. A password manager with a built-in generator is a good choice, because it creates and saves in one step.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Understanding Generated Passwords
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            A generated password is a random string with no pattern and no personal details. It is meant to live in a password manager, not in your memory, and that randomness is what makes it hard to crack with dictionary lists or brute force. Aim for at least 16 characters, keep every character type on and never share one between accounts.
          </p>
        </ContentSection>

      <FAQ tool="password" />
    </>
  );
};
