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

- **Framework**: SvelteKit 2.22+ with Svelte 5.25+
- **Language**: TypeScript 5.0+
- **Build Tool**: Vite 7.0+ with Svelte plugin
- **Adapter**: Auto-adapter for flexible deployment
- **Styling**: Pure CSS with nested selectors (no external CSS frameworks)
- **State Management**: Svelte 5 runes (`$state`, `$effect`, `$derived`) in `.svelte.ts` files
- **HTTP Client**: Native Fetch API with custom authentication wrapper
- **Icons**: Inline SVG components (no icon libraries)
- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **Development**: Hot reload, type checking, format on save

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
│   ├── state.svelte.ts      # Global state with Svelte 5 runes
│   └── types.ts             # TypeScript interfaces
├── routes/
│   ├── +layout.svelte       # Root layout with Toast integration
│   ├── +page.svelte         # Landing page (Hero, Features, Pricing)
│   ├── dashboard/           # Protected dashboard routes
│   │   ├── +layout.svelte   # Dashboard layout with Sidebar
│   │   ├── +page.svelte     # Analytics dashboard
│   │   ├── leads/           # Reddit post management
│   │   ├── replies/         # AI reply tracking
│   │   ├── subreddits/      # Subreddit configuration
│   │   ├── keywords/        # Keyword monitoring
│   │   ├── settings/        # User profile management
│   │   ├── help/            # Contact form
│   │   └── feedback/        # Feedback submission
│   ├── setup/               # First-time project setup
│   ├── google-auth/         # OAuth callback handling
│   └── [components]/        # Reusable components
│       ├── Header.svelte    # Landing page header
│       ├── Hero.svelte      # Hero section
│       ├── Footer.svelte    # Site footer
│       ├── Toast.svelte     # Global notifications
│       └── Loader.svelte    # Loading animations
└── utils.ts                 # API client with auth wrapper
```

## 🔧 Key Components

### Global State (`state.svelte.ts`)

- **Svelte 5 Runes**: Pure reactive state with `$state`, `$derived`, `$effect`
- **Loading States**: Global loading management with `getLoadingState()`/`setLoadingState()`
- **Environment URLs**: Dynamic API URL based on dev/production environment
- **Sidebar State**: Persistent sidebar visibility with responsive behavior
- **Toast Queue System**: Queue-based notifications with auto-dismiss and animations

### Authentication Flow

- **Google OAuth 2.0**: Serverless OAuth integration via `/google-auth` route
- **Session Persistence**: Cookie-based sessions with automatic renewal
- **Route Protection**: Client-side auth checks with redirects
- **User Context**: Global user state management across components

### API Integration (`utils.ts`)

- **Authenticated Wrapper**: `makeAuthenticatedRequest()` with automatic auth headers
- **Error Handling**: Centralized error processing with toast notifications
- **Loading Integration**: Automatic loading state management for all requests
- **Type Safety**: Full TypeScript support with interface matching backend
- **CRUD Operations**: Complete API coverage for all resources

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

### Code Style & Architecture

- **TypeScript Strict Mode**: Full type safety with strict compiler options
- **Svelte 5 Runes**: Modern reactivity with `$state`, `$effect`, `$derived`
- **Pure CSS**: No external frameworks, custom design system
- **Nested Selectors**: CSS nesting with `&` parent references
- **Component Architecture**: Reusable, self-contained Svelte components
- **File-based Routing**: SvelteKit's automatic routing from file structure
- **No External Dependencies**: Minimal runtime dependencies for performance

### State Management with Svelte 5 Runes

```typescript
// Global state in state.svelte.ts
let loading = $state(false);
let sidebarOpen = $state(true);

// Environment-aware configuration
const URL = $state(dev ? 'http://localhost:8080' : 'https://api.hurricane.com');

// Toast queue system
let toasts = $state<Toast[]>([]);
let isProcessingQueue = $state(false);

// Reactive computations
let filteredLeads = $derived(leads.filter((lead) => lead.subreddit === selectedSubreddit));

// Effects for side effects
$effect(() => {
	if (toasts.length > 0 && !isProcessingQueue) {
		processToastQueue();
	}
});
```

### API Integration Pattern

```typescript
// Custom authenticated wrapper
export const makeAuthenticatedRequest = async (endpoint: string, options?: RequestInit) => {
	setLoadingState(true);
	try {
		const response = await fetch(`${URL}${endpoint}`, {
			...options,
			credentials: 'include', // Include cookies for session auth
			headers: {
				'Content-Type': 'application/json',
				...options?.headers
			}
		});

		if (!response.ok) {
			const error = await response.json();
			showToast(error.message, 'error');
			throw new Error(error.message);
		}

		const result = await response.json();
		return result.data;
	} finally {
		setLoadingState(false);
	}
};
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

### Performance & UX

- **Service Worker**: Offline support and caching
- **Virtual Scrolling**: Handle large datasets efficiently
- **Lazy Loading**: Component-level code splitting
- **Dark Mode**: Theme switching with system preference detection
- **Keyboard Shortcuts**: Power user navigation and actions

### Features

- **Real-time Updates**: WebSocket integration for live data
- **Advanced Analytics**: Time-series charts and trend analysis
- **Bulk Operations**: Multi-select for leads and replies
- **Export Functionality**: CSV/PDF export for data
- **Advanced Filtering**: Complex search and filter combinations
- **Collaborative Features**: Team management and shared projects

### Developer Experience

- **Storybook Integration**: Component documentation and testing
- **E2E Testing**: Playwright integration for user flow testing
- **Performance Monitoring**: Real user monitoring and analytics
- **Progressive Web App**: PWA capabilities with app-like experience

## 📄 License

Part of the Hurricane Reddit Lead Generation Platform.

---

Built with ❤️ using SvelteKit and modern web technologies.
