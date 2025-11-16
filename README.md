# Score Tracker PWA

A simple, elegant Progressive Web App for tracking scores between two players. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **50/50 Split Layout**: Blue and red sides for two players
- **Tap to Increment**: Simply tap either side to add a point
- **Hold to Edit**: Long press (500ms) to manually edit the score
- **Reset Button**: Clear both scores and start fresh
- **PWA Support**: Install on iPhone and Android devices
- **Responsive Design**: Works on all screen sizes
- **Offline Capable**: Service worker for offline functionality

## Getting Started

### Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Deploy to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your repository to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Click "Deploy"

3. Your app will be live at `https://your-project.vercel.app`

### PWA Installation

Once deployed, users can install the app on their devices:

**iOS:**
1. Open the app in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"

**Android:**
1. Open the app in Chrome
2. Tap the menu button (three dots)
3. Tap "Add to Home Screen"

## How to Use

- **Tap** the blue or red side to increase that player's score by 1
- **Hold** (press and hold for 500ms) on either side to open the editor and manually set the score
- **Tap Reset** at the top to set both scores back to 0

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [next-pwa](https://github.com/shadowwalker/next-pwa) - PWA support

## Project Structure

```
score-tracker/
├── app/
│   ├── layout.tsx      # Root layout with PWA metadata
│   ├── page.tsx        # Main score tracking component
│   └── globals.css     # Global styles
├── public/
│   ├── manifest.json   # PWA manifest
│   └── icon.svg        # App icon
├── next.config.ts      # Next.js configuration with PWA
└── vercel.json         # Vercel deployment config
```

## License

MIT
