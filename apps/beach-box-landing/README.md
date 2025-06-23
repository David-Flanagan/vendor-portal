# Beach Box Florida - Marketing Site

A modern, responsive marketing website for Beach Box Florida - self-serve sunscreen vending machines protecting beachgoers across Florida.

## 🏖️ Overview

This is a React/Vite marketing site built with:
- **React 18** - UI library
- **Vite** - Build tool
- **TanStack Router** - Type-safe routing
- **@beach-box/unify-ui** - Component library
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20.0.0
- pnpm (monorepo package manager)

### Development

```bash
# From monorepo root
pnpm install

# Start development server
cd apps/beach-box-landing
pnpm dev
```

The site will be available at http://localhost:3003

### Build

```bash
pnpm build
```

### Type Checking

```bash
pnpm type-check
```

## 📁 Project Structure

```
src/
├── components/      # Reusable components
│   ├── Navigation.tsx
│   └── Footer.tsx
├── routes/         # Page routes
│   ├── __root.tsx  # Root layout
│   ├── index.tsx   # Home page
│   ├── features.tsx
│   ├── locations.tsx
│   ├── pricing.tsx
│   ├── about.tsx
│   └── contact.tsx
├── lib/            # Utilities
│   └── utils.ts
├── index.css       # Global styles
└── main.tsx        # App entry point
```

## 🎨 Design System

### Colors
- **Beach Colors**: Yellow/gold tones representing sun and sand
- **Ocean Colors**: Blue tones representing water and sky

### Components
All UI components are from the `@beach-box/unify-ui` library including:
- HeroSplit / HeroCentered
- FeaturesGrid / FeaturesAlternating
- PricingCards
- TestimonialsGrid
- FAQAccordion
- StatsSimple
- CTASimple
- BentoGrid

## 📄 Pages

1. **Home** (`/`) - Main landing page with hero, features, testimonials
2. **Features** (`/features`) - Detailed product features and technology
3. **Locations** (`/locations`) - Interactive location finder with search/filter
4. **Pricing** (`/pricing`) - Product pricing and partner information
5. **About** (`/about`) - Company story, mission, values, and team
6. **Contact** (`/contact`) - Contact form and information

## 🔧 Configuration

### Tailwind Config
Custom theme extensions for Beach Box branding including:
- Beach and ocean color palettes
- Custom animations (wave, sun-pulse)

### Router Config
TanStack Router with file-based routing and automatic route generation

## 🌊 Features

- **Responsive Design**: Mobile-first approach, works on all devices
- **Type Safety**: Full TypeScript support with TanStack Router
- **Component Library**: Leverages unify-ui blocks for consistency
- **Performance**: Vite for fast builds and HMR
- **Accessibility**: Semantic HTML and ARIA attributes
- **SEO Ready**: Meta tags and structured content

## 🤝 Contributing

This is part of the beach Box monorepo. Follow the monorepo contribution guidelines.

## 📝 License

Private - Part of beach Box Monorepo
