# PodRead

**Visual Notes for Your Ears.**

PodRead is a Next.js application that provides a premium, "Economist-style" reading experience for AI-generated podcast analysis.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + Tailwind CSS 4
- **Authentication**: NextAuth.js v5 (Google OAuth)
- **Markdown**: remark + rehype ecosystem
- **Typography**: Crimson Text (serif) + Inter (sans-serif)

## Features

- **Premium Reading Experience**: Custom typography and styling designed for readability
- **Visual Notes**: Rich markdown rendering with special formatting for quotes and lists
- **Paywall Integration**: Automatic paywall for episodes older than 30 days
- **Google Authentication**: Secure login to access premium content
- **Full-text Search**: Search across episode titles, channels, and content
- **Channels Index**: Browse all channels with episode counts
- **Infinite Scroll**: Paginated loading on channel and search pages

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Navigate to the project directory:
   ```bash
   cd podread
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up authentication:
   Create a `.env.local` file with your Google OAuth credentials:
   ```env
   AUTH_SECRET="your-generated-secret" # Run `openssl rand -base64 33` to generate
   AUTH_GOOGLE_ID="your-google-client-id"
   AUTH_GOOGLE_SECRET="your-google-client-secret"
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser.

## Data Pipeline

The application relies on a `data/episodes.json` file. This is generated from raw analysis files using the migration script.

To update the data:
```bash
node scripts/migrate.js
```

## Project Structure

```
podread/
├── app/
│   ├── page.tsx                    # Home page - episode grid
│   ├── layout.tsx                  # Root layout with sidebar
│   ├── globals.css                 # Global styles + prose styling
│   ├── actions.ts                  # Server actions (search, fetch)
│   ├── components/
│   │   ├── Header.tsx              # Navigation header
│   │   └── Sidebar.tsx             # Collapsible channel navigation
│   ├── episode/[slug]/page.tsx     # Individual episode page
│   ├── channel/[channelName]/page.tsx  # Channel feed page
│   ├── channels/page.tsx           # All channels index
│   ├── search/page.tsx             # Search results page
│   └── subscribe/page.tsx          # Subscription page
├── components/
│   ├── AuthButton.tsx              # Sign in/out with Google
│   ├── SearchBar.tsx               # Search input with dropdown
│   ├── EpisodeCard.tsx             # Episode card component
│   └── ChannelFeed.tsx             # Infinite scroll feed
├── lib/
│   ├── auth.ts                     # Auth helper (isAdmin check)
│   └── markdown.ts                 # Markdown processing
├── types/
│   └── episode.ts                  # Episode TypeScript interface
├── data/
│   └── episodes.json               # Episode database
├── scripts/
│   └── migrate.js                  # TXT/MD to JSON converter
└── auth.ts                         # NextAuth configuration
```

---

## Episode Page Architecture

### Route: `/episode/[slug]`

The episode page (`app/episode/[slug]/page.tsx`) renders individual podcast summaries.

### Rendering Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         Episode Page                            │
├─────────────────────────────────────────────────────────────────┤
│  1. getEpisode(slug)        → Fetch episode from episodes.json  │
│  2. isAdmin()               → Check if user is authenticated    │
│  3. processMarkdown()       → Convert MD content to styled HTML │
│  4. Render                  → Display with paywall logic        │
└─────────────────────────────────────────────────────────────────┘
```

### Components Used

#### 1. Header (`app/components/Header.tsx`)
Top navigation bar containing:
- **Logo**: PodRead branding with link to home
- **SearchBar**: Full-text search with dropdown results
- **AuthButton**: Google sign in/out
- **Subscribe Button**: CTA for premium subscription

```
┌──────────────────────────────────────────────────────────────┐
│  [P] PodRead          [Search...]    Sign In    [Subscribe]  │
└──────────────────────────────────────────────────────────────┘
```

#### 2. Article Header
Displays episode metadata:
- Channel name (links to channel page)
- Episode title
- Publication date, duration, view count

#### 3. Content Area
The main content rendered with:
- **Prose styling** via `@tailwindcss/typography`
- **Custom formatting** via `lib/markdown.ts`

#### 4. Paywall (Conditional)
For premium episodes (>30 days old) when user is not authenticated:
- Shows first 3 paragraphs as teaser
- Gradient fade overlay
- Subscribe CTA box

### Data Flow

```
episodes.json
     │
     ▼
┌─────────────┐
│ getEpisode()│ ── Find by slug
└─────────────┘
     │
     ▼
┌─────────────────┐
│ processMarkdown │ ── Transform content
└─────────────────┘
     │
     ▼
┌─────────────┐
│   Render    │ ── Display with paywall logic
└─────────────┘
```

---

## Markdown Processing (`lib/markdown.ts`)

The markdown processor transforms raw MD content into beautifully styled HTML.

### Processing Pipeline

```
Raw Markdown
     │
     ▼
┌─────────────┐
│   remark    │ ── Parse markdown
└─────────────┘
     │
     ▼
┌─────────────┐
│ remarkGfm   │ ── GitHub Flavored Markdown (tables, etc.)
└─────────────┘
     │
     ▼
┌──────────────┐
│ remarkRehype │ ── Convert to HTML AST
└──────────────┘
     │
     ▼
┌─────────────┐
│  rehypeRaw  │ ── Preserve raw HTML
└─────────────┘
     │
     ▼
┌────────────────┐
│ rehypeStringify│ ── Convert to HTML string
└────────────────┘
     │
     ▼
┌────────────────────┐
│ Regex Replacements │ ── Custom styling
└────────────────────┘
     │
     ▼
Styled HTML
```

### Custom Content Transformations

#### Guest Info Box
```markdown
**Guest:** John Doe, CEO of Example Corp
```
Transforms to a styled box with red top border, "GUEST" label, and guest info.

#### Key Quote Box
```markdown
**Key Quote:** "This is a memorable quote from the episode."
```
Transforms to a centered quote box with large quotation mark and light red background.

#### Contents Covered List
```markdown
**Contents Covered:**
1. First topic
2. Second topic
3. Third topic
```
Transforms to a numbered list with red top border and gray background.

#### Section Quotes (Pull Quotes)
```markdown
***"This is a notable quote from the section."***
```
Transforms to an Economist-style pull quote with:
- Red left border (`#E3120B`)
- Light red gradient background (fading to white)
- Large red quotation marks
- Italic text styling

#### Section Separators
After each `<h2>` heading, a light gray horizontal rule (`1px solid #E5E7EB`) is automatically inserted for visual separation between sections.

#### Detailed Analysis Removal
The redundant `**Detailed Analysis:**` heading is automatically stripped from content.

---

## Episode Interface

```typescript
interface Episode {
    id: string;          // Unique identifier (same as slug)
    title: string;       // Episode title
    channel: string;     // Podcast channel name
    publishedAt: string; // Publication date
    duration: string;    // Episode length (e.g., "1h 22m")
    url: string;         // YouTube/source URL
    views: string;       // View count
    content: string;     // Full markdown content
    isPremium: boolean;  // true if >30 days old
    slug: string;        // URL-friendly identifier
}
```

---

## Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  AuthButton │ ──▶ │   NextAuth  │ ──▶ │   Google    │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Session   │
                    └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  isAdmin()  │ ── Returns true if logged in
                    └─────────────┘
```

---

## Paywall Logic

```
Episode requested
       │
       ▼
┌──────────────────┐
│ isPremium check  │
│ (>30 days old?)  │
└──────────────────┘
       │
       ├── No  ──▶ Show full content
       │
       └── Yes
            │
            ▼
     ┌─────────────┐
     │ isAdmin()?  │
     └─────────────┘
            │
            ├── Yes ──▶ Show full content
            │
            └── No  ──▶ Show teaser + paywall
```

---

## Styling System

### Design Theme
Inspired by The Economist magazine:
- **Accent Color**: `#E3120B` (Economist Red)
- **Typography**: Serif for body, Sans-serif for UI labels
- **Layout**: Clean, editorial design with strong typography

### CSS Custom Properties

```css
--color-accent: hsl(358 91% 47%);    /* Economist Red */
--color-background: hsl(0 0% 100%);  /* White */
--color-foreground: hsl(0 0% 10%);   /* Near black */
--color-border: hsl(0 0% 85%);       /* Light gray */
--font-serif: Crimson Text, Georgia, serif;
--font-sans: Inter, system-ui, sans-serif;
```

### Prose Styling
The `.prose` class provides typography styling for content:
- Headings with tight letter-spacing
- Red accent markers for lists
- Red left border for blockquotes
- Hover effects on table rows
- Responsive font sizes

---

## Documentation

For a detailed overview of the architecture and workflows, see [ONE_PAGER.md](./ONE_PAGER.md).
