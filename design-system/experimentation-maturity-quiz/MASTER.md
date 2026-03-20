# Design System — Experimentation Maturity Quiz

> **LOGIC:** When building a specific page, first check `design-system/experimentation-maturity-quiz/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Experimentation Maturity Quiz
**Brand:** Kyzn Academy
**Stack:** Next.js 14 (Pages Router), Tailwind CSS, Framer Motion
**Audience:** B2B SaaS — CRO leads, heads of experimentation, growth managers

---

## Core Philosophy

**Minimal & Direct** — White backgrounds, generous white space, single accent colour, no decorative elements.
All pages must feel like a single cohesive product. The quiz is a premium lead magnet, not a generic SaaS tool.

---

## Colour Palette

| Role | Hex | Notes |
|------|-----|-------|
| **Background** | `#ffffff` | White — all pages. No dark mode. |
| **Text primary** | `#111827` (gray-900) | Body headings, labels |
| **Text secondary** | `#6b7280` (gray-500) | Descriptions, sub-copy |
| **Text muted** | `#9ca3af` (gray-400) | Meta, hints, privacy notes |
| **Border light** | `#f3f4f6` (gray-100) | Dividers, section borders |
| **Border medium** | `#e5e7eb` (gray-200) | Form inputs, card borders |
| **Purple — primary** | `#7a00df` | Pill text, icon colour, accent |
| **Purple — gradient** | `linear-gradient(135deg, #7a00df, #a855f7)` | All CTA buttons, selected states |
| **Purple — bg tint** | `rgba(122,0,223,0.08)` | Pill/icon backgrounds, category pills |
| **Purple — border tint** | `rgba(122,0,223,0.25)` | Pill borders |
| **Score: low** | `#ef4444` (red-500) | <40% category scores |
| **Score: medium** | `#f59e0b` (amber-500) | 40–69% category scores |
| **Score: high** | `#22c55e` (green-500) | ≥70% category scores |

**Anti-patterns:**
- ❌ No dark mode — remove all `dark:` classes
- ❌ No blue (#0369a1, #0693e3) in UI chrome
- ❌ No `bg-primary` class (resolves to HSL, not hex — use inline `style` for gradients)

---

## Typography

| Usage | Font | Weight | Size |
|-------|------|--------|------|
| **H1** | RecklessCondensed | 400 (not bold) | `clamp(2.4rem, 5vw, 4.5rem)` |
| **H2 — section headings** | RecklessCondensed | 400 | `clamp(1.6rem, 3vw, 2.5rem)` |
| **H3 — card titles** | RecklessCondensed | 400 | `1.2rem` |
| **Body** | Poppins | 300 (light) | `0.875rem–1rem` |
| **UI labels** | Poppins | 500 (medium) | `0.75rem` |
| **Uppercase pills/labels** | Poppins | 500 | `0.625rem–0.75rem`, `tracking-widest` |

**Rules:**
- `font-family: 'RecklessCondensed', Georgia, serif` on all headings
- `font-weight: 400` for RecklessCondensed — never `font-bold`
- Body uses `font-light` (300) for paragraphs, `font-medium` (500) for labels and CTAs
- Line height `leading-snug` for headings, `leading-relaxed` for body

---

## Page Shell

Every page uses this shell:

```
<div className="min-h-screen bg-white flex flex-col">
  <header className="flex-shrink-0 flex items-center justify-between px-6 py-5 w-full">
    <img src="/images/k-v4-black.png" alt="Kyzn Academy" className="h-8 w-auto" />
    [optional nav item — right aligned]
  </header>
  <main className="flex-1 ...">...</main>
  [optional footer]
</div>
```

- Logo: `h-8 w-auto`, `/images/k-v4-black.png`, always left-aligned in header
- Header padding: `px-6 py-5`
- No ThemeToggle — the quiz is white-only

---

## Interactive Elements

### CTA Buttons (primary)

```jsx
<button
  style={{ background: 'linear-gradient(135deg, #7a00df, #a855f7)' }}
  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white text-sm font-medium
             transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
>
  Button text
</button>
```

### Ghost / Skip Buttons (secondary)

```jsx
<button className="text-sm text-gray-400 hover:text-gray-600 transition-colors font-light cursor-pointer">
  Skip
</button>
```

### Category / Status Pills

```jsx
<span
  style={{ color: '#7a00df', background: 'rgba(122,0,223,0.08)' }}
  className="inline-block text-[10px] font-medium tracking-widest uppercase px-2.5 py-1 rounded-full"
>
  Process
</span>
```

---

## Cards

```jsx
<div className="rounded-xl border border-gray-100 bg-white p-5 sm:p-6">
  ...
</div>
```

- Background: white (`bg-white`)
- Border: `border border-gray-100` — no dark variants
- Radius: `rounded-xl`
- No box-shadow by default; `shadow-sm` acceptable on hover

---

## Score / Data Visualisation

- **Overall score**: large animated number (current `AnimatedScore` component)
- **Category scores**: horizontal progress bars with colour coding (low/medium/high)
- **Radar chart**: existing `RadarChart` component — fill colour `rgba(122,0,223,0.15)`, stroke `#7a00df`
- Avoid pie charts, donut charts, or anything that obscures relative values

---

## Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| `gap-3` | 12px | Inline icon/text gaps |
| `gap-4` | 16px | Form field gaps |
| `space-y-6` | 24px | Within sections |
| `space-y-12` | 48px | Between sections |
| `space-y-16` | 64px | Major page sections |
| `px-6 py-5` | — | Page header |
| `px-6 pb-12` | — | Main content padding |
| `max-w-lg` | 512px | Single-column forms (email capture) |
| `max-w-2xl` | 672px | Quiz card |
| `max-w-4xl` | 896px | Results content |
| `max-w-5xl` | 1024px | Landing page |

---

## Animation

- Page transitions: Framer Motion `fadeUp` — `{ opacity: 0, y: 20 } → { opacity: 1, y: 0 }`
- Stagger children: `staggerChildren: 0.1`
- Question transitions: `opacity: 0, y: 16 → opacity: 1, y: 0`, `duration: 0.18`
- Auto-advance delay: 300ms
- Hover: `hover:-translate-y-0.5 transition-all duration-200`
- ❌ No infinite decorative animations (`animate-bounce`, `animate-pulse` on text)
- ✅ `animate-blob` acceptable on landing page background only
- ✅ `prefers-reduced-motion` respected (Framer Motion handles this automatically)

---

## Anti-Patterns

| Pattern | Instead |
|---------|---------|
| `font-bold` on headings | RecklessCondensed weight 400 |
| Dark mode classes (`dark:`) | Remove — white-only product |
| `ThemeToggle` component | Remove from all pages |
| Emojis as icons | SVG icons only |
| Blue gradients / accents | Purple `#7a00df` only |
| `bg-primary` / `text-primary-500` | Inline `style={{ color: '#7a00df' }}` |
| `from-primary-50` Tailwind gradients | Inline `style={{ background: '...' }}` |

---

## Pre-Delivery Checklist

- [ ] White background on all pages
- [ ] Kyzn logo in header, `h-8`, `px-6 py-5`
- [ ] No ThemeToggle
- [ ] All headings: RecklessCondensed, weight 400, not bold
- [ ] All CTA buttons: purple gradient, rounded-full
- [ ] No dark: classes
- [ ] cursor-pointer on all clickable elements
- [ ] Hover states: `-translate-y-0.5` + shadow increase (200ms)
- [ ] Focus states visible (ring-1 ring-primary/40)
- [ ] Responsive at 375px, 768px, 1024px
- [ ] No horizontal scroll on mobile
