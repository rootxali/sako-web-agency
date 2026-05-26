# Sako Agency Website - Folder Structure

## 📁 Project Overview
This is a **Next.js 15+** agency website built with TypeScript, Tailwind CSS, and Prisma for database management. The project is deployed on Netlify.

---

## 📂 Root Level Files & Configuration

```
├── package.json                 # Project dependencies and scripts
├── package-lock.json           # Locked dependency versions
├── tsconfig.json               # TypeScript configuration
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── postcss.config.mjs          # PostCSS configuration (for Tailwind)
├── eslint.config.mjs           # ESLint configuration for code quality
├── vitest.config.ts            # Vitest configuration for unit testing
├── prisma.config.ts            # Prisma ORM configuration
├── netlify.toml                # Netlify deployment configuration
├── deno.lock                    # Deno dependencies lock file
├── dev.db                       # Local SQLite database for development
├── next-env.d.ts               # Next.js TypeScript definitions
├── tsconfig.tsbuildinfo        # TypeScript build information
├── README.md                    # Project documentation
├── CLAUDE.md                    # Claude AI instructions (custom agent config)
├── AGENTS.md                    # Agents configuration
└── STRUCTURE.md                 # This file - folder structure documentation
```

---

## 📂 Main Directories

### 1. **`/app`** - Next.js App Router (Main Application)
The core application directory using Next.js 13+ App Router pattern.

```
/app
├── layout.tsx                   # Root layout component (wraps entire app)
├── page.tsx                     # Home page component
├── page.test.tsx                # Home page tests (Vitest)
├── globals.css                  # Global styles for entire application
├── favicon.ico                  # Website favicon
│
├── /admin                        # Admin section (protected routes)
│   ├── layout.tsx               # Admin layout component
│   ├── page.tsx                 # Admin dashboard page
│   │
│   └── /login                   # Admin login page
│       └── page.tsx             # Login form page
│
└── /demo                         # Demo page section
    └── page.tsx                 # Demo showcase page
```

**Purpose:** Contains all application pages and layouts using Next.js App Router pattern for file-based routing.

---

### 2. **`/components`** - Reusable React Components
Organized collection of React components used throughout the application.

```
/components
│
├── /ui                          # UI component library (Shadcn-style components)
│   ├── avatar.tsx               # Avatar display component
│   ├── BlurText.tsx             # Blur text animation component
│   ├── PricingSection.tsx        # Pricing table component
│   ├── testimonial-v2.tsx        # Testimonial card component (v2)
│   ├── testimonials-columns-1.tsx # Testimonial grid layout
│   ├── cinematic-footer.tsx      # Cinematic style footer
│   ├── motion-footer.tsx         # Animated footer component
│   ├── ScrollFloat.tsx           # Floating scroll effect component
│   ├── ScrollFloat.css           # Styles for ScrollFloat
│   └── [other-ui-components]
│
├── /animate-ui                   # Animation components (Radix UI based)
│   └── /primitives
│       └── /radix
│           └── hover-card.tsx    # Hover card component from Radix
│
├── /blocks                       # Reusable section blocks (currently empty)
│   └── [future-block-components]
│
├── About.tsx                     # About section component
├── AuthProvider.tsx              # Authentication provider component
├── Blog.tsx                      # Blog section component
├── CardNav.tsx                   # Card navigation component
├── CardNav.css                   # Card navigation styles
├── Contact.tsx                   # Contact form section component
├── Cursor.tsx                    # Custom cursor component
├── DotField.tsx                  # Dot field/background animation
├── DotField.css                  # Dot field styles
├── Footer.tsx                    # Main footer component
├── Hero.tsx                      # Hero section component
├── MagicBento.tsx                # Bento grid layout component
├── MagicBento.css                # Bento grid styles
├── Marquee.tsx                   # Marquee scrolling component
├── Nav.tsx                       # Navigation bar component
├── Process.tsx                   # Process/workflow section
├── ProfileCard.tsx               # Profile card component
├── ProfileCard.css               # Profile card styles
├── ScrollProgress.tsx            # Scroll progress indicator
├── Services.tsx                  # Services section component
├── SmoothScroll.tsx              # Smooth scroll behavior component
├── SocialHoverCard.tsx           # Social links hover card
├── Team.tsx                      # Team members section
├── TestimonialMarquee.tsx         # Testimonials marquee animation
├── Testimonials.tsx              # Testimonials section
├── ThemeProvider.tsx             # Theme provider component (light/dark mode)
├── ThemeToggle.tsx               # Theme toggle button
└── Work.tsx                      # Portfolio/work section component
```

**Purpose:** Contains all reusable React components. Organized by feature area and UI library type.

---

### 3. **`/lib`** - Utility Functions & Helpers
Shared utility functions and configurations used across the application.

```
/lib
├── prisma.ts                    # Prisma database client singleton
├── utils.ts                     # General utility functions (helpers, formatters, etc.)
└── utils.test.ts                # Tests for utility functions (Vitest)
```

**Purpose:** Houses shared logic, database connections, and helper functions.

---

### 4. **`/prisma`** - Database Schema & Migrations
ORM configuration and database schema definitions.

```
/prisma
├── schema.prisma                # Main database schema (models, relationships)
└── [migrations/]                # (Auto-generated) Database migration files
```

**Purpose:** Defines database structure and relationships using Prisma ORM.

---

### 5. **`/public`** - Static Assets
Publicly accessible static files served directly by Next.js.

```
/public
├── file.svg                     # File icon SVG
├── globe.svg                    # Globe icon SVG
├── next.svg                     # Next.js logo
├── vercel.svg                   # Vercel logo
├── window.svg                   # Window icon SVG
└── [other-public-assets]        # Images, fonts, documents, etc.
```

**Purpose:** Contains static assets (images, icons, fonts) accessible via HTTP.

---

### 6. **`/out`** - Static Export Output
Generated static HTML output from Next.js `next export` command.

```
/out
├── index.html                   # Exported home page
├── /admin                        # Exported admin pages
├── /demo                         # Exported demo pages
├── /_next                        # Next.js static assets
├── 404.html                      # 404 error page
├── favicon.ico                   # Favicon copy
└── [other-exported-pages]        # All statically generated pages
```

**Purpose:** Production-ready static export of the entire website. Deployed to hosting.

---

## 🔧 Configuration Files Explained

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js build settings, image optimization, redirects |
| `tailwind.config.ts` | Tailwind CSS theme customization, plugins, colors |
| `tsconfig.json` | TypeScript compiler options and path aliases |
| `vitest.config.ts` | Unit testing framework configuration |
| `prisma.config.ts` | Prisma ORM settings (database URL, etc.) |
| `eslint.config.mjs` | Code linting rules and standards |
| `postcss.config.mjs` | CSS processing pipeline (Tailwind integration) |
| `netlify.toml` | Netlify deployment build and function settings |

---

## 🏗️ Architecture Patterns

### Component Organization
- **Page Components** (`/app`) - Full page layouts
- **Section Components** (`/components`) - Large reusable sections (Hero, About, etc.)
- **UI Components** (`/components/ui`) - Small reusable UI elements (buttons, cards, etc.)
- **Animated Components** (`/components/animate-ui`) - Animation-specific components

### Styling Strategy
- **Tailwind CSS** - Utility-first CSS framework
- **Component CSS** - Per-component scoped styles (e.g., `Marquee.css`, `DotField.css`)
- **Global CSS** - Application-wide styles (`app/globals.css`)

### Database
- **Prisma ORM** - Type-safe database access
- **SQLite** - Local development database (dev.db)

---

## 📊 Key Technologies

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Prisma ORM + SQLite (dev) / PostgreSQL (prod)
- **Testing:** Vitest
- **Linting:** ESLint
- **Deployment:** Netlify
- **UI Components:** Radix UI, Shadcn-style components
- **Animations:** Custom CSS + React animations

---

## 🚀 Development Structure

```
Development Flow:
/app/page.tsx (home page)
    ↓ imports
/components/*.tsx (section components)
    ↓ imports
/components/ui/*.tsx (UI components)
    ↓ imports
/lib/*.ts (utilities & db)
    ↓ connects to
/prisma/schema.prisma (database)
```

---

## 📝 File Naming Conventions

- **Components:** PascalCase (e.g., `Hero.tsx`, `CardNav.tsx`)
- **Styles:** kebab-case (e.g., `CardNav.css`, `DotField.css`)
- **Utils:** camelCase (e.g., `utils.ts`, `prisma.ts`)
- **Pages:** lowercase or index (e.g., `page.tsx`, `login/page.tsx`)

---

## 🔐 Protected Routes

- `/admin` - Admin dashboard (likely requires authentication)
- `/admin/login` - Admin login page
- Uses `AuthProvider.tsx` for authentication management

---

## 📦 Dependencies Location

- **Installed packages:** `node_modules/` (not shown, excluded from version control)
- **Lock file:** `package-lock.json`
- **Package manifest:** `package.json`

---

## 🎯 Deployment

- **Build Output:** `/out` directory
- **Platform:** Netlify (`netlify.toml`)
- **Export Type:** Static site export (`next export`)
- **Environment:** Production

---

Generated: May 2026 | Next.js 15+ | TypeScript | Tailwind CSS
