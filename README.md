# aiStudi — AI-Powered Study Assistant

[GitHub Repository](https://github.com/theadarsh1m/aiStudi)

**aiStudi** is a premium, fully interactive, and responsive educational product that transforms lecture notes, textbook passages, or transcripts into structured flashcards and quizzes using **Google Gemini 3.1 Flash Lite**. 

Built with Next.js, Tailwind CSS, and Framer Motion, it features offline session persistence, automated request timeouts, user-friendly cancellation gates, loading skeletons, and robust class-based React error boundaries.

---

## Key Features

- 🪄 **AI Study Generation**: Converts raw texts (20 - 8,000 characters) into clean, Zod-validated flashcards and practice quizzes.
- 🗂️ **Interactive Flashcards Canvas**:
  - Fluid 3D-like flip animations and slide transitions.
  - Active recall statistics dashboard tracking card progress.
  - Difficulty ratings ("Easy", "Medium", "Hard") and star bookmark filtering.
  - Full keyboard shortcuts (`Space` to flip, `ArrowLeft`/`ArrowRight` to navigate, `R` to restart).
- 📝 **Interactive Practice Quiz**:
  - Live elapsed time offset timer tracking durations.
  - Dynamic option state selectors with immediate response feedback and rational explanations.
  - Target review mode allowing retesting of wrong answers.
- 💾 **Local Session Persistence**:
  - Versioned local storage schemas checking data integrity via Zod.
  - Complete import/export functionality to backup study sessions as JSON files.
- 🛡️ **AI Robustness & Production Readiness**:
  - Inline input constraints checking with live character counters.
  - Client-controlled AbortControllers with instant "Cancel" request triggers.
  - Translucent glass loading overlays keeping active sessions readable during regeneration.
  - Custom structured exception mapping handling disconnections, rate limits (HTTP 429), and timeouts.
  - Wraps widgets in a class-based React `ErrorBoundary` fallback page.

---

## Tech Stack

- **Core**: Next.js 15+ (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI Integration**: Google Gen AI SDK (`gemini-3.1-flash-lite`)
- **Validation**: Zod Schemas
- **Alerts & UI**: Sonner Toast Notifications, Lucide Icons

---

## Folder Structure

```text
├── app/
│   ├── api/study/generate/     # Route handler communicating with Gemini
│   ├── globals.css             # Main styling layer & design tokens
│   ├── layout.tsx              # Root HTML frame & layout structures
│   └── page.tsx                # Entry home container
├── components/
│   ├── errors/                 # ErrorCard, RetryButton, Skeletons, ErrorBoundary
│   ├── flashcards/             # Flashcard deck canvas, stats, controls
│   ├── home/                   # Hero banner, StudyInput, marketing panels
│   ├── layout/                 # Main header, footer, container dividers
│   ├── quiz/                   # MCQ options, timers, scores, recap sheets
│   └── ui/                     # Reusable design buttons, inputs, themes
├── hooks/                      # Custom React hooks (auto-resize, persistent states)
├── lib/
│   ├── ai/                     # Google Gemini SDK instance settings
│   ├── prompts/                # Standardized system prompts
│   ├── services/               # Generative execution and fallback cascades
│   ├── storage/                # Safe localStorage wrappers
│   ├── types/                  # Structured typings
│   ├── utils/                  # JSON format extractors
│   └── validators/             # Zod schema definitions
```

---

## Setup & Environment Setup

### 1. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your Google AI Studio API key:
```bash
cp .env.example .env.local
```

Ensure `.env.local` contains:
```env
# Google Gemini API Key - Retrieve one from Google AI Studio (https://aistudio.google.com)
GEMINI_API_KEY=your_gemini_api_key_here

# Google Gemini Model Choice - Default is gemini-3.1-flash-lite
GEMINI_MODEL=gemini-3.1-flash-lite
```

### 2. Run the Development Server
Install dependencies and spin up the next server:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Production Build & Linting

Verify that TypeScript types and ESLint configs compile cleanly:
```bash
# Type-check
npx tsc --noEmit

# Lint
npm run lint

# Compile production bundle
npm run build
```

---

## Future Improvements & Roadmap

- **Cloud Synchronization**: Sync study decks across multiple devices via databases (e.g. Supabase, PostgreSQL) and authentication layers (e.g. NextAuth).
- **PDF & Document Uploaders**: Support directly parsing uploaded text files, PDFs, or slides using server-side document readers.
- **Spaced Repetition Algorithms**: Track card reviews and schedule review notifications using spacing algorithms (SuperMemo SM-2).

---

## Known Limitations

- **Statefulness**: Currently uses local storage for session persistence; clearing browser data will clear progress if not exported.
- **Input Constraints**: Cannot parse non-text formats (images, PDFs) directly without third-party services.
- **Large Contexts**: Notes are capped at 8,000 characters to ensure the model responds within a reasonable time and avoids context window limits.

---

## AI-Usage Note

During the development of this project, AI assistants were used to:
- Draft boilerplate Next.js and Tailwind CSS structures.
- Iterate on Framer Motion animation configurations for the flashcard flip effect.
- Generate generic dummy data for testing purposes.
- Refine system prompts for more consistent JSON output from the Gemini API.

All core logic, error handling cascades, state management, and architectural decisions were made manually to ensure a robust and reliable application.

---

## Time Spent

- **Planning & Setup**: 1 hour
- **Core UI & State Management**: 2.5 hours
- **AI Integration & Error Handling (Zod, Fallbacks)**: 2 hours
- **Polish, Animations & Persistence**: 2 hours
- **Total Time**: ~7.5 hours
