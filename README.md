# Hurricane UI

A modern SvelteKit frontend for the Hurricane Reddit lead generation platform. Hurricane helps users discover and engage with potential leads on Reddit through AI-powered reply generation.

## 🚀 Features

- **Dashboard Analytics** - Real-time metrics for leads, replies, and engagement
- **Lead Discovery** - Browse and filter Reddit posts matching your criteria
- **AI-Powered Replies** - Generate contextual responses using Google Gemini
- **Subreddit Management** - Configure target subreddits for lead discovery
- **Keyword Tracking** - Set up keywords to monitor across Reddit
- **Reply Management** - Track and manage all your AI-generated responses
- **User Settings** - Profile management and account configuration
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Framework**: SvelteKit 2.0
- **Language**: TypeScript
- **Styling**: CSS with nested selectors
- **State Management**: Svelte 5 runes (`$state`, `$effect`, `$derived`)
- **HTTP Client**: Fetch API with authentication utilities
- **Icons**: Custom SVG icons
- **Build Tool**: Vite

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- npm/pnpm/yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser (optional)
npm run dev -- --open
```

### Environment Setup

The frontend connects to the Hurricane API backend. Ensure your backend is running and accessible.

## 🏗️ Project Structure

```
src/
├── lib/
│   ├── state.svelte.ts      # Global state management
│   └── types.ts             # TypeScript interfaces
├── routes/
│   ├── +layout.svelte       # Root layout
│   ├── +page.svelte         # Landing page
│   └── dashboard/           # Dashboard routes
│       ├── +page.svelte     # Dashboard home
│       ├── leads/           # Lead management
│       ├── replies/         # Reply tracking
│       ├── subreddits/      # Subreddit config
│       ├── keywords/        # Keyword setup
│       └── settings/        # User settings
└── utils.ts                 # API utilities
```

## 🔧 Key Components

### Global State (`state.svelte.ts`)

- Loading states management
- Sidebar visibility control
- Toast notification system with queue

### Authentication

- Google OAuth integration
- Session management
- Protected route handling

### API Integration (`utils.ts`)

- Authenticated request wrapper
- Error handling and toast notifications
- CRUD operations for all resources

## 🎨 Design System

### Color Palette

- Primary: `rgb(255, 69, 0)` (Reddit Orange)
- Background: `#ffffff`
- Text: `#222831`, `#393e46`, `#6b7280`
- Borders: `#e5e7eb`, `#d1d5db`

### Typography

- Headings: 600-900 font weight
- Body: 500 font weight
- Uppercase transforms for navigation and labels

### Responsive Breakpoints

- Mobile: `< 48rem` (768px)
- Tablet: `48rem - 76.8rem` (768px - 1229px)
- Desktop: `> 76.8rem` (1229px+)

## 📱 Pages Overview

### Landing Page

- Hero section with value proposition
- Feature showcase
- Pricing information
- Call-to-action buttons

### Dashboard

- **Analytics**: Lead counts, reply metrics, time-based filtering
- **Leads**: Browse Reddit posts, generate AI replies
- **Replies**: Manage generated responses
- **Subreddits**: Configure target communities
- **Keywords**: Set monitoring terms
- **Settings**: Profile and account management

## 🔐 Authentication Flow

1. **Landing Page** → Login/Signup buttons
2. **Google OAuth** → Redirect to `/google-auth`
3. **Setup Page** → Project configuration (first-time users)
4. **Dashboard** → Main application interface

## 🚀 Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🧪 Development

### Code Style

- TypeScript strict mode enabled
- Svelte 5 runes for reactivity
- CSS nested selectors with `&` syntax
- Consistent naming conventions

### State Management

```typescript
// Global state with runes
let loading = $state(false);
let sidebarOpen = $state(true);

// Reactive computations
let filteredLeads = $derived(leads.filter((lead) => lead.subreddit === selectedSubreddit));
```

### API Calls

```typescript
// Authenticated requests
const data = await makeAuthenticatedRequest('/api/endpoint');

// With loading states
setLoadingState(true);
try {
	const result = await apiCall();
	showToast('Success!', 'success');
} finally {
	setLoadingState(false);
}
```

## 🎯 Key Features Implementation

### AI Reply Generation

- Context-aware prompts with project information
- Natural product integration (Redleads)
- Copy-to-clipboard functionality
- Loading states during generation

### Toast Notifications

- Queue-based system for multiple messages
- Auto-dismiss with smooth animations
- Success, error, info, and warning types

### Responsive Sidebar

- Collapsible on mobile devices
- Persistent state management
- Smooth animations and transitions

## 🔮 Future Enhancements

- Real-time notifications
- Advanced analytics dashboard
- Bulk operations for leads/replies
- Dark mode support
- Keyboard shortcuts
- Export functionality

## 📄 License

Part of the Hurricane Reddit Lead Generation Platform.

---

Built with ❤️ using SvelteKit and modern web technologies.
