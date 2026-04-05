# Premium Web Design System Guide

IMPORTANT: Use the FluentV2 Component Library: https://fluent2.microsoft.design/components/web/react
> A comprehensive design reference distilled from **Stripe**, **Apple**, **Linear**, **IOTA**, and **Jeton** — five best-in-class marketing websites known for craft, clarity, and conversion.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Typography System](#2-typography-system)
3. [Color Systems & Theming](#3-color-systems--theming)
4. [Layout & Grid Architecture](#4-layout--grid-architecture)
5. [Component Patterns](#5-component-patterns)
6. [Motion & Animation](#6-motion--animation)
7. [Hero Sections](#7-hero-sections)
8. [Navigation Patterns](#8-navigation-patterns)
9. [Visual Effects & Polish](#9-visual-effects--polish)
10. [Responsive Strategy](#10-responsive-strategy)
11. [Performance & Technical Architecture](#11-performance--technical-architecture)
12. [Imagery & Media Strategy](#12-imagery--media-strategy)
13. [Accessibility & Semantics](#13-accessibility--semantics)
14. [Dark Mode Design](#14-dark-mode-design)
15. [CSS Architecture & Tokens](#15-css-architecture--tokens)
16. [Page Section Blueprints](#16-page-section-blueprints)
17. [Implementation Checklist](#17-implementation-checklist)

---

## 1. Design Philosophy

### Core Principles Shared Across All Four Sites

| Principle | Description |
|---|---|
| **Generous Whitespace** | All four sites use extreme whitespace — sections have 120–200px vertical padding. Content breathes. Nothing feels cramped. |
| **Progressive Disclosure** | Information is revealed in layers: headline → subtext → visual → detail. Users never see everything at once. |
| **Purposeful Minimalism** | Every element earns its place. No decorative noise. If it doesn't communicate, it's removed. |
| **Storytelling Flow** | Pages read like a narrative — each scroll reveals the next chapter. The page guides the eye downward naturally. |
| **Confidence Through Scale** | Large type, bold statements, and full-width imagery project authority and trust. |

### Site-Specific Design Identities

- **Stripe**: Gradient-rich, data-forward, developer-friendly. Uses animated gradient meshes and clean code-like typography. Trust through technical sophistication.
- **Apple**: Product-hero centric, centered compositions, monumental typography. Trust through product beauty and restraint.
- **Linear**: Dark-mode native, tool-interface-as-marketing, precision typography. Trust through showing the actual product in motion.
- **IOTA**: Light-mode with structured grid layouts, geometric/node-based brand graphics, institutional confidence. Trust through ecosystem partnerships and data.
- **Jeton**: Warm brand-orange (#f73b20) on light backgrounds, playful micro-animations (character-level button hovers, coin-drop loaders), scroll-stacking card sections. Trust through testimonials, app-store social proof, and fintech-grade UX polish.

---

## 2. Typography System

### Font Families

| Site | Primary Font | Monospace/Secondary | Loading Strategy |
|---|---|---|---|
| **Stripe** | `Sohne` (custom sans-serif) | `Source Code Pro` (code snippets) | `woff2` preloaded, self-hosted via CDN |
| **Apple** | `SF Pro` (system-level) | `SF Mono` (code/specs) | System font + webfont fallback via `/wss/fonts` |
| **Linear** | `Inter Variable` (variable font) | Monospace for code blocks | `woff2` preloaded, self-hosted static CDN |
| **IOTA** | `Alliance No.2` (custom sans) | System fallback | Loaded via `webassets.iota.org` API |
| **Jeton** | System sans-serif stack | System monospace | No custom font files — relies on system fonts for fast load |

### Recommended Font Stack (Generic Implementation)

```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Source Code Pro', 'SF Mono', 'Fira Code', monospace;
  --font-display: 'Inter', var(--font-sans); /* or a custom display face */
}
```

### Type Scale

All four sites use a modular type scale. Here is a unified scale derived from their patterns:

```css
:root {
  /* Display / Hero */
  --text-display:    clamp(3rem, 6vw, 5.5rem);      /* 48–88px — hero headlines */
  --text-headline-1: clamp(2.5rem, 5vw, 4.5rem);    /* 40–72px — section titles */
  --text-headline-2: clamp(2rem, 3.5vw, 3rem);      /* 32–48px — sub-section titles */
  --text-headline-3: clamp(1.5rem, 2.5vw, 2rem);    /* 24–32px — card titles */

  /* Body */
  --text-body-lg:    clamp(1.125rem, 1.5vw, 1.375rem); /* 18–22px — lead paragraphs */
  --text-body:       1rem;                              /* 16px — body copy */
  --text-body-sm:    0.875rem;                          /* 14px — captions, meta */

  /* Micro */
  --text-micro:      0.75rem;                           /* 12px — labels, tags */
  --text-overline:   0.6875rem;                         /* 11px — overlines, eyebrows */
}
```

### Type Weights

```css
:root {
  --font-weight-regular:  400;
  --font-weight-medium:   500;
  --font-weight-semibold: 600;
  --font-weight-bold:     700;
}
```

### Line Heights & Letter Spacing

| Use Case | Line Height | Letter Spacing |
|---|---|---|
| Display/Hero | `1.0 – 1.1` | `-0.03em to -0.04em` (tight) |
| Headlines | `1.1 – 1.2` | `-0.02em to -0.03em` |
| Body Large | `1.5 – 1.6` | `-0.01em` |
| Body Regular | `1.6 – 1.75` | `0` (normal) |
| Overline/Label | `1.2 – 1.4` | `0.05em – 0.1em` (loose, uppercase) |

### Key Typography Patterns

1. **Eyebrow → Headline → Subhead** (Stripe, Apple, IOTA)
   ```html
   <span class="overline">PAYMENTS</span>
   <h2 class="headline-1">Accept payments globally</h2>
   <p class="body-lg text-muted">Support 135+ currencies with a single integration.</p>
   ```

2. **Bold + Muted Inline** (Linear)
   ```html
   <h2><strong>A new species of product tool.</strong>
   <span class="text-muted">Purpose-built for modern teams.</span></h2>
   ```

3. **Giant Stat Numbers** (Stripe, IOTA)
   ```html
   <div class="stat">
     <span class="stat-number">99.999%</span>
     <span class="stat-label">historical uptime</span>
   </div>
   ```

---

## 3. Color Systems & Theming

### Stripe — Gradient-Heavy Light Theme

```css
:root {
  --stripe-bg:         #ffffff;
  --stripe-bg-alt:     #f6f9fc;
  --stripe-text:       #0a2540;        /* very dark navy */
  --stripe-text-muted: #425466;
  --stripe-primary:    #635bff;        /* indigo/purple */
  --stripe-accent-1:   #00d4aa;        /* teal */
  --stripe-accent-2:   #7a73ff;
  --stripe-gradient:   linear-gradient(135deg, #635bff 0%, #00d4aa 50%, #80e9ff 100%);
  --stripe-surface:    rgba(255,255,255,0.8);
}
```

### Apple — Minimal Light/Dark

```css
/* Light */
:root {
  --apple-bg:          #ffffff;
  --apple-bg-alt:      #fbfbfd;
  --apple-text:        #1d1d1f;
  --apple-text-muted:  #6e6e73;
  --apple-link:        #0066cc;
  --apple-hero-bg:     #000000;       /* hero sections often black */
  --apple-hero-text:   #ffffff;
}
/* Dark sections */
.dark-section {
  --apple-bg:          #000000;
  --apple-text:        #f5f5f7;
  --apple-text-muted:  #a1a1a6;
}
```

### Linear — Dark-Mode Native

```css
:root[data-theme="dark"] {
  --linear-bg:            #08090a;        /* near-black */
  --linear-surface:       #0f1011;
  --linear-surface-2:     #1a1b1e;
  --linear-border:        rgba(255,255,255,0.08);
  --linear-text-primary:  #f7f8f8;
  --linear-text-secondary:#b4b5b6;
  --linear-text-tertiary: #8a8b8c;
  --linear-text-quaternary:#5c5d5e;
  --linear-accent:        #5e6ad2;        /* Linear purple-blue */
  --linear-gradient:      linear-gradient(180deg, rgba(94,106,210,0.3) 0%, transparent 60%);
}
```

### IOTA — Clean Light with Structured Accents

```css
:root {
  --iota-bg:           #ffffff;
  --iota-bg-alt:       #f4f4f8;
  --iota-text:         #131f37;          /* deep navy */
  --iota-text-muted:   #6b7280;
  --iota-primary:      #0fc1a7;          /* teal/mint */
  --iota-accent:       #4f46e5;          /* indigo */
  --iota-surface:      #f9fafb;
}
```

### Jeton — Warm Orange Fintech Theme

```css
:root {
  --jeton-bg:           #ffffff;
  --jeton-bg-alt:       #fff6f5;             /* warm pink-tinted white */
  --jeton-surface:      rgba(247, 59, 32, 0.05); /* orange-tinted glass */
  --jeton-text:         #360802;             /* deep warm maroon */
  --jeton-text-muted:   #6b5c59;
  --jeton-primary:      #f73b20;             /* bold orange-red */
  --jeton-primary-dark: #f74522;
  --jeton-primary-light:#fdd6ce;
  --jeton-secondary:    #4985ef;             /* blue accent for exchange/swap */
  --jeton-border:       rgba(247, 59, 32, 0.1);
  --jeton-shadow:       0 8px 24px rgba(247, 59, 32, 0.1),
                        0 2px 8px rgba(247, 59, 32, 0.05);
}
```

**Jeton's unique color approach:**
- Uses a single bold brand color (#f73b20 orange-red) at varying opacities for the entire UI surface system
- `0.05` opacity for card backgrounds, `0.1` for borders/hovers, `1.0` for CTAs and accents
- Text uses warm maroon (#360802) rather than cold black — matching the orange palette
- A secondary blue (#4985ef) is used sparingly for exchange/conversion features
- Shadows are tinted with the brand color, not neutral gray

### Universal Color Token Architecture

```css
:root {
  /* Semantic tokens — theme-agnostic */
  --color-bg-primary:     var(--bg);
  --color-bg-secondary:   var(--bg-alt);
  --color-bg-elevated:    var(--surface);
  --color-text-primary:   var(--text);
  --color-text-secondary: var(--text-muted);
  --color-text-tertiary:  var(--text-subtle);
  --color-border:         var(--border);
  --color-accent:         var(--accent);

  /* Elevation */
  --shadow-sm:  0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:  0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg:  0 12px 40px rgba(0,0,0,0.12);
  --shadow-xl:  0 24px 80px rgba(0,0,0,0.16);
}
```

---

## 4. Layout & Grid Architecture

### Max-Width Containers

| Site | Container Max-Width | Padding (horizontal) |
|---|---|---|
| Stripe | `1080px` body, `1392px` for hero imagery | `24px` mobile, `48px` tablet, `64px` desktop |
| Apple | `980px` body, `1440px` full-bleed | `22px` mobile, `44px` desktop |
| Linear | `1200px` body content | `24px` mobile, `48px` desktop |
| IOTA | `1280px` container class | `16px` mobile, `32px` desktop |
| Jeton | Fluid grid with `--grid-padding` / `--grid-gap` tokens | Custom responsive CSS vars |

### Recommended Container System

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(1.5rem, 4vw, 4rem);
}

.container-narrow {
  max-width: 800px; /* for text-heavy sections */
}

.container-wide {
  max-width: 1440px; /* for full-bleed visuals */
}
```

### Grid Patterns

**12-Column Grid** (Stripe, Apple)
```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: clamp(1rem, 2vw, 2rem);
}
```

**Auto-Fit Feature Grid** (Linear, IOTA)
```css
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
```

**Two-Column Split** (Apple product sections, Stripe enterprise)
```css
.split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(2rem, 4vw, 6rem);
  align-items: center;
}

@media (max-width: 768px) {
  .split {
    grid-template-columns: 1fr;
  }
}
```

### Section Vertical Spacing

```css
:root {
  --section-padding-sm: clamp(3rem, 6vw, 5rem);       /* 48–80px */
  --section-padding-md: clamp(5rem, 10vw, 8rem);      /* 80–128px */
  --section-padding-lg: clamp(6rem, 12vw, 12rem);     /* 96–192px */
}

section {
  padding: var(--section-padding-md) 0;
}
```

---

## 5. Component Patterns

### 5.1 Buttons

**Primary CTA** (Stripe-style)
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background: var(--color-accent);
  border: none;
  border-radius: 9999px;        /* fully rounded — Stripe, Linear */
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-primary:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
```

**Ghost / Outline Button** (Apple, Linear)
```css
.btn-ghost {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  background: transparent;
  border: 1.5px solid var(--color-border);
  border-radius: 9999px;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background: var(--color-bg-elevated);
  border-color: var(--color-text-secondary);
}
```

**Text Link / Arrow CTA** (Apple, Stripe)
```css
.link-arrow {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--color-accent);
  text-decoration: none;
  transition: gap 0.2s ease;
}

.link-arrow::after {
  content: '→';
  transition: transform 0.2s ease;
}

.link-arrow:hover::after {
  transform: translateX(4px);
}
```

**Animated Character Button** (Jeton — distinctive hover pattern)
```css
/*
  Jeton buttons split label text into individual characters.
  On hover, each character translates upward with staggered delays,
  while a cloned set of characters slides in from below.
*/
.btn-animated .label {
  position: relative;
  overflow: hidden;
  line-height: 1.25;
  white-space: nowrap;
}

.btn-animated .label .char {
  display: inline-block;
  will-change: transform;
  transition: transform 0.25s cubic-bezier(0.55, 0.085, 0.68, 0.53);
  /* Stagger: each char delays by 7ms × its index */
  transition-delay: calc(7ms * var(--i));
}

.btn-animated .label .clone .char {
  transform: translateY(110%) rotate(20deg);
  transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition-delay: calc(0.12s + 7ms * var(--i));
}

.btn-animated:hover .label .char {
  transform: translateY(-110%);
}

.btn-animated:hover .label .clone .char {
  transform: translate(0) rotate(0deg);
}

/* Button background scales down on hover/active */
.btn-animated [data-button-background] {
  transition: transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
}
.btn-animated:hover [data-button-background] {
  transform: scale(0.98);
}
.btn-animated:active [data-button-background] {
  transform: scale(0.95);
}
```

### Key Button Patterns

| Pattern | Used By | Radius | Notes |
|---|---|---|---|
| Fully rounded pill | Stripe, Linear, Jeton | `9999px` | Most common for primary CTAs |
| Rounded rectangle | IOTA | `8–12px` | More institutional feel |
| Apple-style compact link | Apple | N/A | `Learn more >` text links with arrow, no box |
| Dual CTA pair | Stripe | Mixed | Primary (filled) + Secondary (ghost) side by side |
| Character-anim button | Jeton | `9999px` | Each letter animates individually on hover — premium micro-interaction |

### 5.2 Cards

**Feature Card** (Stripe, IOTA)
```css
.card {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 16px;                      /* 12–24px across sites */
  padding: clamp(1.5rem, 3vw, 2.5rem);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
```

**Glass Card** (Linear, Stripe)
```css
.card-glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2rem;
}
```

**Stat Card** (Stripe)
```css
.stat-card {
  text-align: center;
  padding: 2rem;
}

.stat-card .number {
  font-size: var(--text-headline-1);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
  background: var(--stripe-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-card .label {
  font-size: var(--text-body-sm);
  color: var(--color-text-secondary);
  margin-top: 0.5rem;
}
```

### 5.3 Testimonials / Quotes

```css
.testimonial {
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
}

.testimonial blockquote {
  font-size: var(--text-body-lg);
  font-style: italic;
  color: var(--color-text-primary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.testimonial .attribution {
  font-size: var(--text-body-sm);
  color: var(--color-text-secondary);
}
```

### 5.4 Brand-Tinted Surface Card (Jeton)

```css
/*
  Jeton uses a single brand color at low opacity for all card surfaces.
  This creates a warm, cohesive feel without being overwhelming.
*/
.card-tinted {
  background: rgba(var(--brand-rgb), 0.05); /* e.g., rgba(247, 59, 32, 0.05) */
  border: 1px solid rgba(var(--brand-rgb), 0.1);
  border-radius: 16px;
  padding: clamp(1rem, 2vw, 1.5rem);
  box-shadow: 0 8px 24px rgba(var(--brand-rgb), 0.1),
              0 2px 8px rgba(var(--brand-rgb), 0.05);
}

/* Jeton's media card with backdrop blur */
.card-media {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background-color: rgba(var(--brand-rgb), 0.05);
  border-radius: clamp(12px, 1.2vw, 24px);
  padding: clamp(4px, 0.5vw, 10px);
  width: clamp(256px, 20vw, 377px);
}
```

### 5.5 Badge / Tag

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  font-size: var(--text-micro);
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  border-radius: 9999px;
  background: rgba(99, 91, 255, 0.1);
  color: var(--color-accent);
}
```

---

## 6. Motion & Animation

### Core Timing Functions

```css
:root {
  --ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-in-out:    cubic-bezier(0.4, 0, 0.2, 1);
  --spring:         cubic-bezier(0.34, 1.56, 0.64, 1);

  --duration-fast:    150ms;
  --duration-normal:  300ms;
  --duration-slow:    500ms;
  --duration-slower:  800ms;
}
```

### Scroll-Triggered Entrance Animations

**Fade Up** (Used by all four sites)
```css
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-on-scroll {
  opacity: 0;
  animation: fadeUp 0.8s var(--ease-out-expo) forwards;
}
```

**Staggered Children** (Stripe feature grid, Linear task list)
```css
.stagger-children > * {
  opacity: 0;
  animation: fadeUp 0.6s var(--ease-out-expo) forwards;
}

.stagger-children > *:nth-child(1) { animation-delay: 0ms; }
.stagger-children > *:nth-child(2) { animation-delay: 100ms; }
.stagger-children > *:nth-child(3) { animation-delay: 200ms; }
.stagger-children > *:nth-child(4) { animation-delay: 300ms; }
```

**Scale In** (Apple product reveals)
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### Micro-Interactions

| Element | Animation | Duration | Easing |
|---|---|---|---|
| Button hover | `translateY(-1px)` + shadow | `200ms` | `ease-out` |
| Card hover | `translateY(-4px)` + shadow | `300ms` | `ease-out-expo` |
| Link arrow | Arrow slides right `4px` | `200ms` | `ease-out` |
| Nav item hover | Opacity `0.7 → 1` | `150ms` | `ease` |
| Accordion open | Height auto + fade | `300ms` | `ease-out-expo` |
| Tab switch | Opacity crossfade | `200ms` | `ease-in-out` |

### Scroll-Stacking Cards (Jeton — standout pattern)

Jeton uses a "scroll stack" where full-viewport cards stack on top of each other
as the user scrolls. Each card is `position: sticky` and transforms away.

```css
.scroll-stack {
  --border-radius: 20px;
  --margin: clamp(8px, 0.5vw, 10px);
}

/* Total height = number of cards × 100vh */
.scroll-stack[data-method="transform"] {
  height: calc(var(--card-count) * 100vh);
}

.scroll-stack .views-slot {
  position: sticky;
  top: var(--margin);
  height: calc(100vh - var(--margin) * 2);
  border-radius: var(--border-radius);
  overflow: hidden;
}

.scroll-stack .view {
  position: absolute;
  inset: 0;
  will-change: transform;
  z-index: calc(var(--card-count) - var(--index));
}

/* Each card has a different brand-tinted background */
.scroll-stack .view:nth-child(odd)  { background: #f96853; }
.scroll-stack .view:nth-child(even) { background: #fa8270; }
```

### Coin-Drop Loading Animation (Jeton brand animation)

```css
.coin-drop {
  width: 24px;
  height: 24px;
  border-radius: 100%;
  background-color: #f73b20;
  position: relative;
}

.coin-drop span {
  border-radius: inherit;
  animation: coin-loop 2s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
  will-change: transform, opacity;
}

/* Stagger 6 child elements across the 2s cycle */
.coin-drop span:nth-child(1) { animation-delay: 0.333s; }
.coin-drop span:nth-child(2) { animation-delay: 0.666s; }
.coin-drop span:nth-child(3) { animation-delay: 1.000s; }
.coin-drop span:nth-child(4) { animation-delay: 1.333s; }

@keyframes coin-loop {
  0%   { background: #f74522; opacity: 1; transform: translateY(0) scaleY(1); }
  60%  { opacity: 1; }
  80%  { background: #fdd6ce; opacity: 0; }
  100% { opacity: 0; transform: translateY(200%) scaleY(0); }
}
```

### JavaScript Animation Library Recommendations

| Library | Best For | Used By (approx.) |
|---|---|---|
| **Framer Motion** | React components, layout animations | Linear |
| **GSAP** | Timeline-based scroll animations | Stripe, Apple |
| **Lenis** | Smooth scroll with momentum | Jeton |
| **Intersection Observer API** | Lightweight scroll triggers | All (native) |
| **Lottie** | Complex vector animations | IOTA |
| **CSS `scroll-timeline`** | Pure-CSS scroll-linked animations | Emerging pattern |

### Respecting User Preferences

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 7. Hero Sections

### Pattern A: Centered Headline + Gradient Background (Stripe)

```
┌──────────────────────────────────────────────────┐
│            [animated gradient mesh bg]            │
│                                                   │
│              OVERLINE / BADGE                     │
│                                                   │
│     Financial infrastructure to                   │
│        grow your revenue.                         │
│                                                   │
│   Accept payments, offer financial services...    │
│                                                   │
│     [Get Started]   [Contact Sales]               │
│                                                   │
│           ┌─────────────────────┐                 │
│           │  Product screenshot  │                │
│           │   or data viz        │                │
│           └─────────────────────┘                 │
└──────────────────────────────────────────────────┘
```

**Key traits:**
- Animated gradient mesh or wave as background
- Centered text, max-width ~720px for readability
- Dual CTA buttons (primary + secondary)
- Product visual below the fold line
- Section height: `80–100vh` on desktop

### Pattern B: Product-Centric Full Bleed (Apple)

```
┌──────────────────────────────────────────────────┐
│ ████████████████████████████████████████████████  │
│ ██                                          ████ │
│ ██        iPhone 16 Pro                     ████ │
│ ██                                          ████ │
│ ██     Built for Apple Intelligence         ████ │
│ ██                                          ████ │
│ ██      [Learn more >]  [Buy >]             ████ │
│ ██                                          ████ │
│ ██        ┌─────────────────────┐           ████ │
│ ██        │                     │           ████ │
│ ██        │   PRODUCT IMAGE     │           ████ │
│ ██        │   (huge, hero-size) │           ████ │
│ ██        └─────────────────────┘           ████ │
│ ████████████████████████████████████████████████  │
└──────────────────────────────────────────────────┘
```

**Key traits:**
- Black or white background — no gradients
- Product name as monumental display text
- One-line tagline below
- Minimal text links (not buttons), e.g., "Learn more >" and "Buy >"
- Product image dominates 60%+ of visual space
- Often uses video background or parallax

### Pattern C: Dark Interface Showcase (Linear)

```
┌──────────────────────────────────────────────────┐
│  ▓▓▓▓ near-black background ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│                                                   │
│    The product development system                 │
│    for teams and agents                           │
│                                                   │
│  ┌──────────────────────────────────────────┐     │
│  │  ╔═══════════════════════════════╗       │     │
│  │  ║  App interface screenshot     ║       │     │
│  │  ║  showing actual product UI    ║       │     │
│  │  ╚═══════════════════════════════╝       │     │
│  └──────────────────────────────────────────┘     │
│                                                   │
│           [Get Started — it's free]               │
└──────────────────────────────────────────────────┘
```

**Key traits:**
- Dark background (#08090a) with subtle gradient glow
- Headline uses bold + muted color split
- Real app screenshot/mockup as hero visual
- Subtle radial gradient or spotlight behind product image
- Single CTA

### Pattern D: Animated App Showcase (Jeton)

```
┌──────────────────────────────────────────────────┐
│                                                   │
│       Unify your finances                         │
│                                                   │
│   ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐       │
│   │ App   │ │ App   │ │ App   │ │ App   │       │
│   │ snip  │ │ snip  │ │ snip  │ │ snip  │       │
│   │ img 1 │ │ img 2 │ │ img 3 │ │ img 4 │       │
│   └───────┘ └───────┘ └───────┘ └───────┘       │
│                                                   │
│           All currencies · One App                │
│                                                   │
│           [Open Account]  [Download]              │
│                                                   │
├─── scroll-stacking full-viewport cards ──────────┤
│  ┌──────────────────────────────────────────┐     │
│  │  CARD 1 (sticky):                        │     │
│  │  "Move money across Europe"              │     │
│  │  + app screenshot on right               │     │
│  └──────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────┐     │
│  │  CARD 2 (stacks over card 1):            │     │
│  │  "50+ payment methods"                   │     │
│  │  + different screenshot                  │     │
│  └──────────────────────────────────────────┘     │
└──────────────────────────────────────────────────┘
```

**Key traits:**
- Light warm background with orange-tinted surfaces
- Multiple app screenshot snippets floating in the hero area
- Bold tagline split across multiple visual treatments ("All currencies / One App")
- Below the fold: scroll-stacking sections (each full-viewport, sticky positioned)
- Stepper/progress indicator for multi-section navigation
- Customer testimonial carousel near bottom
- App store download badges as secondary CTA

### Pattern E: Statement + Ecosystem (IOTA)

```
┌──────────────────────────────────────────────────┐
│                                                   │
│   Why Build on IOTA?                              │
│                                                   │
│   A trust layer for the world:                    │
│   Cutting-edge technology with                    │
│   proven real-world adoption                      │
│                                                   │
│   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐           │
│   │ Card │ │ Card │ │ Card │ │ Card │           │
│   │  1   │ │  2   │ │  3   │ │  4   │           │
│   └──────┘ └──────┘ └──────┘ └──────┘           │
│                                                   │
│       [Partner Logo]  [Partner Logo]  ...         │
└──────────────────────────────────────────────────┘
```

**Key traits:**
- Light background, left-aligned or centered headline
- Descriptive subheadline (2–3 lines)
- Immediately followed by feature cards grid
- Partner/trust logos below the fold

### Hero CSS Template

```css
.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 90vh;
  padding: var(--section-padding-lg) 0;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  /* For gradient mesh: use a canvas or SVG animation */
  /* For image: use object-fit: cover */
}

.hero-content {
  max-width: 800px;
  padding: 0 var(--container-padding);
}

.hero-title {
  font-size: var(--text-display);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.05;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  font-size: var(--text-body-lg);
  color: var(--color-text-secondary);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto 2.5rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}
```

---

## 8. Navigation Patterns

### Shared Traits

| Feature | Stripe | Apple | Linear | IOTA | Jeton |
|---|---|---|---|---|---|
| Position | Fixed top | Fixed top | Fixed top | Fixed top | Fixed top |
| Background | Transparent → blur | Transparent → blur | Transparent → blur | Transparent → blur | Transparent → blur |
| Height | ~60px | ~44px | ~56px | ~56px | ~56px |
| Logo | Left | Centered (icon) | Left | Left | Left (wordmark) |
| CTA in nav | ✅ "Sign in" | ❌ (links only) | ✅ "Get Started" | ✅ "Get Started" | ✅ "Sign Up" |
| Mobile menu | Slide-down | Full overlay | Hamburger | Hamburger | Hamburger |
| Mega menu | ✅ dropdown | ✅ flyout | ❌ simple | ❌ simple | Dropdown w/ overlay |
| Language selector | hreflang only | hreflang only | ❌ | ❌ | ✅ dropdown (14 langs) |

### Navigation CSS

```css
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 clamp(1.5rem, 4vw, 4rem);
  transition: background 0.3s ease, backdrop-filter 0.3s ease;
}

.nav.scrolled {
  background: rgba(255, 255, 255, 0.8);    /* or rgba(0,0,0,0.8) for dark */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.nav-link {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.15s ease;
}

.nav-link:hover {
  color: var(--color-text-primary);
}
```

---

## 9. Visual Effects & Polish

### 9.1 Gradient Text (Stripe signature)

```css
.gradient-text {
  background: linear-gradient(135deg, #635bff, #00d4aa, #80e9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### 9.2 Animated Gradient Background (Stripe hero)

```css
.gradient-bg {
  background: linear-gradient(
    -45deg,
    #635bff, #00d4aa, #80e9ff, #a960ee
  );
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### 9.3 Glassmorphism (Linear, Stripe nav)

```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}
```

### 9.4 Glow / Spotlight Effect (Linear)

```css
.spotlight {
  position: relative;
}

.spotlight::before {
  content: '';
  position: absolute;
  top: -200px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(
    circle,
    rgba(94, 106, 210, 0.25) 0%,
    transparent 70%
  );
  pointer-events: none;
  z-index: -1;
}
```

### 9.5 Noise Texture Overlay (Linear, IOTA)

```css
.noise::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.03;
  pointer-events: none;
  z-index: 1;
  mix-blend-mode: overlay;
}
```

### 9.6 Border Gradient (Linear card borders)

```css
.gradient-border {
  position: relative;
  border-radius: 16px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
}

.gradient-border-inner {
  background: var(--color-bg-elevated);
  border-radius: 15px;
  padding: 2rem;
}
```

### 9.7 Parallax Scrolling (Apple)

```css
.parallax-container {
  perspective: 1px;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}

.parallax-layer {
  transform: translateZ(-1px) scale(2);
}
```

---

## 10. Responsive Strategy

### Breakpoints

```css
/* Mobile-first breakpoints matching industry standard */
:root {
  --bp-sm:  640px;    /* Large phones */
  --bp-md:  768px;    /* Tablets */
  --bp-lg:  1024px;   /* Small desktops */
  --bp-xl:  1280px;   /* Desktops */
  --bp-2xl: 1536px;   /* Wide screens */
}

/* Usage */
@media (min-width: 640px)  { /* sm  */ }
@media (min-width: 768px)  { /* md  */ }
@media (min-width: 1024px) { /* lg  */ }
@media (min-width: 1280px) { /* xl  */ }
```

### Responsive Patterns by Site

| Pattern | Mobile | Tablet | Desktop |
|---|---|---|---|
| **Grid columns** | 1 col | 2 col | 3–4 col |
| **Hero text size** | `clamp(2.5rem, ...)` | `clamp(3.5rem, ...)` | `5rem+` |
| **Section padding** | `3rem` | `5rem` | `8rem` |
| **Nav** | Hamburger | Hamburger/compact | Full links |
| **Cards** | Stacked full-width | 2-up grid | 3–4-up grid |
| **Split layouts** | Stacked (image first) | Side-by-side | Side-by-side w/ more gap |

### Fluid Typography (Preferred Approach)

```css
/* Instead of breakpoint-specific sizes, use clamp() */
h1 {
  font-size: clamp(2.5rem, 5vw + 1rem, 5.5rem);
}

p.lead {
  font-size: clamp(1.125rem, 1.5vw, 1.375rem);
}
```

### Container Queries (Emerging — used by Linear)

```css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}
```

---

## 11. Performance & Technical Architecture

### Frameworks & Rendering

| Site | Framework | Rendering | Styling |
|---|---|---|---|
| **Stripe** | Next.js (Pages Router) | SSR + Static | CSS Modules + scoped CSS |
| **Apple** | Custom (no framework) | Static HTML | BEM-style CSS, `built.css` bundles |
| **Linear** | Next.js (App Router) | SSR/RSC | Styled Components + CSS Modules |
| **IOTA** | Next.js (App Router) | SSR | Tailwind CSS + CSS Modules |
| **Jeton** | Nuxt 3 (Vue) | SSR | Scoped component CSS + Lenis smooth scroll |

### Performance Techniques (Common Across All)

1. **Font Optimization**
   - `rel="preload"` on critical font files
   - `woff2` only (best compression)
   - `font-display: swap` or `optional`
   - Subset fonts to reduce file size

2. **Image Optimization**
   - WebP/AVIF formats with fallbacks
   - Responsive `srcset` with multiple resolutions (1x, 2x)
   - `fetchpriority="high"` on hero images
   - Lazy loading (`loading="lazy"`) on below-fold images
   - Image CDN with query params for sizing (`?w=768&q=90`)

3. **Critical CSS**
   - Inline critical above-fold CSS
   - Defer non-critical stylesheets
   - Use `preload` for key CSS files

4. **JavaScript**
   - `defer` attribute on all script tags
   - Code splitting by route / page section
   - Intersection Observer for lazy loading components
   - `nomodule` polyfill bundles for legacy browsers

5. **Resource Hints**
   ```html
   <link rel="preconnect" href="https://fonts.example.com" crossorigin />
   <link rel="dns-prefetch" href="https://analytics.example.com" />
   <link rel="preload" href="/fonts/Inter.woff2" as="font" type="font/woff2" crossorigin />
   ```

### Meta Tags Template

```html
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="format-detection" content="telephone=no, email=no" />

  <title>Page Title | Brand</title>
  <meta name="description" content="Concise, keyword-rich description under 160 chars." />
  <link rel="canonical" href="https://example.com/page" />

  <!-- Open Graph -->
  <meta property="og:title" content="Page Title | Brand" />
  <meta property="og:description" content="Description for social sharing." />
  <meta property="og:image" content="https://example.com/og-image.jpg" />
  <meta property="og:url" content="https://example.com/page" />
  <meta property="og:type" content="website" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@brand" />
  <meta name="twitter:title" content="Page Title | Brand" />
  <meta name="twitter:description" content="Description for social sharing." />
  <meta name="twitter:image" content="https://example.com/og-image.jpg" />

  <!-- Favicon suite -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="icon" type="image/png" href="/favicon.png" sizes="96x96" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
</head>
```

---

## 12. Imagery & Media Strategy

### Image Sizing Guidelines

| Context | Desktop | Mobile | Format |
|---|---|---|---|
| Hero background | 2400×1350 | 1200×800 | WebP, q=70–80 |
| Product screenshot | 1200×900 | 600×450 | WebP/PNG, q=85–95 |
| Feature icon/illustration | 400×400 | 200×200 | SVG (preferred) |
| Logo grid item | 200×80 | 100×40 | SVG |
| Card thumbnail | 600×400 | 300×200 | WebP, q=80 |

### Video Usage

- **Apple**: Full-screen hero video (muted autoplay, `playsinline`)
- **Stripe**: Animated gradient canvas (WebGL / CSS)
- **Linear**: Looping product demo clips in sections

```html
<video
  autoplay
  muted
  loop
  playsinline
  poster="/hero-poster.webp"
  class="hero-video"
>
  <source src="/hero.mp4" type="video/mp4" />
</video>
```

### Icon Style

| Site | Icon Style | Size | Library/Format |
|---|---|---|---|
| Stripe | Line icons, 2px stroke | 20–24px | Custom SVG |
| Apple | Thin line, SF Symbols style | 16–20px | Custom SVG |
| Linear | Filled mini icons, duotone | 16–20px | Custom SVG / Phosphor-style |
| IOTA | Outlined, geometric | 24–32px | Custom SVG |

---

## 13. Accessibility & Semantics

### HTML Structure Pattern (All Sites)

```html
<body>
  <header>
    <nav aria-label="Global">
      <!-- logo + links -->
    </nav>
  </header>

  <main>
    <section aria-labelledby="hero-title">
      <h1 id="hero-title">...</h1>
    </section>

    <section aria-labelledby="features-title">
      <h2 id="features-title">...</h2>
    </section>

    <!-- more sections... -->
  </main>

  <footer>
    <!-- links, legal, socials -->
  </footer>
</body>
```

### Accessibility Checklist

- [ ] All images have meaningful `alt` text (decorative images use `alt=""`)
- [ ] Color contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text
- [ ] Interactive elements have visible focus styles (`:focus-visible`)
- [ ] Skip-to-content link as first focusable element
- [ ] Semantic heading hierarchy (`h1` → `h2` → `h3`, no skipping)
- [ ] `aria-label` on icon-only buttons and nav landmarks
- [ ] `prefers-reduced-motion` media query honored
- [ ] `prefers-color-scheme` media query for dark mode
- [ ] Form inputs have associated `<label>` elements
- [ ] Keyboard navigation works for all interactive elements

### Focus Styles

```css
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Remove default outline only when focus-visible is supported */
:focus:not(:focus-visible) {
  outline: none;
}
```

---

## 14. Dark Mode Design

### Implementation Strategy (Linear approach)

```css
/* Light theme (default) */
:root {
  --bg:          #ffffff;
  --bg-alt:      #f8f9fa;
  --surface:     #ffffff;
  --text:        #111111;
  --text-muted:  #666666;
  --text-subtle: #999999;
  --border:      rgba(0, 0, 0, 0.08);
  --accent:      #5e6ad2;
}

/* Dark theme */
:root[data-theme="dark"],
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg:          #08090a;
    --bg-alt:      #0f1011;
    --surface:     #16171a;
    --text:        #ededef;
    --text-muted:  #a0a0a2;
    --text-subtle: #6c6c6f;
    --border:      rgba(255, 255, 255, 0.08);
    --accent:      #8b8eff;
  }
}
```

### Dark Mode Design Rules

1. **Never use pure black (#000)**  — use near-black (#08090a, #0f1011). Pure black creates too harsh a contrast.
2. **Reduce image brightness** — apply `filter: brightness(0.9)` to images in dark mode.
3. **Lighten shadows** — shadows should use `rgba(0,0,0,0.3)` instead of `0.1` since the surface is already dark.
4. **Use elevated surfaces** — in dark mode, "higher" elements are *lighter*, not darker.
5. **Reduce vibrance of accent colors** — desaturate slightly to prevent eye strain.
6. **Borders become more important** — use subtle white-alpha borders to separate elements.

---

## 15. CSS Architecture & Tokens

### Design Token System

```css
:root {
  /* ─── Spacing Scale ─── */
  --space-1:   0.25rem;   /* 4px */
  --space-2:   0.5rem;    /* 8px */
  --space-3:   0.75rem;   /* 12px */
  --space-4:   1rem;      /* 16px */
  --space-5:   1.5rem;    /* 24px */
  --space-6:   2rem;      /* 32px */
  --space-7:   3rem;      /* 48px */
  --space-8:   4rem;      /* 64px */
  --space-9:   6rem;      /* 96px */
  --space-10:  8rem;      /* 128px */

  /* ─── Border Radius ─── */
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-2xl:  24px;
  --radius-full: 9999px;

  /* ─── Transitions ─── */
  --transition-fast:   150ms ease;
  --transition-normal: 300ms ease;
  --transition-slow:   500ms ease;

  /* ─── Z-Index Scale ─── */
  --z-base:     0;
  --z-dropdown: 10;
  --z-sticky:   20;
  --z-overlay:  30;
  --z-modal:    40;
  --z-toast:    50;
  --z-nav:      100;
}
```

### Utility Classes (Tailwind-inspired, used by IOTA)

```css
/* Common utility patterns seen across the sites */
.text-center    { text-align: center; }
.text-left      { text-align: left; }
.mx-auto        { margin-left: auto; margin-right: auto; }
.sr-only        { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
.flex           { display: flex; }
.flex-col       { flex-direction: column; }
.items-center   { align-items: center; }
.justify-center { justify-content: center; }
.gap-4          { gap: 1rem; }
.gap-8          { gap: 2rem; }
```

---

## 16. Page Section Blueprints

### Blueprint 1: Full Landing Page Structure

```
┌─────────────────────────────────────────────┐
│ 1. NAVBAR (fixed, glassmorphism on scroll)  │
├─────────────────────────────────────────────┤
│ 2. HERO SECTION                             │
│    - Display headline                       │
│    - Subtitle paragraph                     │
│    - CTA buttons                            │
│    - Hero image / video / gradient          │
│    height: 80-100vh                         │
├─────────────────────────────────────────────┤
│ 3. LOGO BAR / SOCIAL PROOF                  │
│    - "Trusted by" or partner logos          │
│    - Horizontal scroll or grid              │
│    height: auto (~120px)                    │
├─────────────────────────────────────────────┤
│ 4. FEATURES / VALUE PROPS                   │
│    - Eyebrow + headline + description       │
│    - 3-4 feature cards in grid              │
│    - Optional icons or illustrations        │
├─────────────────────────────────────────────┤
│ 5. PRODUCT SHOWCASE                         │
│    - Split layout: text left, image right   │
│    - OR: full-width product screenshot      │
│    - Scroll-triggered animations            │
├─────────────────────────────────────────────┤
│ 6. STATS / METRICS                          │
│    - 3-4 large numbers in a row             │
│    - Count-up animation on scroll           │
│    - Background: accent or dark             │
├─────────────────────────────────────────────┤
│ 7. TESTIMONIALS / CASE STUDIES              │
│    - Carousel or stacked quotes             │
│    - Customer logo + name + title           │
│    - Optional customer image                │
├─────────────────────────────────────────────┤
│ 8. HOW IT WORKS / STEPS                     │
│    - Numbered steps (1, 2, 3)               │
│    - Each with icon + title + description   │
│    - Connecting line or timeline visual      │
├─────────────────────────────────────────────┤
│ 9. PRICING or COMPARISON (optional)         │
│    - Tiered pricing cards                   │
│    - Feature comparison table               │
├─────────────────────────────────────────────┤
│ 10. FINAL CTA / CALL TO ACTION              │
│    - Full-width banner                      │
│    - Strong headline + single CTA           │
│    - Background: gradient or dark           │
├─────────────────────────────────────────────┤
│ 11. FOOTER                                  │
│    - Multi-column link groups               │
│    - Logo + description                     │
│    - Social links                           │
│    - Legal / copyright                      │
└─────────────────────────────────────────────┘
```

### Blueprint 2: Feature Section (Stripe-style)

```html
<section class="features">
  <div class="container">
    <div class="section-header text-center">
      <span class="overline">WHY CHOOSE US</span>
      <h2 class="headline-2">Built for scale</h2>
      <p class="body-lg text-muted">
        Handle thousands of transactions per second with consistent speed.
      </p>
    </div>

    <div class="feature-grid">
      <div class="card">
        <div class="card-icon"><!-- SVG icon --></div>
        <h3 class="card-title">99.999% uptime</h3>
        <p class="card-description">Reliable infrastructure you can count on.</p>
      </div>
      <!-- more cards... -->
    </div>
  </div>
</section>
```

### Blueprint 3: Split Content Section (Apple-style)

```html
<section class="split-section">
  <div class="container">
    <div class="split">
      <div class="split-content">
        <span class="overline">FEATURE NAME</span>
        <h2 class="headline-2">Designed for the way you work</h2>
        <p class="body-lg text-muted">
          Description text that explains the feature in 2-3 sentences.
        </p>
        <a href="#" class="link-arrow">Learn more</a>
      </div>
      <div class="split-media">
        <img src="feature.webp" alt="Feature illustration" loading="lazy" />
      </div>
    </div>
  </div>
</section>
```

### Blueprint 4: Stats Bar (Stripe-style)

```html
<section class="stats-section">
  <div class="container">
    <div class="stats-grid">
      <div class="stat-card">
        <span class="number gradient-text">500M+</span>
        <span class="label">API requests per day</span>
      </div>
      <div class="stat-card">
        <span class="number gradient-text">99.999%</span>
        <span class="label">Historical uptime</span>
      </div>
      <div class="stat-card">
        <span class="number gradient-text">135+</span>
        <span class="label">Currencies supported</span>
      </div>
    </div>
  </div>
</section>
```

```css
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
}
```

### Blueprint 5: CTA Banner (Linear-style)

```html
<section class="cta-banner">
  <div class="container text-center">
    <h2 class="headline-2">Ready to get started?</h2>
    <p class="body-lg text-muted">
      Join thousands of teams already building with us.
    </p>
    <div class="cta-actions">
      <a href="#" class="btn-primary">Get Started — it's free</a>
      <a href="#" class="btn-ghost">Talk to sales</a>
    </div>
  </div>
</section>
```

```css
.cta-banner {
  padding: var(--section-padding-lg) 0;
  background: var(--color-bg-secondary);
  position: relative;
  overflow: hidden;
}

/* Optional: spotlight glow */
.cta-banner::before {
  content: '';
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(94,106,210,0.15), transparent 70%);
  pointer-events: none;
}
```

---

## 17. Implementation Checklist

### Foundation
- [ ] Set up CSS custom properties / design tokens
- [ ] Configure font loading with `preload` and `font-display: swap`
- [ ] Implement responsive container system
- [ ] Set up base reset / normalize styles
- [ ] Configure dark mode toggle with `data-theme` attribute

### Navigation
- [ ] Fixed navbar with glassmorphism on scroll
- [ ] Mobile hamburger menu with smooth open/close
- [ ] Active state indicators for current page
- [ ] Keyboard-navigable menu items

### Hero Section
- [ ] Responsive display typography with `clamp()`
- [ ] Background effect (gradient mesh, image, or video)
- [ ] Dual CTA button pair
- [ ] Entrance animation (fade up on load)

### Content Sections
- [ ] Feature card grid (auto-fit, responsive)
- [ ] Split layout sections (text + media)
- [ ] Stats section with large numbers
- [ ] Testimonial/quote component
- [ ] Logo bar / social proof strip
- [ ] Steps/how-it-works section

### Visual Polish
- [ ] Scroll-triggered fade-up animations
- [ ] Staggered entrance for grid children
- [ ] Hover effects on cards (lift + shadow)
- [ ] Gradient text for accent numbers
- [ ] Noise texture overlay (subtle)
- [ ] Glassmorphism on elevated surfaces

### Performance
- [ ] Optimize and compress all images (WebP/AVIF)
- [ ] Lazy-load below-fold images and videos
- [ ] Preconnect to external origins
- [ ] Code-split JavaScript by route
- [ ] Inline critical CSS
- [ ] Set proper cache headers

### Accessibility
- [ ] Semantic HTML5 elements throughout
- [ ] ARIA labels on landmarks and icon buttons
- [ ] Skip-to-content link
- [ ] Focus-visible styles
- [ ] Reduced-motion support
- [ ] 4.5:1+ contrast ratios verified

### SEO & Meta
- [ ] Complete Open Graph tags
- [ ] Twitter Card tags
- [ ] Canonical URL
- [ ] Structured data (JSON-LD) where applicable
- [ ] Favicon suite (SVG, PNG, Apple Touch)
- [ ] `robots.txt` and `sitemap.xml`

---

## 18. Jeton-Specific Patterns Worth Adopting

### 18.1 Brand-Tinted Opacity System

Jeton's most transferable technique: use your single brand color at varying opacities to build the entire surface hierarchy. This creates visual cohesion with minimal design tokens.

```css
:root {
  --brand: 247, 59, 32;  /* r, g, b of primary */
}

/* Surface hierarchy from a single color */
.surface-subtle  { background: rgba(var(--brand), 0.03); }
.surface-light   { background: rgba(var(--brand), 0.05); }
.surface-medium  { background: rgba(var(--brand), 0.1);  }
.border-light    { border: 1px solid rgba(var(--brand), 0.1); }
.border-medium   { border: 1px solid rgba(var(--brand), 0.2); }
.shadow-brand    {
  box-shadow: 0 8px 24px rgba(var(--brand), 0.1),
              0 2px 8px rgba(var(--brand), 0.05);
}
```

### 18.2 Lenis Smooth Scrolling

Jeton uses [Lenis](https://lenis.darkroom.engineering/) for buttery smooth scroll:

```css
/* Lenis base styles */
html.lenis, html.lenis body {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto; /* Lenis handles scroll — disable native */
}

.lenis.lenis-stopped {
  overflow: hidden;
}

.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain; /* Nested scrollable areas */
}
```

```js
// Quick setup
import Lenis from 'lenis';

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
```

### 18.3 Switcher / Pill Tab Component

```css
.switcher {
  display: inline-flex;
  border-radius: 9999px;
  background: rgba(var(--brand), 0.1);
  padding: 2px;
  position: relative;
}

.switcher label {
  padding: 0 1rem;
  height: 44px;
  display: flex;
  align-items: center;
  border-radius: inherit;
  color: var(--brand-color);
  cursor: pointer;
  position: relative;
  transition: color 0.15s ease;
  white-space: nowrap;
}

/* Active indicator (animated pill that slides between tabs) */
.switcher .marker {
  position: absolute;
  height: 44px;
  background: var(--brand-color);
  border-radius: 9999px;
  transition: transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1),
              width 0.3s cubic-bezier(0.05, 0.7, 0.1, 1);
}

.switcher input:checked + label {
  color: #fff;
  pointer-events: none;
}
```

### 18.4 Focus Styles (Jeton's brand-tinted approach)

```css
/* Instead of generic blue outlines, Jeton tints focus rings with brand color */
:focus-visible {
  box-shadow: 0 0 0 1px var(--brand-color),
              0 0 0 3px rgba(var(--brand), 0.5);
}
```

### 18.5 Responsive Fluid Scale (Jeton's `clamp()` pattern)

Jeton uses `clamp()` extensively with a formula that maps from mobile to 2000px+:

```css
/* Pattern: clamp(min, calc(base + 100vw * factor), max) */
.heading {
  font-size: clamp(23px, 19.139px + 100vw * 0.0099, 36px);
}

.card {
  width: clamp(256px, 219.964px + 100vw * 0.0924, 377px);
  border-radius: clamp(12px, 11.415px + 100vw * 0.0015, 14px);
}

/* Ultra-wide (≥2000px) override using vw units */
@media only screen and (min-width: 2000px) {
  .heading { font-size: 1.8vw; }
  .card    { width: 18.85vw; border-radius: 0.7vw; }
}
```

---

## Quick Reference: CSS Starter

Copy this into your project as a starting point:

```css
/* ═══════════════════════════════════════════════
   PREMIUM DESIGN SYSTEM — BASE STYLES
   Inspired by Stripe, Apple, Linear, IOTA
   ═══════════════════════════════════════════════ */

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text);
  background: var(--bg);
}

img, video {
  max-width: 100%;
  height: auto;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  cursor: pointer;
  border: none;
  background: none;
  font: inherit;
  color: inherit;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: var(--font-weight-semibold);
  line-height: 1.15;
  letter-spacing: -0.02em;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

*This guide synthesizes the design patterns, CSS architecture, and UX principles from Stripe, Apple, Linear, IOTA, and Jeton as of March 2026. Use it as a living reference when building premium web experiences.*
