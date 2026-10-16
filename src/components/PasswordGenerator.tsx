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
        title="Free Password Generator — Strong, Random & Secure"
        description="Generate a strong, random password of 8, 12, 16 or up to 128 characters. It is created locally in your browser, with look-alike characters (I, O, l, 1, 0) excluded."
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
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
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
            <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase block">
              Security &amp; Entropy
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight mt-3 flex items-center gap-2">
              <KeyRound className="w-6 h-6 text-purple-600 dark:text-purple-400" aria-hidden="true" />
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
            Free Online Password Generator for Strong, Random, Secure Passwords
          </h2>

          <div className="my-6">
            <SemanticGuideImage
              toolKey="password"
              alt="Computer screen showing a long random string of letters, numbers and symbols, like a strong password made by a password generator."
            />
          </div>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            This <strong className="font-semibold text-slate-900 dark:text-white">free password generator</strong> creates a strong, random password in one click. Choose a length from a short 8 characters up to 128, decide which numbers and symbols are allowed, and copy the result. Everything happens in your browser, so the password you generate is never sent to a server, saved or logged. Below you will find how it works, how long a password should be, and the habits that keep your accounts safe.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            How to Use This Random Password Generator
          </h2>

          <ol className="list-decimal pl-6 space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            <li>Set the <strong className="font-semibold text-slate-900 dark:text-white">Length</strong>. The default is 12 characters; use 16 or more for email, banking and your password manager.</li>
            <li>Edit <strong className="font-semibold text-slate-900 dark:text-white">Numbers to include</strong> and <strong className="font-semibold text-slate-900 dark:text-white">Symbols to include</strong> to match a site&apos;s rules. Clear the symbols box for a password with no special characters.</li>
            <li>The password updates as you change a setting. Press <strong className="font-semibold text-slate-900 dark:text-white">Generate new password</strong> for another one, then <strong className="font-semibold text-slate-900 dark:text-white">Copy to clipboard</strong>.</li>
            <li>Paste it straight into the sign-up form and save it in a password manager so you never have to memorize it.</li>
          </ol>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            What Is a Password Generator and How Does It Work?
          </h2>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            What is a password generator?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            A password generator is a tool that builds a password for you from random characters instead of from words, names or dates you would think of yourself. <strong className="font-semibold text-slate-900 dark:text-white">Human-made passwords follow patterns that attackers already know</strong>, such as a capitalized word followed by a number and an exclamation mark. A generator has no habits, so it produces complex passwords with no pattern to guess.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            How does a random password generator work?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            The generator builds a pool of allowed characters: uppercase letters, lowercase letters, and the numbers and symbols you list. It then asks your browser&apos;s cryptographic random number source, <code className="text-xs bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-stone-200 px-2 py-0.5 rounded-full font-mono border border-stone-200/80 dark:border-slate-700">crypto.getRandomValues</code>, for one random value per position and maps each value to a character in the pool. This is the same Web Cryptography API that browsers use for security features, and it is far less predictable than a basic random function.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Are online password generators safe and secure?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            It depends on where the password is made. A safe password generator creates the password on your own device and never transmits it. This one does exactly that: generation runs locally, there is no account, and nothing you create is stored. If a generator needs to send your settings or results to a server, or asks you to sign up first, choose a different one.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            How Long Should a Strong Password Be? 8, 12, 16 or 20 Characters
          </h2>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Length matters more than any other setting, because every extra character multiplies the number of guesses an attacker needs. With this generator&apos;s default character set of 69 characters, each position adds about 6.1 bits of randomness. That works out to roughly:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            <li><strong className="font-semibold text-slate-900 dark:text-white">8 characters:</strong> about 49 bits. Acceptable only when a site refuses anything longer.</li>
            <li><strong className="font-semibold text-slate-900 dark:text-white">12 characters:</strong> about 73 bits. A solid everyday minimum for a strong password.</li>
            <li><strong className="font-semibold text-slate-900 dark:text-white">16 characters:</strong> about 98 bits. The best default for email, banking and any account that can reset others.</li>
            <li><strong className="font-semibold text-slate-900 dark:text-white">20 characters or more:</strong> about 122 bits and up. Ideal for master passwords, encryption keys and anything you will paste rather than type.</li>
          </ul>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Is a 12-character generated password strong enough?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            For most ordinary accounts, yes. A truly random 12-character password is out of reach for online guessing and very expensive to attack offline. The caveat is reuse: a 12-character password used on five sites is only as safe as the weakest of those sites. When you can, pick 16 characters instead, because a longer password costs you nothing once a manager fills it in for you.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Can I use it for a WiFi or temporary password?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Yes. For a home WiFi network, generate 16 to 20 characters; WPA2 and WPA3 passphrases can be 8 to 63 characters long. Because the generator drops confusable characters, the password is easier to read out or type on a TV or console. For a temporary password you give someone else, generate one, share it privately, and ask them to change it after the first login.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Password Generator With or Without Special Characters
          </h2>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Symbols enlarge the pool of possible characters, which makes each position harder to guess, so they are on by default (<code className="text-xs bg-stone-100 dark:bg-slate-800 text-stone-800 dark:text-stone-200 px-2 py-0.5 rounded-full font-mono border border-stone-200/80 dark:border-slate-700">!@#$%^&amp;*_-+=</code>). Some sites, however, reject certain symbols or ban them completely. In that case remove the offending characters, or clear the box to get letters and numbers only, and make the password a few characters longer to make up for the smaller pool.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-100">
            Why are I, O, l, 1 and 0 left out?
          </h3>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Uppercase I, uppercase O, lowercase l, the number 1 and the number 0 look alike in many fonts. Excluding them gives you an easy-to-read, easy-to-type password with a very small cost in strength, which is useful whenever you have to read a password aloud, copy it by hand or enter it on a device without a clipboard.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Random Passwords vs. Passphrases and Memorable Passwords
          </h2>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            This tool creates random character strings, which are the strongest choice for any password a manager will remember for you. They are not designed to be memorized. For the few passwords you must keep in your head, such as a device login or your password manager&apos;s master password, a <strong className="font-semibold text-slate-900 dark:text-white">passphrase</strong> of four or more unrelated words chosen at random (the approach popularized by the XKCD &ldquo;correct horse battery staple&rdquo; comic) is easier to remember and can be just as strong. The key is that the words are picked at random; a favorite quote or song lyric is not a passphrase.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Password Generator vs. Password Manager
          </h2>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            A generator makes the password; a manager remembers it. Using both is the practical way to have a unique, long, random password for every account without memorizing any of them. <strong className="font-semibold text-slate-900 dark:text-white">Generate here, then save the result in an encrypted password manager</strong>. Free options exist, including open-source managers and the built-in managers in major browsers and phones. Whatever you pick, protect it with a long master password and turn on two-step verification.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-slate-900 dark:text-white tracking-tight">
            Common Password Mistakes to Avoid
          </h2>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            The most damaging mistake is <strong className="font-semibold text-slate-900 dark:text-white">password reuse</strong>, because a single breach then opens every account that shares the password. Other common errors include building passwords from names, birthdays or keyboard runs, adding a symbol to a dictionary word, keeping passwords on sticky notes or in plain text files, and sharing them over chat or email. Our generator runs 100% locally in your browser using the Web Cryptography API. Learn more in our <Link to="/privacy" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Client-Side Privacy Policy</Link> and <Link to="/about" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Technical Methodology</Link>, or return to our <Link to="/" className="text-teal-700 dark:text-teal-400 font-semibold underline hover:text-teal-600">Easy Grade Tool</Link>.
          </p>
        </ContentSection>

      <FAQ tool="password" />
    </>
  );
};
