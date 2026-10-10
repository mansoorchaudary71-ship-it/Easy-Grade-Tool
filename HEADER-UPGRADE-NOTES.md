# Header / toolbar upgrade (One UI style glassmorphism)

Files (drop into the repo at the same paths):
- src/components/Navbar.tsx          full rewrite
- src/components/PWAInstallButton.tsx  full rewrite of the button styling
- src/index.css                      one added line: @custom-variant dark (&:where(.dark, .dark *));

Notes
- The custom dark variant makes every Tailwind `dark:` utility follow the app's theme toggle (.dark on <html>)
  instead of only the OS setting.
- The header no longer uses the legacy .topbar / .tool-nav / .tool-nav-item / .theme-toggle-btn /
  .command-nav-trigger classes; those rules in index.css are now unused but harmless (.topbar is still
  referenced by the print stylesheet and scripts/test-site-qa.ts).
- Uses the `motion` package already in package.json (motion/react). No new dependencies.
