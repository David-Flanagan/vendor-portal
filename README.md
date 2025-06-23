# Beach Box Monorepo 🏖️

A modern monorepo containing the Beach Box marketing website and the unify-ui component library - everything you need to build beautiful Beach Box applications.

## 🌊 Overview

Beach Box is a self-serve sunscreen vending machine solution protecting beachgoers across Florida. This monorepo contains:

- **Beach Box Landing Page**: Modern marketing website showcasing our sunscreen vending machines
- **Unify UI Library**: Comprehensive component library for building consistent, beautiful applications

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ (see [.nvmrc](./.nvmrc))
- **pnpm** 8+ (package manager)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/Beach-Box-Monorepo.git
cd Beach-Box-Monorepo

# Use correct Node version
nvm use

# Install dependencies
pnpm install

# Start development environment
pnpm dev
```

## 🏗️ Project Structure

```
Beach-Box-Monorepo/
├── 🖥️  apps/                    # Applications
│   └── beach-box-landing/      # Beach Box marketing website (Vite + React)
├── 📦 packages/                # Shared packages
│   └── unify-ui/              # UI component library
├── 🔧 shared/                  # Shared configurations
│   ├── eslint-config/         # ESLint configurations
│   ├── tsconfig/             # TypeScript configurations
│   └── schemas/              # Zod validation schemas
└── 📚 docs/                   # Documentation
```

## 🏖️ Applications

### Beach Box Landing Page

A modern, responsive marketing website built with:

- **React 18** + **TypeScript** - Modern UI development
- **Vite** - Lightning fast development and builds
- **TanStack Router** - Type-safe routing
- **Tailwind CSS** - Utility-first styling
- **@beach-box/unify-ui** - Component library integration

**Features:**
- Responsive design for all devices
- Interactive location finder
- Product showcase and pricing
- Company story and team information
- Contact forms and information
- SEO optimized with meta tags

**Pages:**
- **Home** (`/`) - Hero section with product overview
- **Features** (`/features`) - Detailed product capabilities
- **Locations** (`/locations`) - Interactive location finder
- **Pricing** (`/pricing`) - Pricing plans and partner info
- **About** (`/about`) - Company story and team
- **Contact** (`/contact`) - Contact form and information

**Development:**
```bash
cd apps/beach-box-landing
pnpm dev  # Starts on http://localhost:3003
```

## 📦 Packages

### @beach-box/unify-ui

A comprehensive UI component library built with shadcn/ui and Tailwind CSS.

**Component Categories:**

#### 🧱 **UI Components** (`/components/ui/`)
Core building blocks for any application:
- **Form Controls**: Button, Input, Select, Checkbox, RadioGroup, Switch
- **Navigation**: Breadcrumb, NavigationMenu, Menubar, Tabs
- **Feedback**: Alert, Toast, Progress, Skeleton
- **Layout**: Card, Separator, AspectRatio, ScrollArea
- **Overlays**: Dialog, Sheet, Popover, Tooltip, DropdownMenu
- **Data Display**: Table, Badge, Avatar, Calendar
- **Media**: Carousel, Chart (Area, Bar, Line, Pie)

#### 🏗️ **Application Blocks** (`/components/blocks/application/`)
Ready-to-use application components:
- **AppShell** - Complete application layout
- **DashboardShell** - Dashboard container with sidebar
- **UserProfile** - User profile management
- **NotificationsPanel** - Notification system
- **SettingsPanel** - Application settings
- **MetricsDashboard** - Analytics and metrics

#### 🔐 **Authentication Blocks** (`/components/blocks/auth/`)
Complete authentication solutions:
- **LoginForm** - User login with validation
- **RegisterForm** - User registration
- **SocialLogin** - Social media authentication
- **TwoFactorAuth** - 2FA implementation
- **PasswordReset** - Password recovery flow
- **MagicLink** - Passwordless authentication

#### 📝 **Content Blocks** (`/components/blocks/content/`)
Content creation and management:
- **RichTextEditor** - WYSIWYG editor
- **MarkdownEditor** - Markdown editing
- **CodeEditor** - Syntax-highlighted code editor
- **FileUpload** - File upload with progress
- **MediaGallery** - Image and video gallery

#### 📊 **Data Display Blocks** (`/components/blocks/data-display/`)
Advanced data visualization:
- **DataTable** - Feature-rich tables with sorting, filtering
- **Charts** - Area, Bar, Line, Pie chart components
- **KPICard** - Key performance indicators
- **ActivityFeed** - Timeline and activity streams
- **KanbanBoard** - Task management interface

#### 🛒 **E-commerce Blocks** (`/components/blocks/ecommerce/`)
Shopping and commerce components:
- **ProductCard** - Product display
- **ProductGrid** - Product listings
- **Cart** - Shopping cart interface
- **Checkout** - Complete checkout flow

#### 📐 **Layout Blocks** (`/components/blocks/layout/`)
Flexible layout systems:
- **Container** - Content containers
- **Grid** - CSS Grid layouts
- **BentoGrid** - Masonry-style layouts
- **Stack** - Flexbox stacks
- **Responsive** - Responsive utilities

#### 🚀 **Marketing Blocks** (`/components/blocks/marketing/`)
Landing page and marketing components:
- **HeroCentered** / **HeroSplit** - Hero sections
- **FeaturesGrid** / **FeaturesAlternating** - Feature showcases
- **TestimonialsGrid** - Customer testimonials
- **PricingCards** - Pricing plans
- **FAQAccordion** - FAQ sections
- **LogoCloud** - Partner/client logos
- **CTASimple** - Call-to-action sections
- **StatsSimple** - Statistics display

#### 🔄 **Workflow Components** (`/components/workflow/`)
Visual workflow and process management:
- **Canvas** - Drag-and-drop workflow builder
- **Nodes** - Workflow step components
- **Templates** - Pre-built workflow templates
- **DragDrop** - Drag and drop utilities

**Installation:**
```bash
pnpm add @beach-box/unify-ui
```

**Usage:**
```tsx
import { Button, Card, HeroCentered } from '@beach-box/unify-ui';

function App() {
  return (
    <div>
      <HeroCentered
        title="Welcome to Beach Box"
        subtitle="Protecting beachgoers across Florida"
      />
      <Card>
        <Button>Get Started</Button>
      </Card>
    </div>
  );
}
```

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev              # Start all applications in development mode
pnpm dev:landing      # Start Beach Box landing page only

# Building
pnpm build            # Build all packages and applications
pnpm build:packages   # Build packages only
pnpm build:apps       # Build applications only

# Testing
pnpm test             # Run all tests
pnpm test:unit        # Run unit tests only

# Code Quality
pnpm lint             # Lint all packages and applications
pnpm lint:fix         # Fix linting issues automatically
pnpm type-check       # Run TypeScript type checking
pnpm format           # Format code with Prettier

# Package Management
pnpm clean            # Clean all build artifacts and node_modules
```

### Development Workflow

1. **Clone and Setup**
   ```bash
   git clone <repo-url>
   cd Beach-Box-Monorepo
   nvm use
   pnpm install
   ```

2. **Development**
   ```bash
   pnpm dev  # Start development servers
   # Make your changes
   pnpm test && pnpm lint
   ```

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat(landing): add new beach location page"
   ```

## 🎨 Design System

### Brand Colors
- **Beach Colors**: Warm yellows and golds representing sun and sand
- **Ocean Colors**: Cool blues representing water and sky
- **Accent Colors**: Vibrant oranges and corals for highlights

### Typography
- Clean, modern sans-serif fonts for readability
- Hierarchical scale for headings and body text
- Responsive typography that scales across devices

### Components
All UI components follow Beach Box design principles:
- Consistent spacing and sizing
- Accessible color contrasts
- Smooth animations and transitions
- Mobile-first responsive design

## 🔧 Configuration

### Monorepo Tools
- **pnpm Workspaces** - Package management and linking
- **Turbo** - Build system and task runner
- **Changesets** - Version management and publishing

### Code Quality
- **ESLint** - Code linting with custom Beach Box rules
- **Prettier** - Code formatting
- **TypeScript** - Type safety across all packages
- **Tailwind CSS** - Consistent styling system

### Development Tools
- **Vite** - Fast development and building
- **Storybook** - Component development and documentation
- **Zod** - Runtime type validation
- **TanStack Router** - Type-safe routing

## 📱 Responsive Design

All components and applications are built with mobile-first responsive design:

- **Mobile**: Optimized for phones (320px+)
- **Tablet**: Enhanced for tablets (768px+)
- **Desktop**: Full experience for desktops (1024px+)
- **Large Screens**: Optimized for large displays (1440px+)

## 🚀 Performance

### Build Optimizations
- **Tree Shaking** - Unused code elimination
- **Code Splitting** - Lazy loading for optimal performance
- **Asset Optimization** - Image and asset compression
- **Bundle Analysis** - Performance monitoring and optimization

### Runtime Performance
- **React 18** - Concurrent features and automatic batching
- **Vite** - Fast HMR and optimized builds
- **Lazy Loading** - Components loaded on demand
- **Caching** - Intelligent caching strategies

## 🤝 Contributing

We welcome contributions to the Beach Box monorepo! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards
- Follow existing code style and patterns
- Use TypeScript for type safety
- Write tests for new features
- Update documentation as needed
- Follow conventional commit messages

## 📄 License

Private - Beach Box Monorepo

---

**Built with ❤️ by the Beach Box Team** 🏖️
