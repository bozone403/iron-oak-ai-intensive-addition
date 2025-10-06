# Iron & Oak Strategic Solutions - Design Guidelines

## Design Approach
**Reference-Based Strategy**: Drawing inspiration from elite consulting firms (McKinsey, Bain) combined with modern design aesthetics (Stripe's restraint, Linear's typography precision) while maintaining distinctive luxury positioning through dark minimalism and emerald accent system.

## Core Design Principles
1. **Sophisticated Minimalism**: Every element earns its place through function and impact
2. **Strategic Use of Space**: Generous whitespace conveys luxury and confidence
3. **Precision Over Decoration**: Clean lines, exact alignment, purposeful hierarchy
4. **Controlled Animation**: Subtle, meaningful motion that enhances rather than distracts

## Color Palette

### Dark Mode (Primary)
- **Background Base**: 10 5% 5% (near-black with subtle warmth)
- **Surface Elevated**: 10 5% 8% (cards, elevated sections)
- **Surface Accent**: 10 5% 12% (interactive elements, hover states)
- **Text Primary**: 0 0% 98% (high contrast for readability)
- **Text Secondary**: 0 0% 65% (supporting text, metadata)
- **Text Muted**: 0 0% 45% (labels, captions)

### Emerald Accent System
- **Primary Emerald**: 160 84% 39% (trust markers, primary CTAs)
- **Emerald Hover**: 160 84% 45% (interactive states)
- **Emerald Muted**: 160 30% 25% (subtle accents, borders)
- **Emerald Glow**: 160 84% 39% with 20% opacity (subtle emphasis)

### Supporting Colors
- **Slate Borders**: 220 10% 20% (card borders, dividers)
- **Success**: 142 76% 36%
- **Warning**: 45 93% 47%

## Typography

**Primary Font**: Inter (via Google Fonts)
- **Hero Headlines**: 48px (3rem) / 56px (3.5rem) desktop, 700 weight, -0.02em tracking
- **Section Headers**: 36px (2.25rem) / 40px (2.5rem), 600 weight
- **Subsection Headers**: 24px (1.5rem), 600 weight
- **Body Large**: 18px (1.125rem), 400 weight, 1.6 line-height
- **Body Standard**: 16px (1rem), 400 weight, 1.65 line-height
- **Metadata/Labels**: 14px (0.875rem), 500 weight, uppercase, 0.05em tracking

**Monospace Font**: JetBrains Mono (for technical details, metrics)
- 14px, 400 weight, emerald color for emphasis

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24, 32
- **Component Padding**: p-6 to p-8 for cards
- **Section Spacing**: py-20 to py-32 desktop, py-12 to py-16 mobile
- **Element Gaps**: gap-4, gap-6, gap-8 for flex/grid layouts

**Container Strategy**:
- **Max Width**: max-w-7xl (1280px) for main content
- **Content Width**: max-w-4xl (896px) for text-heavy sections
- **Reading Width**: max-w-prose for long-form content

**Grid Systems**:
- **Services Grid**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
- **Feature Highlights**: grid-cols-2 lg:grid-cols-4 gap-6
- **Project Showcase**: grid-cols-1 lg:grid-cols-2 gap-12

## Component Library

### Navigation
- Sticky header with backdrop-blur-lg and 90% opacity
- Logo left, nav links center, CTA button right
- Underline animation on hover (emerald, 2px height, smooth transition)
- Mobile: slide-in drawer with frosted glass effect

### Hero Section
- **Layout**: Full viewport height (min-h-screen) with centered content
- **Background**: Subtle gradient overlay on dark base (10° diagonal)
- **Portrait Placement**: Right side, rounded-2xl frame with emerald border (2px)
- **Typography**: Large headline with emerald keyword highlight
- **CTAs**: Primary (filled emerald) + Secondary (outline with backdrop-blur)

### Cards
- **Style**: rounded-2xl, border-slate-borders, bg-surface-elevated
- **Shadow**: Soft elevation (shadow-lg) with emerald glow on hover
- **Hover**: Subtle lift (translateY(-4px)), border brightens to emerald-muted
- **Padding**: p-8 for service cards, p-6 for smaller components

### Buttons
- **Primary**: Emerald fill, white text, rounded-lg, px-8 py-3
- **Secondary**: Outline, emerald border/text, backdrop-blur when on images
- **Hover**: Slight brightness increase, no transform on outline variants
- **Icon Integration**: Lucide icons, 20px, right-aligned with gap-2

### Service Pages
- **Header**: Large title, summary in text-secondary, metadata badges
- **Content**: Two-column layout desktop (content + sidebar with deliverables)
- **Deliverables**: Card with checkmark icons, emerald accents
- **CTA Block**: Full-width, elevated card at bottom

### Project Showcase Section
- **Layout**: Asymmetric masonry grid or alternating left/right image-text blocks
- **Project Cards**: Large format, image with overlay gradient, title + brief in overlay
- **Interaction**: Hover reveals full description with smooth fade-in

### Contact Form
- **Styling**: Dark inputs with emerald focus rings, rounded-lg
- **Validation**: Inline error states in warning color
- **Success**: Full-screen overlay with emerald checkmark animation

## Animation Strategy

**Principle**: Subtle and purposeful only
- **Page Load**: Staggered fade-in for hero elements (100ms delays)
- **Scroll Reveals**: Intersection Observer with fade-up (20px) on 70% visibility
- **Hover States**: 200ms ease-out transitions for colors, 150ms for transforms
- **Navigation**: Smooth scroll with offset for sticky header
- **Form Success**: Scale + fade animation (500ms) for confirmation

**Forbidden**: Parallax scrolling, continuous animations, auto-playing carousels

## Images

### Hero Image
- **Type**: Professional portrait provided by user
- **Placement**: Right side of hero, 40% width on desktop
- **Treatment**: rounded-2xl, subtle emerald border (2px solid), slight shadow
- **Mobile**: Full width above headline, reduced size

### Service/Project Images
- Use abstract geometric patterns or architectural photography (dark-filtered)
- Aspect ratio 16:9 for project cards, 1:1 for service icons
- Overlay gradients: dark-to-transparent from bottom

### OG Image
- Programmatic SVG: Iron & Oak wordmark on dark background with emerald accent line

## Accessibility Standards
- Minimum contrast ratio 7:1 for body text
- Focus indicators: 3px emerald outline with 2px offset
- Keyboard navigation for all interactive elements
- ARIA labels on icon-only buttons
- Form labels always visible (no placeholder-only inputs)

## Unique Differentiators
- **Monospaced Metrics**: Key statistics in JetBrains Mono with emerald color
- **Asymmetric Layouts**: Break grid occasionally for visual interest
- **Frosted Glass Effects**: backdrop-blur on floating elements over dark backgrounds
- **Emerald Glow Accents**: Subtle box-shadow in emerald for premium feel
- **Executive Portrait Integration**: Humanizes brand without sacrificing sophistication