# PodRead - Application Overview

**PodRead** is a specialized web application designed to present high-quality, AI-generated visual notes and analysis of podcast episodes. It transforms raw text and markdown output from an ingestion pipeline into a polished, "Economist-style" reading experience.

## Core Architecture

The application follows a **Static Data Ingestion** pattern, separating the content generation from the presentation layer.

### 1. Data Pipeline (Ingestion)
*   **Source**: An external tool (`youtube_subs_extractor`) processes podcast audio/video and generates two files per episode in an output directory:
    *   `[filename].txt`: Metadata (Title, Channel, Date, Duration, Views).
    *   `[filename]_claude_artifact.md`: The AI-generated analysis content in Markdown.
*   **Migration**: A Node.js script (`scripts/migrate.js`) acts as the bridge:
    *   Reads the raw `.txt` and `.md` files.
    *   Parses metadata and content.
    *   Determines **Premium Status**: Episodes older than 1 month are marked as `isPremium`.
    *   Compiles everything into a single optimized JSON database: `data/episodes.json`.

### 2. Frontend Application (Next.js)
*   **Framework**: Next.js 16 (App Router) with React 19.
*   **Styling**: Tailwind CSS with a custom design system inspired by *The Economist* (Serif typography, Red accents, clean layout).
*   **Data Access**: The app reads `data/episodes.json` at build/request time to render pages.

## Key Workflows

### User Experience
1.  **Index Page (`/`)**:
    *   Displays a curated list of podcast episodes.
    *   Grouped by Channel or sorted by Date (implementation dependent).
    *   Users click an episode to view the full analysis.
2.  **Episode Page (`/episode/[slug]`)**:
    *   Renders the Markdown content using `react-markdown`.
    *   **Visual Styling**: Applies custom CSS for "Key Quotes" (thick red borders), lists (red squares), and typography.
    *   **Paywall Logic**:
        *   Checks `isPremium` flag.
        *   If **Premium** and User is **Not Logged In**: Shows a teaser (first 20% of content) and a "Subscribe" overlay.
        *   If **Free** or **Logged In**: Displays full content.

### Authentication (NextAuth.js)
*   **Provider**: Google OAuth.
*   **Flow**:
    1.  User clicks "Sign In" in the Header.
    2.  Redirects to Google for authentication.
    3.  On success, a session is created.
*   **Authorization**: The `isAdmin()` utility checks for an active session. Currently, *any* logged-in user is treated as a "subscriber" for access to premium content.

## Technical Stack
*   **Runtime**: Node.js
*   **Frontend**: Next.js, React, Tailwind CSS
*   **Auth**: NextAuth.js (v5 beta)
*   **Data**: JSON (Flat file database)
*   **Markdown**: `react-markdown`, `remark-gfm`, `rehype-raw`
